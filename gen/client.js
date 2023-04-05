// Solø API client
export class Client {
    baseURL;
    headers = new Headers();
    constructor(baseURL) {
        this.baseURL = new URL(baseURL);
    }
    setBasicAuth(user, pass) {
        const enc = btoa(`${user}:${pass}`);
        this.headers.set('Authorization', `Basic ${enc}`);
    }
    setAuthToken(token) {
        this.headers.set('Authorization', `Bearer ${token}`);
    }
    async debugInfo() {
        return this.fetch('_debug');
    }
    async fetch(path) {
        const url = new URL(path, this.baseURL);
        const req = new Request(url, {
            headers: this.headers,
        });
        const resp = await fetch(req);
        if (!resp.ok) {
            throw new Error(await resp.json());
        }
        return resp.json();
    }
}
export class Error {
    messages;
    constructor(json) {
        this.messages = json.messages;
    }
    toString() {
        return this.messages[0] ?? 'error';
    }
}
//# sourceMappingURL=client.js.map