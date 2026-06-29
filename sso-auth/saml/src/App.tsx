import React, { useCallback, useEffect, useRef, useState } from "react";
import QueryString from "query-string";

import { generateAuthNRequest } from "./utils";
import packageJson from "../package.json";

// The example app's own version, for the persistent overlay. (The brainCloud
// client + server versions are read at render time, once the wrapper exists.)
const APP_VERSION = packageJson.version;

// Pulls a single string out of a parsed query/hash param (query-string types
// these as string | (string | null)[] | null).
const firstString = (value: string | (string | null)[] | null | undefined): string | null =>
    typeof value === "string" ? value : Array.isArray(value) ? (value[0] ?? null) : null;

// Builds a human-readable message from the error shapes this app produces: an
// SSO provider redirect error, a brainCloud API result, a thrown Error, or a string.
const getErrorMessage = (err: any): string => {
    if (err == null) return "";
    if (typeof err === "string") return err;
    if (err.error || err.error_description) return [err.error, err.error_description].filter(Boolean).join(": ");
    if (err.status_message || err.reason_code) {
        const code = err.reason_code ? ` (reason ${err.reason_code})` : "";
        return `${err.status_message || "Request failed"}${code}`;
    }
    if (err.message) return err.message;
    try { return JSON.stringify(err, undefined, 2); } catch { return String(err); }
};

// The target brainCloud environment
const API_SERVER_HOST = process.env.REACT_APP_BC_API_TARGET_HOST || "";
const API_SERVER_PORT = process.env.REACT_APP_BC_API_TARGET_PORT || "";
const API_SERVER_URL = `https://${API_SERVER_HOST}:${API_SERVER_PORT}`;

// The target brainCloud app id.
const APP_ID = process.env.REACT_APP_BC_APP_ID || "";

// The name of the external authentication type as defined in your brainCloud app.
const EXTERNAL_AUTH_NAME = process.env.REACT_APP_BC_EXTERNAL_AUTH_NAME || "";

// The PAGE_NAME of the final redirect as defined in your brainCloud app's SAML integration settings.
const PAGE_NAME = process.env.REACT_APP_BC_PAGE_NAME;

// The SAML settings for your desired SSO provider.
const ISSUER = "" + process.env.REACT_APP_SSO_ISSUER;
const AUTHORIZATION_ENDPOINT = process.env.REACT_APP_SSO_AUTHORIZATION_ENDPOINT;
// const END_SESSION_ENDPOINT = process.env.REACT_APP_SSO_END_SESSION_ENDPOINT || "";

// The webhook setttings (for testing webhook invocation).
const WEBHOOK_NAME = process.env.REACT_APP_WEBHOOK_NAME || "";
const WEBHOOK_SECRET = process.env.REACT_APP_WEBHOOK_SECRET || "";

