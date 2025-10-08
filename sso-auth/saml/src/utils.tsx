import moment from "moment";

// BASE64 ENCODING
const Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (e: string) {
        let t = '';
        let n, r, i, s, o, u, a;
        let f = 0;
        e = Base64._utf8_encode(e);

        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ((n & 3) << 4) | (r >> 4);
            u = ((r & 15) << 2) | (i >> 6);
            a = i & 63;

            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }

            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }

        return t;
    },
    _utf8_encode: function (e: string) {
        e = e.replace(/\r\n/g, '\n');
        let t = '';

        for (let n = 0; n < e.length; n++) {
            const r = e.charCodeAt(n);

            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192);
                t += String.fromCharCode((r & 63) | 128);
            } else {
                t += String.fromCharCode((r >> 12) | 224);
                t += String.fromCharCode(((r >> 6) & 63) | 128);
                t += String.fromCharCode((r & 63) | 128);
            }
        }

        return t;
    },
};

// GENERATING SAML REQUEST
const encodeSamlRedirect = (input: string): string => {
    if (input.length === 0) throw new Error("Cannot encode empty string");

    return Base64.encode(input);
};
const create_UUID = () => {
    let dt = new Date().getTime();

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
};
const authnRequestTemplate = (issuer: string) => {
    const id = create_UUID();
    const issueInstant = moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z';

    return `
		<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${id}" Version="2.0" IssueInstant="${issueInstant}">
			<saml:Issuer>${issuer}</saml:Issuer>
		</samlp:AuthnRequest>
	`;
};
export const generateAuthNRequest = (issuer: string) => {
    const xml = authnRequestTemplate(issuer);

    const encoded = encodeSamlRedirect(xml);

    return encoded;
};
