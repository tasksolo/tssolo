// Solø API client
class ClientCore {
    baseURL;
    headers = new Headers();
    static etag = Symbol('etag');
    constructor(baseURL) {
        this.baseURL = new URL(baseURL);
    }
    async debugInfo() {
        return this.fetch('GET', '_debug');
    }
    //// Generic
    async createName(name, obj) {
        return this.fetch('POST', encodeURIComponent(name), null, null, null, obj);
    }
    // TODO: Add UpdateOpts
    async deleteName(name, id) {
        return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
    }
    // TODO: Add findName()
    async getName(name, id, opts) {
        return this.fetch('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, null, this.buildGetHeaders(opts), opts?.prev);
    }
    async listName(name, opts) {
        return this.fetch('GET', `${encodeURIComponent(name)}`, this.buildListParams(opts), this.buildListHeaders(opts), opts?.prev);
    }
    // TODO: Add UpdateOpts
    async replaceName(name, id, obj) {
        return this.fetch('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, null, null, null, obj);
    }
    // TODO: Add UpdateOpts
    async updateName(name, id, obj) {
        return this.fetch('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, null, null, null, obj);
    }
    // TODO: Add streamGetName
    // TODO: Add streamListName
    buildListParams(opts) {
        const params = new URLSearchParams();
        if (!opts) {
            return params;
        }
        if (opts.stream) {
            params.set('_stream', opts.stream);
        }
        if (opts.limit) {
            params.set('_limit', `${opts.limit}`);
        }
        if (opts.offset) {
            params.set('_offset', `${opts.offset}`);
        }
        if (opts.after) {
            params.set('_after', `${opts.after}`);
        }
        for (const filter of opts.filters || []) {
            params.set(`${filter.path}[${filter.op}]`, filter.value);
        }
        for (const sort of opts.sorts || []) {
            params.append('_sort', sort);
        }
        return params;
    }
    buildListHeaders(opts) {
        const headers = new Headers();
        if (!opts) {
            return headers;
        }
        if (opts.prev) {
            const etag = Object.getOwnPropertyDescriptor(opts.prev, ClientCore.etag).value;
            headers.set('If-None-Match', etag);
        }
        return headers;
    }
    buildGetHeaders(opts) {
        const headers = new Headers();
        if (!opts) {
            return headers;
        }
        if (opts.prev) {
            headers.set('If-None-Match', `"${opts.prev.etag}"`);
        }
        return headers;
    }
    async fetch(method, path, params, headers, prev, body) {
        const url = new URL(path, this.baseURL);
        if (params) {
            url.search = `?${params.toString()}`;
        }
        const opts = {
            method: method,
            headers: new Headers(this.headers),
            mode: 'cors',
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            keepalive: true,
        };
        if (headers) {
            for (const [k, v] of headers) {
                opts.headers.append(k, v);
            }
        }
        if (body) {
            opts.body = JSON.stringify(body);
            opts.headers.set('Content-Type', 'application/json');
        }
        const req = new Request(url, opts);
        const resp = await fetch(req);
        if (prev && resp.status == 304) {
            return prev;
        }
        if (!resp.ok) {
            throw new Error(await resp.json());
        }
        if (resp.status == 200) {
            const js = await resp.json();
            if (Array.isArray(js)) {
                Object.defineProperty(js, ClientCore.etag, {
                    value: resp.headers.get('ETag'),
                });
            }
            return js;
        }
    }
}
export class Client extends ClientCore {
    constructor(baseURL) {
        super(baseURL);
    }
    setBasicAuth(user, pass) {
        const enc = btoa(`${user}:${pass}`);
        this.headers.set('Authorization', `Basic ${enc}`);
    }
    setAuthToken(token) {
        this.headers.set('Authorization', `Bearer ${token}`);
    }
    //// Task
    async createTask(obj) {
        return this.createName("task", obj);
    }
    // TODO: Add UpdateOpts
    async deleteTask(id) {
        return this.deleteName("task", id);
    }
    // TODO: Add find*()
    async getTask(id, opts) {
        return this.getName("task", id, opts);
    }
    async listTask(opts) {
        return this.listName("task", opts);
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
    // TODO: Add find*()
    async getToken(id, opts) {
        return this.getName("token", id, opts);
    }
    async listToken(opts) {
        return this.listName("token", opts);
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
    // TODO: Add find*()
    async getUser(id, opts) {
        return this.getName("user", id, opts);
    }
    async listUser(opts) {
        return this.listName("user", opts);
    }
    // TODO: Add UpdateOpts
    async replaceUser(id, obj) {
        return this.replaceName("user", id, obj);
    }
    // TODO: Add UpdateOpts
    async updateUser(id, obj) {
        return this.updateName("user", id, obj);
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