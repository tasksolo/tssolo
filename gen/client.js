// Solø API client
const ETagKey = Symbol('etag');
class StreamCore {
    reader;
    controller;
    buf = '';
    constructor(resp, controller) {
        this.reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
        this.controller = controller;
    }
    async abort() {
        this.controller.abort();
    }
    async readEvent() {
        const data = [];
        const ev = {
            eventType: '',
            params: new Map(),
            data: '',
        };
        while (true) {
            const line = await this.readLine();
            if (line == null) {
                return null;
            }
            else if (line.startsWith(':')) {
                continue;
            }
            else if (line.startsWith('event: ')) {
                ev.eventType = this.removePrefix(line, 'event: ');
            }
            else if (line.startsWith('data: ')) {
                data.push(this.removePrefix(line, 'data: '));
            }
            else if (line.includes(': ')) {
                const [k, v] = line.split(': ', 2);
                ev.params.set(k, v);
            }
            else if (line == '') {
                ev.data = data.join('\n');
                return ev;
            }
        }
    }
    async readLine() {
        while (true) {
            const lineEnd = this.buf.indexOf('\n');
            if (lineEnd == -1) {
                let chunk;
                try {
                    chunk = await this.reader.read();
                }
                catch {
                    return null;
                }
                if (chunk.done) {
                    return null;
                }
                this.buf += chunk.value;
                continue;
            }
            const line = this.buf.substring(0, lineEnd);
            this.buf = this.buf.substring(lineEnd + 1);
            return line;
        }
    }
    removePrefix(s, prefix) {
        return s.substring(prefix.length);
    }
}
export class GetStream extends StreamCore {
    prev;
    constructor(resp, controller, prev) {
        super(resp, controller);
        this.prev = prev ?? null;
    }
    async read() {
        while (true) {
            const ev = await this.readEvent();
            if (ev == null) {
                return null;
            }
            else if (ev.eventType == 'initial' || ev.eventType == 'update') {
                return JSON.parse(ev.data);
            }
            else if (ev.eventType == 'notModified') {
                if (this.prev == null) {
                    throw new Error({
                        messages: [
                            'notModified without previous',
                        ],
                    });
                }
                const prev = this.prev;
                this.prev = null;
                return prev;
            }
            else if (ev.eventType == 'heartbeat') {
                continue;
            }
        }
    }
    async close() {
        this.abort();
        for await (const _ of this) { }
    }
    async *[Symbol.asyncIterator]() {
        while (true) {
            const obj = await this.read();
            if (obj == null) {
                return;
            }
            yield obj;
        }
    }
}
export class ListStream extends StreamCore {
    constructor(resp, controller) {
        super(resp, controller);
    }
    async close() {
        this.abort();
        for await (const _ of this) { }
    }
    async *[Symbol.asyncIterator]() {
        while (true) {
            const list = await this.read();
            if (list == null) {
                return;
            }
            yield list;
        }
    }
}
export class ListStreamFull extends ListStream {
    prev;
    constructor(resp, controller, prev) {
        super(resp, controller);
        this.prev = prev ?? null;
    }
    async read() {
        while (true) {
            const ev = await this.readEvent();
            if (ev == null) {
                return null;
            }
            else if (ev.eventType == 'list') {
                return JSON.parse(ev.data);
            }
            else if (ev.eventType == 'notModified') {
                if (this.prev == null) {
                    throw new Error({
                        messages: [
                            'notModified without previous',
                        ],
                    });
                }
                const prev = this.prev;
                this.prev = null;
                return prev;
            }
            else if (ev.eventType == 'heartbeat') {
                continue;
            }
        }
    }
}
export class ListStreamDiff extends ListStream {
    prev;
    objs = [];
    constructor(resp, controller, prev) {
        super(resp, controller);
        this.prev = prev ?? null;
    }
    async read() {
        while (true) {
            const ev = await this.readEvent();
            if (ev == null) {
                return null;
            }
            else if (ev.eventType == 'add') {
                const obj = JSON.parse(ev.data);
                this.objs.splice(parseInt(ev.params.get('new-position'), 10), 0, obj);
            }
            else if (ev.eventType == 'update') {
                this.objs.splice(parseInt(ev.params.get('old-position'), 10), 1);
                const obj = JSON.parse(ev.data);
                this.objs.splice(parseInt(ev.params.get('new-position'), 10), 0, obj);
            }
            else if (ev.eventType == 'remove') {
                this.objs.splice(parseInt(ev.params.get('old-position'), 10), 1);
            }
            else if (ev.eventType == 'sync') {
                return this.objs;
            }
            else if (ev.eventType == 'notModified') {
                if (!this.prev) {
                    throw new Error({
                        messages: [
                            "notModified without prev",
                        ],
                    });
                }
                this.objs = this.prev;
                return this.objs;
            }
            else if (ev.eventType == 'heartbeat') {
                continue;
            }
        }
    }
}
class ClientCore {
    baseURL;
    headers = new Headers();
    constructor(baseURL) {
        this.baseURL = new URL(baseURL, globalThis?.location?.href);
    }
    async debugInfo() {
        return this.fetch('GET', '_debug');
    }
    //// Generic
    async createName(name, obj) {
        return this.fetch('POST', encodeURIComponent(name), {
            body: obj,
        });
    }
    async deleteName(name, id, opts) {
        return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
            headers: this.buildUpdateHeaders(opts),
        });
    }
    async findName(name, shortID) {
        const opts = {
            filters: [
                {
                    path: 'id',
                    op: 'hp',
                    value: shortID,
                },
            ],
        };
        const list = await this.listName(name, opts);
        if (list.length != 1) {
            throw new Error({
                messages: [
                    'not found',
                ],
            });
        }
        return list[0];
    }
    async getName(name, id, opts) {
        return this.fetch('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
            headers: this.buildGetHeaders(opts),
            prev: opts?.prev,
        });
    }
    async listName(name, opts) {
        return this.fetch('GET', `${encodeURIComponent(name)}`, {
            params: this.buildListParams(opts),
            headers: this.buildListHeaders(opts),
            prev: opts?.prev,
        });
    }
    async replaceName(name, id, obj, opts) {
        return this.fetch('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
            headers: this.buildUpdateHeaders(opts),
            body: obj,
        });
    }
    async updateName(name, id, obj, opts) {
        return this.fetch('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
            headers: this.buildUpdateHeaders(opts),
            body: obj,
        });
    }
    async streamGetName(name, id, opts) {
        const controller = new AbortController();
        const resp = await this.fetch('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, {
            headers: this.buildGetHeaders(opts),
            stream: true,
            signal: controller.signal,
        });
        return new GetStream(resp, controller, opts?.prev);
    }
    async streamListName(name, opts) {
        const controller = new AbortController();
        const resp = await this.fetch('GET', `${encodeURIComponent(name)}`, {
            params: this.buildListParams(opts),
            headers: this.buildListHeaders(opts),
            stream: true,
            signal: controller.signal,
        });
        try {
            switch (resp.headers.get('Stream-Format')) {
                case 'full':
                    return new ListStreamFull(resp, controller, opts?.prev);
                case 'diff':
                    return new ListStreamDiff(resp, controller, opts?.prev);
                default:
                    throw new Error({
                        messages: [
                            `invalid Stream-Format: ${resp.headers.get('Stream-Format')}`,
                        ],
                    });
            }
        }
        catch (e) {
            controller.abort();
            throw e;
        }
    }
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
        this.addETagHeader(headers, 'If-None-Match', opts?.prev);
        return headers;
    }
    buildGetHeaders(opts) {
        const headers = new Headers();
        this.addETagHeader(headers, 'If-None-Match', opts?.prev);
        return headers;
    }
    buildUpdateHeaders(opts) {
        const headers = new Headers();
        this.addETagHeader(headers, 'If-Match', opts?.prev);
        return headers;
    }
    addETagHeader(headers, name, obj) {
        if (!obj) {
            return;
        }
        const etag = Object.getOwnPropertyDescriptor(obj, ETagKey)?.value;
        if (!etag) {
            throw (new Error({
                messages: [
                    `missing ETagKey in ${obj}`,
                ],
            }));
        }
        headers.set(name, etag);
    }
    async fetch(method, path, opts) {
        const url = new URL(path, this.baseURL);
        if (opts?.params) {
            url.search = `?${opts.params}`;
        }
        // TODO: Add timeout
        // TODO: Add retry strategy
        // TODO: Add Idempotency-Key support
        const reqOpts = {
            method: method,
            headers: new Headers(this.headers),
            mode: 'cors',
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            keepalive: true,
            signal: opts?.signal ?? null,
        };
        if (opts?.headers) {
            for (const [k, v] of opts.headers) {
                reqOpts.headers.append(k, v);
            }
        }
        if (opts?.body) {
            reqOpts.body = JSON.stringify(opts.body);
            reqOpts.headers.set('Content-Type', 'application/json');
        }
        if (opts?.stream) {
            reqOpts.headers.set('Accept', 'text/event-stream');
        }
        const req = new Request(url, reqOpts);
        const resp = await fetch(req);
        if (opts?.prev && resp.status == 304) {
            return opts.prev;
        }
        if (!resp.ok) {
            throw new Error(await resp.json());
        }
        if (resp.status == 200) {
            if (opts?.stream) {
                return resp;
            }
            const js = await resp.json();
            if (resp.headers.has('ETag')) {
                Object.defineProperty(js, ETagKey, {
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
        return this.createName('task', obj);
    }
    async deleteTask(id, opts) {
        return this.deleteName('task', id, opts);
    }
    async findTask(shortID) {
        return this.findName('task', shortID);
    }
    async getTask(id, opts) {
        return this.getName('task', id, opts);
    }
    async listTask(opts) {
        return this.listName('task', opts);
    }
    async replaceTask(id, obj, opts) {
        return this.replaceName('task', id, obj, opts);
    }
    async updateTask(id, obj, opts) {
        return this.updateName('task', id, obj, opts);
    }
    async streamGetTask(id, opts) {
        return this.streamGetName('task', id, opts);
    }
    async streamListTask(opts) {
        return this.streamListName('task', opts);
    }
    //// Token
    async createToken(obj) {
        return this.createName('token', obj);
    }
    async deleteToken(id, opts) {
        return this.deleteName('token', id, opts);
    }
    async findToken(shortID) {
        return this.findName('token', shortID);
    }
    async getToken(id, opts) {
        return this.getName('token', id, opts);
    }
    async listToken(opts) {
        return this.listName('token', opts);
    }
    async replaceToken(id, obj, opts) {
        return this.replaceName('token', id, obj, opts);
    }
    async updateToken(id, obj, opts) {
        return this.updateName('token', id, obj, opts);
    }
    async streamGetToken(id, opts) {
        return this.streamGetName('token', id, opts);
    }
    async streamListToken(opts) {
        return this.streamListName('token', opts);
    }
    //// User
    async createUser(obj) {
        return this.createName('user', obj);
    }
    async deleteUser(id, opts) {
        return this.deleteName('user', id, opts);
    }
    async findUser(shortID) {
        return this.findName('user', shortID);
    }
    async getUser(id, opts) {
        return this.getName('user', id, opts);
    }
    async listUser(opts) {
        return this.listName('user', opts);
    }
    async replaceUser(id, obj, opts) {
        return this.replaceName('user', id, obj, opts);
    }
    async updateUser(id, obj, opts) {
        return this.updateName('user', id, obj, opts);
    }
    async streamGetUser(id, opts) {
        return this.streamGetName('user', id, opts);
    }
    async streamListUser(opts) {
        return this.streamListName('user', opts);
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
// vim: set filetype=typescript:
//# sourceMappingURL=client.js.map