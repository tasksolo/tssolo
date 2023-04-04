// Solø API client
export class Client {
    baseURL;
    constructor(baseURL) {
        this.baseURL = new URL(baseURL);
    }
    async debugInfo() {
        const url = new URL('_debug', this.baseURL);
        const resp = await fetch(url);
        if (!resp.ok) {
            throw await resp.json();
        }
        return resp.json();
    }
}
//# sourceMappingURL=client.js.map