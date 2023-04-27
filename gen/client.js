// Solø API client
const ETagKey = Symbol('etag');
export class Client {
    baseURL;
    headers = new Headers();
    constructor(baseURL) {
        this.baseURL = new URL(baseURL, globalThis?.location?.href);
    }
    // Skipped: setDebug()
    setHeader(name, value) {
        this.headers.set(name, value);
    }
    resetAuth() {
        this.headers.delete('Authorization');
    }
    setBasicAuth(user, pass) {
        const enc = btoa(`${user}:${pass}`);
        this.headers.set('Authorization', `Basic ${enc}`);
    }
    setAuthToken(token) {
        this.headers.set('Authorization', `Bearer ${token}`);
    }
    async debugInfo() {
        const req = this.newReq('GET', '_debug');
        return req.fetchJSON();
    }
    async openAPI() {
        const req = this.newReq('GET', '_openapi');
        return req.fetchJSON();
    }
    async goClient() {
        const req = this.newReq('GET', '_client.go');
        return req.fetchText();
    }
    async tsClient() {
        const req = this.newReq('GET', '_client.ts');
        return req.fetchText();
    }
    //// ShardServerConfig
    async createShardServerConfig(obj) {
        return this.createName('shardserverconfig', obj);
    }
    async deleteShardServerConfig(id, opts) {
        return this.deleteName('shardserverconfig', id, opts);
    }
    async findShardServerConfig(shortID) {
        return this.findName('shardserverconfig', shortID);
    }
    async getShardServerConfig(id, opts) {
        return this.getName('shardserverconfig', id, opts);
    }
    async listShardServerConfig(opts) {
        return this.listName('shardserverconfig', opts);
    }
    async replaceShardServerConfig(id, obj, opts) {
        return this.replaceName('shardserverconfig', id, obj, opts);
    }
    async updateShardServerConfig(id, obj, opts) {
        return this.updateName('shardserverconfig', id, obj, opts);
    }
    async streamGetShardServerConfig(id, opts) {
        return this.streamGetName('shardserverconfig', id, opts);
    }
    async streamListShardServerConfig(opts) {
        return this.streamListName('shardserverconfig', opts);
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
    //// Generic
    async createName(name, obj) {
        // TODO: Set Idempotency-Key
        // TODO: Split out createNameOnce, add retry loop
        const req = this.newReq('POST', encodeURIComponent(name));
        req.setBody(obj);
        return req.fetchObj();
    }
    async deleteName(name, id, opts) {
        // TODO: Set Idempotency-Key
        // TODO: Split out deleteNameOnce, add retry loop
        const req = this.newReq('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
        req.applyUpdateOpts(opts);
        return req.fetchVoid();
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
        // TODO: Split out getNameOnce, add retry loop
        const req = this.newReq('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
        req.applyGetOpts(opts);
        return req.fetchObj();
    }
    async listName(name, opts) {
        // TODO: Split out listNameOnce, add retry loop
        const req = this.newReq('GET', `${encodeURIComponent(name)}`);
        req.applyListOpts(opts);
        return req.fetchList();
    }
    async replaceName(name, id, obj, opts) {
        // TODO: Set Idempotency-Key
        // TODO: Split out replaceNameOnce, add retry loop
        const req = this.newReq('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
        req.applyUpdateOpts(opts);
        req.setBody(obj);
        return req.fetchObj();
    }
    async updateName(name, id, obj, opts) {
        // TODO: Set Idempotency-Key
        // TODO: Split out updateNameOnce, add retry loop
        const req = this.newReq('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
        req.applyUpdateOpts(opts);
        req.setBody(obj);
        return req.fetchObj();
    }
    async streamGetName(name, id, opts) {
        // TODO: Split out streamGetNameOnce, add retry loop
        const req = this.newReq('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
        req.applyGetOpts(opts);
        const controller = new AbortController();
        req.setSignal(controller.signal);
        const resp = await req.fetchStream();
        return new GetStream(resp, controller, opts?.prev);
    }
    async streamListName(name, opts) {
        // TODO: Split out streamListNameOnce, add retry loop
        const req = this.newReq('GET', `${encodeURIComponent(name)}`);
        req.applyListOpts(opts);
        const controller = new AbortController();
        req.setSignal(controller.signal);
        const resp = await req.fetchStream();
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
    newReq(method, path) {
        const url = new URL(path, this.baseURL);
        return new Req(method, url, this.headers);
    }
}
class Scanner {
    reader;
    buf = '';
    constructor(stream) {
        this.reader = stream.pipeThrough(new TextDecoderStream()).getReader();
    }
    async readLine() {
        while (!this.buf.includes('\n')) {
            let chunk;
            try {
                // TODO: Add timeout (15s?) after which we return null, closing the stream
                chunk = await this.reader.read();
            }
            catch {
                return null;
            }
            if (chunk.done) {
                return null;
            }
            this.buf += chunk.value;
        }
        const lineEnd = this.buf.indexOf('\n');
        const line = this.buf.substring(0, lineEnd);
        this.buf = this.buf.substring(lineEnd + 1);
        return line;
    }
}
class StreamEvent {
    eventType = '';
    params = new Map();
    data = '';
    decodeObj() {
        return JSON.parse(this.data);
    }
    decodeList() {
        return JSON.parse(this.data);
    }
}
class EventStream {
    scan;
    constructor(stream) {
        this.scan = new Scanner(stream);
    }
    async readEvent() {
        const data = [];
        const ev = new StreamEvent();
        while (true) {
            const line = await this.scan.readLine();
            if (line == null) {
                return null;
            }
            else if (line.startsWith(':')) {
                continue;
            }
            else if (line.startsWith('event: ')) {
                ev.eventType = trimPrefix(line, 'event: ');
            }
            else if (line.startsWith('data: ')) {
                data.push(trimPrefix(line, 'data: '));
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
}
export class GetStream {
    eventStream;
    controller;
    prev;
    lastEvent = new Date();
    constructor(resp, controller, prev) {
        this.eventStream = new EventStream(resp.body);
        this.controller = controller;
        this.prev = prev ?? null;
    }
    lastEventReceived() {
        return this.lastEvent;
    }
    async abort() {
        this.controller.abort();
    }
    async read() {
        while (true) {
            const ev = await this.eventStream.readEvent();
            if (ev == null) {
                return null;
            }
            this.lastEvent = new Date();
            switch (ev.eventType) {
                case 'initial':
                case 'update':
                    return ev.decodeObj();
                case 'notModified':
                    return this.prev;
                case 'heartbeat':
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
export class ListStream {
    eventStream;
    controller;
    lastEvent = new Date();
    constructor(resp, controller) {
        this.eventStream = new EventStream(resp.body);
        this.controller = controller;
    }
    lastEventReceived() {
        return this.lastEvent;
    }
    async abort() {
        this.controller.abort();
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
            const ev = await this.eventStream.readEvent();
            if (ev == null) {
                return null;
            }
            this.lastEvent = new Date();
            switch (ev.eventType) {
                case 'list':
                    return ev.decodeList();
                case 'notModified':
                    return this.prev;
                case 'heartbeat':
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
            const ev = await this.eventStream.readEvent();
            if (ev == null) {
                return null;
            }
            this.lastEvent = new Date();
            switch (ev.eventType) {
                case 'add':
                    this.objs.splice(parseInt(ev.params.get('new-position'), 10), 0, ev.decodeObj());
                    continue;
                case 'update':
                    this.objs.splice(parseInt(ev.params.get('old-position'), 10), 1);
                    this.objs.splice(parseInt(ev.params.get('new-position'), 10), 0, ev.decodeObj());
                    continue;
                case 'remove':
                    this.objs.splice(parseInt(ev.params.get('old-position'), 10), 1);
                    continue;
                case 'sync':
                    return this.objs;
                case 'notModified':
                    this.objs = this.prev;
                    return this.objs;
                case 'heartbeat':
                    continue;
            }
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
class Req {
    method;
    url;
    params;
    headers;
    prevObj;
    prevList;
    body;
    signal;
    constructor(method, url, headers) {
        this.method = method;
        this.url = url;
        this.params = new URLSearchParams();
        this.headers = new Headers(headers);
    }
    applyGetOpts(opts) {
        if (!opts) {
            return;
        }
        this.setPrevObj('If-None-Match', opts?.prev);
    }
    applyListOpts(opts) {
        if (!opts) {
            return;
        }
        this.setPrevList('If-None-Match', opts?.prev);
        if (opts?.stream) {
            this.setQueryParam('_stream', opts.stream);
        }
        if (opts?.limit) {
            this.setQueryParam('_limit', `${opts.limit}`);
        }
        if (opts?.offset) {
            this.setQueryParam('_offset', `${opts.offset}`);
        }
        if (opts?.after) {
            this.setQueryParam('_after', `${opts.after}`);
        }
        for (const filter of opts?.filters || []) {
            this.setQueryParam(`${filter.path}[${filter.op}]`, filter.value);
        }
        for (const sort of opts?.sorts || []) {
            this.addQueryParam('_sort', sort);
        }
    }
    applyUpdateOpts(opts) {
        if (!opts) {
            return;
        }
        this.setPrevObj('If-Match', opts?.prev);
    }
    setPrevObj(headerName, obj) {
        if (!obj) {
            return;
        }
        this.headers.set(headerName, this.getETag(obj));
        this.prevObj = obj;
    }
    setPrevList(headerName, list) {
        if (!list) {
            return;
        }
        this.headers.set(headerName, this.getETag(list));
        this.prevList = list;
    }
    setSignal(signal) {
        this.signal = signal;
    }
    setBody(obj) {
        this.body = obj;
        this.headers.set('Content-Type', 'application/json');
    }
    setHeader(name, value) {
        this.headers.set(name, value);
    }
    setQueryParam(name, value) {
        this.params.set(name, value);
    }
    addQueryParam(name, value) {
        this.params.append(name, value);
    }
    async fetchObj() {
        this.headers.set('Accept', 'application/json');
        const resp = await this.fetch();
        if (this?.prevObj && resp.status == 304) {
            return this.prevObj;
        }
        await this.throwOnError(resp);
        const obj = await resp.json();
        this.setETag(obj, resp);
        return obj;
    }
    async fetchList() {
        this.headers.set('Accept', 'application/json');
        const resp = await this.fetch();
        if (this?.prevList && resp.status == 304) {
            return this.prevList;
        }
        await this.throwOnError(resp);
        const list = await resp.json();
        this.setETag(list, resp);
        return list;
    }
    async fetchJSON() {
        this.headers.set('Accept', 'application/json');
        const resp = await this.fetch();
        await this.throwOnError(resp);
        return resp.json();
    }
    async fetchText() {
        this.headers.set('Accept', 'text/plain');
        const resp = await this.fetch();
        await this.throwOnError(resp);
        return resp.text();
    }
    async fetchStream() {
        this.headers.set('Accept', 'text/event-stream');
        const resp = await this.fetch();
        await this.throwOnError(resp);
        return resp;
    }
    async fetchVoid() {
        const resp = await this.fetch();
        await this.throwOnError(resp);
    }
    async throwOnError(resp) {
        if (!resp.ok) {
            throw new Error(await resp.json());
        }
    }
    async fetch() {
        this.url.search = `?${this.params}`;
        // TODO: Add timeout
        const reqOpts = {
            method: this.method,
            headers: this.headers,
            mode: 'cors',
            credentials: 'omit',
            referrerPolicy: 'no-referrer',
            keepalive: true,
            signal: this?.signal ?? null,
            body: this?.body ? JSON.stringify(this.body) : null,
        };
        const req = new Request(this.url, reqOpts);
        return fetch(req);
    }
    getETag(obj) {
        const etag = Object.getOwnPropertyDescriptor(obj, ETagKey)?.value;
        if (!etag) {
            throw (new Error({
                messages: [
                    `missing ETagKey in ${obj}`,
                ],
            }));
        }
        return etag;
    }
    setETag(obj, resp) {
        if (resp.headers.has('ETag')) {
            Object.defineProperty(obj, ETagKey, {
                value: resp.headers.get('ETag'),
            });
        }
    }
}
function trimPrefix(s, prefix) {
    return s.substring(prefix.length);
}
//# sourceMappingURL=client.js.map