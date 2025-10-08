import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QueryString from "query-string";
import { jwtDecode } from "jwt-decode";

import { generateCodeChallengeFromVerifier, generateCodeVerifier } from "./utils";

// The name of the external authentication type as defined in your brainCloud app.
const EXTERNAL_AUTH_NAME = process.env.REACT_APP_BC_EXTERNAL_AUTH_NAME || "";

// The OAuth2 settings for your desired SSO provider.
const CLIENT_ID = process.env.REACT_APP_SSO_CLIENT_ID || "";
const RESPONSE_TYPE = process.env.REACT_APP_SSO_RESPONSE_TYPE || "";
const SCOPES = process.env.REACT_APP_SSO_SCOPES || "";
const AUTHORIZATION_ENDPOINT = process.env.REACT_APP_SSO_AUTHORIZATION_ENDPOINT || "";
const TOKEN_ENDPOINT = process.env.REACT_APP_SSO_TOKEN_ENDPOINT || "";
// const END_SESSION_ENDPOINT = process.env.REACT_APP_SSO_END_SESSION_ENDPOINT || "";

const App: React.FC = () => {
    // The history and location objects from the global window object.
    const history = window.history;
    const location = window.location;

    // The brainCloud wrapper object from the global window object.
    const bc = window._bc;

    // State to hold the basic profile information of the authenticated user from brainCloud.
    const [profile, setProfile] = useState<any>();

    // State to hold any error encountered with brainCloud.
    const [error, setError] = useState<any>(null);

    // State related to PKCE (for OAuth2 authorization flow).
    const [codeVerifier, setCodeVerifier] = useState<string | null>(null);
    const [codeChallenge, setCodeChallenge] = useState<string | null>(null);

    // State related to brainCloud authentication.
    const [externalId, setExternalId] = useState<string | null>(null);
    const [authenticationToken, setAuthenticationToken] = useState<string | null>(null);

    // State indicating whether the application is waiting for a response from brainCloud.
    const [isBusy, setIsBusy] = useState<boolean>(false);

    // Memoized flag indicating that the app is loaded and ready.
    // This basically means the code verifier and code challenge are populated.
    const isReady = useMemo(() => {
        return codeChallenge && codeVerifier;
    }, [codeChallenge, codeVerifier]);
    
    // A ref to the form element.
    const oauth2Form = useRef<HTMLFormElement>(null);

    // Generates a code verifier and challenge (for PKCE enabled Auth2 authentication).
    const generateCodeVerifierAndChallenge = useCallback(async () => {
        const existingCodeVerifier = localStorage.getItem("code_verifier");

        const newCodeVerifier = existingCodeVerifier == null || existingCodeVerifier.length === 0 ? generateCodeVerifier() : existingCodeVerifier;
        const newCodeChallenge = await generateCodeChallengeFromVerifier(newCodeVerifier);

        setCodeVerifier(newCodeVerifier);
        setCodeChallenge(newCodeChallenge);
    }, []);

    // Effect to trigger the generation of the code verifier and code challenge.
    useEffect(() => {
        generateCodeVerifierAndChallenge();
    }, [generateCodeVerifierAndChallenge]);

    // Handle the authorization code response.
    const handleAuthorizationCode = useCallback(async (authorizationCode: string) => {
        if (codeVerifier == null) return;

        const formData = new URLSearchParams();

        formData.append("grant_type", "authorization_code");
        formData.append("client_id", CLIENT_ID);
        formData.append("redirect_uri", location.origin + location.pathname);
        formData.append("code", authorizationCode);
        formData.append("code_verifier", codeVerifier);

        setIsBusy(true);

        try {
            const tokenResponse = await fetch(TOKEN_ENDPOINT, { method: "POST", body: formData });

            if (tokenResponse) {
                const tokenResponseAsJSON = (await tokenResponse.json());

                console.log("Token Response", tokenResponseAsJSON);

                const idToken = tokenResponseAsJSON['id_token'] || null;

                const decodedToken = idToken != null ? jwtDecode(idToken) : null;

                console.log("Decoded Token", decodedToken);

                setExternalId((decodedToken as any)?.email || decodedToken?.sub);
                setAuthenticationToken(idToken);
            }
        } catch (err: any) {
            console.log("ERROR", err);

            setError(err);
        }

        localStorage.removeItem("code_verifier");

        setIsBusy(false);
    }, [codeVerifier, location.origin, location.pathname]);

    // Triggers the OAuth2 authorization flow.
    const performLogin = useCallback((event: React.MouseEvent) => {
        if (!codeVerifier || !codeChallenge || !oauth2Form.current) return;

        event.preventDefault();
        event.stopPropagation();

        localStorage.setItem("code_verifier", codeVerifier);

        oauth2Form.current.submit();
    }, [codeChallenge, codeVerifier]);

    // Attempts to authenticate the user with brainCloud.
    const performBrainCloudLogin = useCallback(async (externalAuthName: string, principal: string, token: string) => {
        setIsBusy(true);

        bc.authenticateExternal(principal, token, externalAuthName, true, (result: any) => {
            if (result.status >= 200 && result.status < 300) {
                setProfile(result.data);
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
            } else {
                setError(result);
            }

            setIsBusy(false);
        });
    }, [bc]);

    // Effect to handle redirects resulting from the authentication flow.
    useEffect(() => {
        if (!isReady) return;

        let authorizationCode: string | null = null;

        let queryString = location.href.indexOf("?") >= 0 ? location.href.substring(location.href.indexOf("?") + 1) : null;
        if (queryString?.includes("#")) queryString = queryString.substring(0, queryString.indexOf("#"));
        const queryParams = queryString ? QueryString.parse(queryString) : {};

        let hashString = location.href.indexOf("#") >= 0 ? location.href.substring(location.href.indexOf("#") + 1) : null;
        if (hashString?.includes("?")) hashString = hashString.substring(0, hashString.indexOf("?"));
        const hashParams = hashString ? QueryString.parse(hashString) : {};

        // OAuth2 parameters might be present either in the query string or the hash.
        // We check both with a preference for the query string.
        if (queryParams.code && !Array.isArray(queryParams.code)) authorizationCode = queryParams.code;
        else if (hashParams.code && !Array.isArray(hashParams.code)) authorizationCode = hashParams.code;
        else {}

        // If we have the authorization code, proceed with the rest of the flow.
        if (authorizationCode) {
            handleAuthorizationCode(authorizationCode);
        }

        // In any case we replace the history state to clear any parameters from the location.
        history.replaceState(null, "", window.location.pathname);
    }, [handleAuthorizationCode, history, isReady, location.href]);

    // Effect to trigger the authentication with brainCloud once we have an externalId and authenticationToken.
    useEffect(() => {
        if (externalId && authenticationToken) {
            performBrainCloudLogin(EXTERNAL_AUTH_NAME, externalId, authenticationToken);
        }
    }, [authenticationToken, externalId, performBrainCloudLogin]);

    return (
        <div className={"root"}>
            <h1>OAuth2 Authentication Test App</h1>

            {(!isReady || isBusy) && <h3>Please Wait...</h3>}

            {isReady && !isBusy && (
                <>
                    {!profile && (
                        <form ref={oauth2Form} method="post" action={AUTHORIZATION_ENDPOINT} className={"openid-form"}>
                            <input type="hidden" name="client_id" value={CLIENT_ID} />
                            <input type="hidden" name="redirect_uri" value={location.origin + location.pathname} />
                            <input type="hidden" name="response_type" value={RESPONSE_TYPE} />
                            <input type="hidden" name="scope" value={SCOPES} />
                            <input type="hidden" name="state" value={JSON.stringify({ appId: bc.brainCloudClient.getAppId() })} />
                            
                            <input type="hidden" name="code_challenge" value={"" + codeChallenge} />
                            <input type="hidden" name="code_challenge_method" value={"S256"} />

                            <button type="submit" onClick={performLogin}>Sign in (OpenID)</button>
                        </form>
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

                    {error && (
                        <>
                            <h2>Error Message</h2>

                            <p style={{ alignSelf: "stretch" }}>
                                {JSON.stringify(error, undefined, 2)}
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
