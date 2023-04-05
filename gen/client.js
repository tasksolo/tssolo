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
        return this.fetch('GET', '_debug');
    }
    //// Task
    async createTask(obj) {
        return this.createName("task", obj);
    }
    async deleteTask(id) {
        return this.deleteName("task", id);
    }
    //// Token
    async createToken(obj) {
        return this.createName("token", obj);
    }
    async deleteToken(id) {
        return this.deleteName("token", id);
    }
    //// User
    async createUser(obj) {
        return this.createName("user", obj);
    }
    async deleteUser(id) {
        return this.deleteName("user", id);
    }
    //// Generic
    async createName(name, obj) {
        return this.fetch('POST', encodeURIComponent(name), obj);
    }
    // TODO: Add UpdateOpts
    async deleteName(name, id) {
        return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
    }
    async fetch(method, path, body) {
        const url = new URL(path, this.baseURL);
        const opts = {
            method: method,
            headers: new Headers(this.headers),
            mode: 'cors',
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            keepalive: true,
        };
        if (body) {
            opts.body = JSON.stringify(body);
            opts.headers.set('Content-Type', 'application/json');
        }
        const req = new Request(url, opts);
        const resp = await fetch(req);
        if (!resp.ok) {
            throw new Error(await resp.json());
        }
        if (resp.status == 200) {
            return resp.json();
        }
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