const App: React.FC = () => {
    // The history and location objects from the global window object.
    const history = window.history;
    const location = window.location;

    // The brainCloud wrapper object from the global window object.
    const bc = window._bc;

    // brainCloud client (SDK) version, read from the initialized wrapper.
    const CLIENT_VERSION = bc?.brainCloudClient?.version ?? "";

    // State to hold the response data of the webhook invocation from brainCloud.
    const [webhookResponse, setWebhookResponse] = useState<{ status: number; statusText: string | null; responseBody: string | null } | null>(null);

    // State to hold the basic profile information of the authenticated user from brainCloud.
    const [profile, setProfile] = useState<any>();

    // State to hold any error encountered with brainCloud.
    const [error, setError] = useState<any>(null);

    // Server version, retrieved from brainCloud after a successful authentication.
    const [serverVersion, setServerVersion] = useState<string | null>(null);

    // State related to brainCloud authentication.
    const [externalId, setExternalId] = useState<string | null>(null);
    const [authenticationToken, setAuthenticationToken] = useState<string | null>(null);

    // State indicating whether the application is waiting for a response from brainCloud.
    const [isBusy, setIsBusy] = useState<boolean>(false);

    // A ref to the form element.
    const samlForm = useRef<HTMLFormElement>(null);

    // Handle the user id and token id response.
    const handleUserIdAndResponseId = useCallback((userId: string, responseId: string) => {
        if (userId && responseId) {
            setExternalId(userId);
            setAuthenticationToken(responseId);
        }
    }, []);

    // Triggers the SAML authorization flow.
    const performLogin = useCallback((event: React.MouseEvent) => {
        if (!samlForm.current) return;

        event.preventDefault();
        event.stopPropagation();

        if (samlForm.current) {
            (samlForm.current[0] as HTMLFormElement).value = generateAuthNRequest(ISSUER);

            samlForm.current.submit();
        }
    }, []);

    // Attempts to authenticate the user with brainCloud.
    const performBrainCloudLogin = useCallback(async (externalAuthName: string, principal: string, token: string) => {
        setIsBusy(true);
        setError(null);

        bc.authenticateExternal(principal, token, externalAuthName, true, (result: any) => {
            if (result.status >= 200 && result.status < 300) {
                setProfile(result.data);

                // Now that we're authenticated, ask brainCloud for its server version.
                bc.brainCloudClient.authentication.getServerVersion((versionResult: any) => {
                    if (versionResult.status >= 200 && versionResult.status < 300) {
                        setServerVersion(versionResult.data?.serverVersion ?? versionResult.data?.server_version ?? null);
                    }
                });
            } else {
                setError(result);
            };

            setIsBusy(false);
        });
    }, [bc]);

    // Attempts to logout the user from brainCloud.
    const performBrainCloudLogout = useCallback(async () => {
        setIsBusy(true);

        bc.playerState.logout((result: any) => {
            if (result.status >= 200 && result.status < 300) {
                setProfile(null);
                setServerVersion(null);
            } else {
                setError(result);
            }

            setIsBusy(false);
        });
    }, [bc]);

    // Attempts to invoke the configured webhook.
    const performWebHookInvocation = useCallback(async () => {
        setWebhookResponse(null);
        
        const webHookUrl = `${API_SERVER_URL}/webhook/${APP_ID}/${WEBHOOK_NAME}`;
        const webHookSecret = WEBHOOK_SECRET;
        
        const headers = { "x-bc-secret": webHookSecret };

        try {
            const response = await fetch(webHookUrl, { method: "POST", headers });

            setWebhookResponse({
                status: response.status,
                statusText: response.statusText,
                responseBody: await response.text(),
            });
        } catch (err) {
            setError(err);
        }
    }, []);

    // Effect to handle redirects resulting from the authentication flow.
    useEffect(() => {
        let userId: string | null = null;
        let responseId: string | null = null;

        let queryString = location.href.indexOf("?") >= 0 ? location.href.substring(location.href.indexOf("?") + 1) : null;
        if (queryString?.includes("#")) queryString = queryString.substring(0, queryString.indexOf("#"));
        const queryParams = queryString ? QueryString.parse(queryString) : {};

        let hashString = location.href.indexOf("#") >= 0 ? location.href.substring(location.href.indexOf("#") + 1) : null;
        if (hashString?.includes("?")) hashString = hashString.substring(0, hashString.indexOf("?"));
        const hashParams = hashString ? QueryString.parse(hashString) : {};

        // Surface any error returned by the SSO provider in the redirect instead
        // of silently dropping back to the login screen with no feedback.
        const ssoError = firstString(queryParams.error) || firstString(hashParams.error);
        if (ssoError) {
            setError({ error: ssoError, error_description: firstString(queryParams.error_description) || firstString(hashParams.error_description) });
            history.replaceState(null, "", window.location.pathname);
            return;
        }

        // SAML parameters might be present either in the query string or the hash.
        // We check both with a preference for the query string.
        if (queryParams.userId && !Array.isArray(queryParams.userId)) userId = queryParams.userId;
        else if (hashParams.userId && !Array.isArray(hashParams.userId)) userId = hashParams.userId;
        else {}
        if (queryParams.responseId && !Array.isArray(queryParams.responseId)) responseId = queryParams.responseId;
        else if (hashParams.responseId && !Array.isArray(hashParams.responseId)) responseId = hashParams.responseId;
        else {}

        // If we have the user id and response id, proceed with the rest of the flow.
        if (userId && responseId) {
            handleUserIdAndResponseId(userId, responseId);
        }

        // In any case we replace the history state to clear any parameters from the location.
        history.replaceState(null, "", window.location.pathname);
    }, [handleUserIdAndResponseId, history, location.href]);

    // Effect to trigger the authentication with brainCloud once we have an externalId and authenticationToken.
    useEffect(() => {
        if (externalId && authenticationToken) {
            performBrainCloudLogin(EXTERNAL_AUTH_NAME, externalId, authenticationToken);
        }
    }, [authenticationToken, externalId, performBrainCloudLogin]);

    return (
        <div className={"root"}>
            <h1>SAML Authentication Test App</h1>

            {isBusy && <h3>Please Wait...</h3>}

            {!isBusy && (
                <>
                    {!profile && (
                        <>
                        <form ref={samlForm} method="post" action={AUTHORIZATION_ENDPOINT} className={"saml-form"}>
                            <input type="hidden" name="SAMLRequest" value={""} />

                            <input type="hidden" name="RelayState" value={JSON.stringify({ appId: bc.brainCloudClient.getAppId(), pageName: PAGE_NAME })} />

                            <button type="submit" onClick={performLogin}>Sign in (SAML)</button>
                        </form>

                            <label>OR</label>

                            <button onClick={performWebHookInvocation}>Invoke WebHook</button>
                        </>
                    )}

                    {profile && (
                        <>
                            <h2>User Is Authenticated</h2>

                            <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: "0.3125em" }}>
                                <label>Session ID:</label>
                                <code style={{ margin: "auto 0" }}>
                                    {bc.brainCloudClient.getSessionId()}
                                </code>

                                <label>Profile ID:</label>
                                <code style={{ margin: "auto 0" }}>
                                    {profile.profileId}
                                </code>

                                {profile.playerName && (
                                    <>
                                        <label>Profile Name:</label>
                                        <code style={{ margin: "auto 0" }}>
                                            {profile.playerName}
                                        </code>
                                    </>
                                )}
                            </div>

                            <button type="submit" onClick={performBrainCloudLogout}>Logout</button>
                        </>
                    )}

                    {webhookResponse != null && (
                        <>
                            <h2>WebHook Response</h2>

                            <p style={{ alignSelf: "stretch" }}>Status: {webhookResponse.status}</p>

                            {webhookResponse.statusText && webhookResponse.statusText.length > 0 && (
                                <p style={{ alignSelf: "stretch" }}>Status Text: {webhookResponse.statusText}</p>
                            )}

                            <p style={{ alignSelf: "stretch" }}>Response Body: {webhookResponse.responseBody || "EMPTY"}</p>
                        </>
                    )}

                    {error && (
                        <>
                            <h2>Authentication Error</h2>

                            <p style={{ alignSelf: "stretch" }}>
                                {getErrorMessage(error)}
                            </p>

                            <button onClick={() => setError(null)}>Dismiss</button>
                        </>
                    )}
                </>
            )}

            {/* Persistent version overlay shown on every screen. Server version
                appears once the user has authenticated. */}
            <div className={"VersionOverlay"}>
                <div>App: v{APP_VERSION}</div>
                <div>Client: v{CLIENT_VERSION}</div>
                <div>Server: {serverVersion ? `v${serverVersion}` : "—"}</div>
            </div>
        </div>
    );
};

export default App;
