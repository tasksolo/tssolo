// Solø API client
export class Client {
    baseURL;
    constructor(baseURL) {
        this.baseURL = new URL(baseURL);
    }
    async debugInfo() {
        return this.fetch('_debug');
    }
    async fetch(path) {
        const url = new URL(path, this.baseURL);
        const resp = await fetch(url);
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
        return this.messages[0];
    }
}
//# sourceMappingURL=client.js.map