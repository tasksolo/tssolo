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
    // TODO: Add UpdateOpts
    async deleteTask(id) {
        return this.deleteName("task", id);
    }
    // TODO: Add fetch*()
    // TODO: Add GetOpts
    async getTask(id) {
        return this.getName("task", id);
    }
    // TODO: Add ListOpts
    async listTask() {
        return this.listName("task");
    }
    // TODO: Add UpdateOpts
    async replaceTask(id, obj) {
        return this.replaceName("task", id, obj);
    }
    // TODO: Add UpdateOpts
    async updateTask(id, obj) {
        return this.updateName("task", id, obj);
    }
    // TODO: Add streamGet
    // TODO: Add streamList
    //// Token
    async createToken(obj) {
        return this.createName("token", obj);
    }
    // TODO: Add UpdateOpts
    async deleteToken(id) {
        return this.deleteName("token", id);
    }
    // TODO: Add fetch*()
    // TODO: Add GetOpts
    async getToken(id) {
        return this.getName("token", id);
    }
    // TODO: Add ListOpts
    async listToken() {
        return this.listName("token");
    }
    // TODO: Add UpdateOpts
    async replaceToken(id, obj) {
        return this.replaceName("token", id, obj);
    }
    // TODO: Add UpdateOpts
    async updateToken(id, obj) {
        return this.updateName("token", id, obj);
    }
    // TODO: Add streamGet
    // TODO: Add streamList
    //// User
    async createUser(obj) {
        return this.createName("user", obj);
    }
    // TODO: Add UpdateOpts
    async deleteUser(id) {
        return this.deleteName("user", id);
    }
    // TODO: Add fetch*()
    // TODO: Add GetOpts
    async getUser(id) {
        return this.getName("user", id);
    }
    // TODO: Add ListOpts
    async listUser() {
        return this.listName("user");
    }
    // TODO: Add UpdateOpts
    async replaceUser(id, obj) {
        return this.replaceName("user", id, obj);
    }
    // TODO: Add UpdateOpts
    async updateUser(id, obj) {
        return this.updateName("user", id, obj);
    }
    // TODO: Add streamGet
    // TODO: Add streamList
    //// Generic
    async createName(name, obj) {
        return this.fetch('POST', encodeURIComponent(name), obj);
    }
    // TODO: Add UpdateOpts
    async deleteName(name, id) {
        return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
    }
    // TODO: Add findName()
    // TODO: Add GetOpts
    async getName(name, id) {
        return this.fetch('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
    }
    // TODO: Add ListOpts
    async listName(name) {
        return this.fetch('GET', `${encodeURIComponent(name)}`);
    }
    // TODO: Add UpdateOpts
    async replaceName(name, id, obj) {
        return this.fetch('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, obj);
    }
    // TODO: Add UpdateOpts
    async updateName(name, id, obj) {
        return this.fetch('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, obj);
    }
    // TODO: Add streamGetName
    // TODO: Add streamListName
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