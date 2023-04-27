// Solø API client

export interface ShardServerConfig {
	shardID?:    string;
	instanceID?: string;
}

export interface Task {
	userID?:   string;
	name?:     string;
	complete?: boolean;
	after?:    string;
}

export interface Token {
	userID?: string;
	token?:  string;
}

export interface User {
	name?:              string;
	email?:             string;
	password?:          string;
	serviceAdmin?:      boolean;
	replicationClient?: boolean;
}

export interface Metadata {
	id:           string;
	etag:         string;
	generation:   number;
}

export interface GetOpts<T> {
	prev?: T & Metadata;
}

export interface ListOpts<T> {
	stream?:  string;
	limit?:   number;
	offset?:  number;
	after?:   string;
	sorts?:   string[];
	filters?: Filter[];
	prev?:    (T & Metadata)[];
}

export interface Filter {
	path:   string;
	op:     string;
	value:  string;
}

export interface UpdateOpts<T> {
	prev?: T & Metadata;
}

export interface JSONError {
	messages:  string[];
}

const ETagKey = Symbol('etag');

export class Client {
	private baseURL: URL;
	private headers: Headers = new Headers();

	constructor(baseURL: string) {
		this.baseURL = new URL(baseURL, globalThis?.location?.href);
	}

	// Skipped: setDebug()

	setHeader(name: string, value: string) {
		this.headers.set(name, value)
	}

	resetAuth() {
		this.headers.delete('Authorization');
	}

	setBasicAuth(user: string, pass: string) {
		const enc = btoa(`${user}:${pass}`);
		this.headers.set('Authorization', `Basic ${enc}`);
	}

	setAuthToken(token: string) {
		this.headers.set('Authorization', `Bearer ${token}`);
	}

	async debugInfo(): Promise<Object> {
		const req = this.newReq('GET', '_debug');
		return req.fetchJSON();
	}

	async openAPI(): Promise<Object> {
		const req = this.newReq('GET', '_openapi');
		return req.fetchJSON();
	}

	async goClient(): Promise<string> {
		const req = this.newReq('GET', '_client.go');
		return req.fetchText();
	}

	async tsClient(): Promise<string> {
		const req = this.newReq('GET', '_client.ts');
		return req.fetchText();
	}

	//// ShardServerConfig

	async createShardServerConfig(obj: ShardServerConfig): Promise<ShardServerConfig & Metadata> {
		return this.createName<ShardServerConfig>('shardserverconfig', obj);
	}

	async deleteShardServerConfig(id: string, opts?: UpdateOpts<ShardServerConfig> | null): Promise<void> {
		return this.deleteName('shardserverconfig', id, opts);
	}

	async findShardServerConfig(shortID: string): Promise<ShardServerConfig & Metadata> {
		return this.findName<ShardServerConfig>('shardserverconfig', shortID);
	}

	async getShardServerConfig(id: string, opts?: GetOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata> {
		return this.getName<ShardServerConfig>('shardserverconfig', id, opts);
	}

	async listShardServerConfig(opts?: ListOpts<ShardServerConfig> | null): Promise<(ShardServerConfig & Metadata)[]> {
		return this.listName<ShardServerConfig>('shardserverconfig', opts);
	}

	async replaceShardServerConfig(id: string, obj: ShardServerConfig, opts?: UpdateOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata> {
		return this.replaceName<ShardServerConfig>('shardserverconfig', id, obj, opts);
	}

	async updateShardServerConfig(id: string, obj: ShardServerConfig, opts?: UpdateOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata> {
		return this.updateName<ShardServerConfig>('shardserverconfig', id, obj, opts);
	}

	async streamGetShardServerConfig(id: string, opts?: GetOpts<ShardServerConfig> | null): Promise<GetStream<ShardServerConfig>> {
		return this.streamGetName<ShardServerConfig>('shardserverconfig', id, opts);
	}

	async streamListShardServerConfig(opts?: ListOpts<ShardServerConfig> | null): Promise<ListStream<ShardServerConfig>> {
		return this.streamListName<ShardServerConfig>('shardserverconfig', opts);
	}

	//// Task

	async createTask(obj: Task): Promise<Task & Metadata> {
		return this.createName<Task>('task', obj);
	}

	async deleteTask(id: string, opts?: UpdateOpts<Task> | null): Promise<void> {
		return this.deleteName('task', id, opts);
	}

	async findTask(shortID: string): Promise<Task & Metadata> {
		return this.findName<Task>('task', shortID);
	}

	async getTask(id: string, opts?: GetOpts<Task> | null): Promise<Task & Metadata> {
		return this.getName<Task>('task', id, opts);
	}

	async listTask(opts?: ListOpts<Task> | null): Promise<(Task & Metadata)[]> {
		return this.listName<Task>('task', opts);
	}

	async replaceTask(id: string, obj: Task, opts?: UpdateOpts<Task> | null): Promise<Task & Metadata> {
		return this.replaceName<Task>('task', id, obj, opts);
	}

	async updateTask(id: string, obj: Task, opts?: UpdateOpts<Task> | null): Promise<Task & Metadata> {
		return this.updateName<Task>('task', id, obj, opts);
	}

	async streamGetTask(id: string, opts?: GetOpts<Task> | null): Promise<GetStream<Task>> {
		return this.streamGetName<Task>('task', id, opts);
	}

	async streamListTask(opts?: ListOpts<Task> | null): Promise<ListStream<Task>> {
		return this.streamListName<Task>('task', opts);
	}

	//// Token

	async createToken(obj: Token): Promise<Token & Metadata> {
		return this.createName<Token>('token', obj);
	}

	async deleteToken(id: string, opts?: UpdateOpts<Token> | null): Promise<void> {
		return this.deleteName('token', id, opts);
	}

	async findToken(shortID: string): Promise<Token & Metadata> {
		return this.findName<Token>('token', shortID);
	}

	async getToken(id: string, opts?: GetOpts<Token> | null): Promise<Token & Metadata> {
		return this.getName<Token>('token', id, opts);
	}

	async listToken(opts?: ListOpts<Token> | null): Promise<(Token & Metadata)[]> {
		return this.listName<Token>('token', opts);
	}

	async replaceToken(id: string, obj: Token, opts?: UpdateOpts<Token> | null): Promise<Token & Metadata> {
		return this.replaceName<Token>('token', id, obj, opts);
	}

	async updateToken(id: string, obj: Token, opts?: UpdateOpts<Token> | null): Promise<Token & Metadata> {
		return this.updateName<Token>('token', id, obj, opts);
	}

	async streamGetToken(id: string, opts?: GetOpts<Token> | null): Promise<GetStream<Token>> {
		return this.streamGetName<Token>('token', id, opts);
	}

	async streamListToken(opts?: ListOpts<Token> | null): Promise<ListStream<Token>> {
		return this.streamListName<Token>('token', opts);
	}

	//// User

	async createUser(obj: User): Promise<User & Metadata> {
		return this.createName<User>('user', obj);
	}

	async deleteUser(id: string, opts?: UpdateOpts<User> | null): Promise<void> {
		return this.deleteName('user', id, opts);
	}

	async findUser(shortID: string): Promise<User & Metadata> {
		return this.findName<User>('user', shortID);
	}

	async getUser(id: string, opts?: GetOpts<User> | null): Promise<User & Metadata> {
		return this.getName<User>('user', id, opts);
	}

	async listUser(opts?: ListOpts<User> | null): Promise<(User & Metadata)[]> {
		return this.listName<User>('user', opts);
	}

	async replaceUser(id: string, obj: User, opts?: UpdateOpts<User> | null): Promise<User & Metadata> {
		return this.replaceName<User>('user', id, obj, opts);
	}

	async updateUser(id: string, obj: User, opts?: UpdateOpts<User> | null): Promise<User & Metadata> {
		return this.updateName<User>('user', id, obj, opts);
	}

	async streamGetUser(id: string, opts?: GetOpts<User> | null): Promise<GetStream<User>> {
		return this.streamGetName<User>('user', id, opts);
	}

	async streamListUser(opts?: ListOpts<User> | null): Promise<ListStream<User>> {
		return this.streamListName<User>('user', opts);
	}

	//// Generic

	async createName<T>(name: string, obj: T): Promise<T & Metadata> {
		// TODO: Set Idempotency-Key
		// TODO: Split out createNameOnce, add retry loop
		const req = this.newReq<T>('POST', encodeURIComponent(name));
		req.setBody(obj);
		return req.fetchObj();
	}

	async deleteName<T>(name: string, id: string, opts?: UpdateOpts<T> | null): Promise<void> {
		// TODO: Set Idempotency-Key
		// TODO: Split out deleteNameOnce, add retry loop
		const req = this.newReq<T>('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
		req.applyUpdateOpts(opts);
		return req.fetchVoid();
	}

	async findName<T>(name: string, shortID: string): Promise<T & Metadata> {
		const opts: ListOpts<T> = {
			filters: [
				{
					path: 'id',
					op: 'hp',
					value: shortID,
				},
			],
		};

		const list = await this.listName<T>(name, opts);

		if (list.length != 1) {
			throw new Error({
				messages: [
					'not found',
				],
			});
		}

		return list[0]!;
	}

	async getName<T>(name: string, id: string, opts?: GetOpts<T> | null): Promise<T & Metadata> {
		// TODO: Split out getNameOnce, add retry loop
		const req = this.newReq<T>('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
		req.applyGetOpts(opts);
		return req.fetchObj();
	}

	async listName<T>(name: string, opts?: ListOpts<T> | null): Promise<(T & Metadata)[]> {
		// TODO: Split out listNameOnce, add retry loop
		const req = this.newReq<T>('GET', `${encodeURIComponent(name)}`);
		req.applyListOpts(opts);
		return req.fetchList();
	}

	async replaceName<T>(name: string, id: string, obj: T, opts?: UpdateOpts<T> | null): Promise<T & Metadata> {
		// TODO: Set Idempotency-Key
		// TODO: Split out replaceNameOnce, add retry loop
		const req = this.newReq<T>('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
		req.applyUpdateOpts(opts);
		req.setBody(obj);
		return req.fetchObj();
	}

	async updateName<T>(name: string, id: string, obj: T, opts?: UpdateOpts<T> | null): Promise<T & Metadata> {
		// TODO: Set Idempotency-Key
		// TODO: Split out updateNameOnce, add retry loop
		const req = this.newReq<T>('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
		req.applyUpdateOpts(opts);
		req.setBody(obj);
		return req.fetchObj();
	}

	async streamGetName<T>(name: string, id: string, opts?: GetOpts<T> | null): Promise<GetStream<T>> {
		// TODO: Split out streamGetNameOnce, add retry loop
		const req = this.newReq<T>('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
		req.applyGetOpts(opts);

		const controller = new AbortController();
		req.setSignal(controller.signal);

		const resp = await req.fetchStream();

		return new GetStream<T>(resp, controller, opts?.prev);
	}

	async streamListName<T>(name: string, opts?: ListOpts<T> | null): Promise<ListStream<T>> {
		// TODO: Split out streamListNameOnce, add retry loop
		const req = this.newReq<T>('GET', `${encodeURIComponent(name)}`);
		req.applyListOpts(opts);

		const controller = new AbortController();
		req.setSignal(controller.signal);

		const resp = await req.fetchStream();

		try {
			switch (resp.headers.get('Stream-Format')) {
			case 'full':
				return new ListStreamFull<T>(resp, controller, opts?.prev);

			case 'diff':
				return new ListStreamDiff<T>(resp, controller, opts?.prev);

			default:
				throw new Error({
					messages: [
						`invalid Stream-Format: ${resp.headers.get('Stream-Format')}`,
					],
				});
			}
		} catch (e) {
			controller.abort();
			throw e;
		}
	}

	private newReq<T = void>(method: string, path: string): Req<T> {
		const url = new URL(path, this.baseURL);
		return new Req<T>(method, url, this.headers);
	}
}

class Scanner {
	private reader: ReadableStreamDefaultReader;
	private buf: string = '';

	constructor(stream: ReadableStream) {
		this.reader = stream.pipeThrough(new TextDecoderStream()).getReader();
	}

	async readLine(): Promise<string | null> {
		while (!this.buf.includes('\n')) {
			let chunk: ReadableStreamReadResult<any>;

			try {
				// TODO: Add timeout (15s?) after which we return null, closing the stream
				chunk = await this.reader.read();
			} catch {
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

class StreamEvent<T> {
	eventType: string = '';
	params:    Map<string, string> = new Map();
	data:      string = '';

	decodeObj(): T & Metadata {
		return JSON.parse(this.data);
	}

	decodeList(): (T & Metadata)[] {
		return JSON.parse(this.data);
	}
}

class EventStream<T> {
	private scan: Scanner;

	constructor(stream: ReadableStream) {
		this.scan = new Scanner(stream);
	}

	async readEvent(): Promise<StreamEvent<T> | null> {
		const data: string[] = [];
		const ev = new StreamEvent<T>();

		while (true) {
			const line = await this.scan.readLine();

			if (line == null) {
				return null;

			} else if (line.startsWith(':')) {
				continue;

			} else if (line.startsWith('event: ')) {
				ev.eventType = trimPrefix(line, 'event: ');

			} else if (line.startsWith('data: ')) {
				data.push(trimPrefix(line, 'data: '));

			} else if (line.includes(': ')) {
				const [k, v] = line.split(': ', 2);
				ev.params.set(k!, v!);

			} else if (line == '') {
				ev.data = data.join('\n');
				return ev;
			}
		}
	}
}

export class GetStream<T> {
	private eventStream: EventStream<T>;
	private controller: AbortController;
	private prev: (T & Metadata) | null;
	private lastEvent: Date = new Date();

	constructor(resp: Response, controller: AbortController, prev: (T & Metadata) | null | undefined) {
		this.eventStream = new EventStream<T>(resp.body!);
		this.controller = controller;
		this.prev = prev ?? null;
	}

	lastEventReceived(): Date {
		return this.lastEvent;
	}

	async abort() {
		this.controller.abort();
	}

	async read(): Promise<(T & Metadata) | null> {
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

		for await (const _ of this) {}
	}

	async *[Symbol.asyncIterator](): AsyncIterableIterator<T & Metadata> {
		while (true) {
			const obj = await this.read();

			if (obj == null) {
				return;
			}

			yield obj;
		}
	}
}

export abstract class ListStream<T> {
	protected eventStream: EventStream<T>;
	private controller: AbortController;
	protected lastEvent: Date = new Date();

	constructor(resp: Response, controller: AbortController) {
		this.eventStream = new EventStream<T>(resp.body!);
		this.controller = controller;
	}

	lastEventReceived(): Date {
		return this.lastEvent;
	}

	async abort() {
		this.controller.abort();
	}

	async close() {
		this.abort();

		for await (const _ of this) {}
	}

	abstract read(): Promise<(T & Metadata)[] | null>;

	async *[Symbol.asyncIterator](): AsyncIterableIterator<(T & Metadata)[]> {
		while (true) {
			const list = await this.read();

			if (list == null) {
				return;
			}

			yield list;
		}
	}
}

export class ListStreamFull<T> extends ListStream<T> {
	private prev: (T & Metadata)[] | null;

	constructor(resp: Response, controller: AbortController, prev: (T & Metadata)[] | null | undefined) {
		super(resp, controller);
		this.prev = prev ?? null;
	}

	async read(): Promise<(T & Metadata)[] | null> {
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

export class ListStreamDiff<T> extends ListStream<T> {
	private prev: (T & Metadata)[] | null;
	private objs: (T & Metadata)[] = [];

	constructor(resp: Response, controller: AbortController, prev: (T & Metadata)[] | null | undefined) {
		super(resp, controller);
		this.prev = prev ?? null;
	}

	async read(): Promise<(T & Metadata)[] | null> {
		while (true) {
			const ev = await this.eventStream.readEvent();

			if (ev == null) {
				return null;
			}

			this.lastEvent = new Date();

			switch (ev.eventType) {
			case 'add':
				this.objs.splice(parseInt(ev.params.get('new-position')!, 10), 0, ev.decodeObj());
				continue;

			case 'update':
				this.objs.splice(parseInt(ev.params.get('old-position')!, 10), 1);
				this.objs.splice(parseInt(ev.params.get('new-position')!, 10), 0, ev.decodeObj());
				continue;

			case 'remove':
				this.objs.splice(parseInt(ev.params.get('old-position')!, 10), 1);
				continue;

			case 'sync':
				return this.objs;

			case 'notModified':
				this.objs = this.prev!;
				return this.objs;

			case 'heartbeat':
				continue;
			}
		}
	}
}

export class Error {
	messages: string[];

	constructor(json: JSONError) {
		this.messages = json.messages;
	}

	toString(): string {
		return this.messages[0] ?? 'error';
	}
}

class Req<T> {
	private method:    string;
	private url:       URL;
	private params:    URLSearchParams;
	private headers:   Headers;
	private prevObj?:  (T & Metadata)
	private prevList?: (T & Metadata)[];
	private body?:     T;
	private signal?:   AbortSignal;

	constructor(method: string, url: URL, headers: Headers) {
		this.method = method;
		this.url = url;

		this.params = new URLSearchParams();
		this.headers = new Headers(headers);
	}

	applyGetOpts(opts: GetOpts<T> | null | undefined) {
		if (!opts) {
			return;
		}

		this.setPrevObj('If-None-Match', opts?.prev);
	}

	applyListOpts(opts: ListOpts<T> | null | undefined) {
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

	applyUpdateOpts(opts: UpdateOpts<T> | null | undefined) {
		if (!opts) {
			return;
		}

		this.setPrevObj('If-Match', opts?.prev);
	}

	setPrevObj(headerName: string, obj: (T & Metadata) | null | undefined) {
		if (!obj) {
			return;
		}

		this.headers.set(headerName, this.getETag(obj));
		this.prevObj = obj;
	}

	setPrevList(headerName: string, list: (T & Metadata)[] | null | undefined) {
		if (!list) {
			return;
		}

		this.headers.set(headerName, this.getETag(list));
		this.prevList = list;
	}

	setSignal(signal: AbortSignal) {
		this.signal = signal;
	}

	setBody(obj: T) {
		this.body = obj;
		this.headers.set('Content-Type', 'application/json');
	}

	setHeader(name: string, value: string) {
		this.headers.set(name, value);
	}

	setQueryParam(name: string, value: string) {
		this.params.set(name, value);
	}

	addQueryParam(name: string, value: string) {
		this.params.append(name, value);
	}

	async fetchObj(): Promise<T & Metadata> {
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

	async fetchList(): Promise<(T & Metadata)[]> {
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

	async fetchJSON(): Promise<Object> {
		this.headers.set('Accept', 'application/json');
		const resp = await this.fetch();
		await this.throwOnError(resp);
		return resp.json();
	}

	async fetchText(): Promise<string> {
		this.headers.set('Accept', 'text/plain');
		const resp = await this.fetch();
		await this.throwOnError(resp);
		return resp.text();
	}

	async fetchStream(): Promise<Response> {
		this.headers.set('Accept', 'text/event-stream');
		const resp = await this.fetch();
		await this.throwOnError(resp);
		return resp;
	}

	async fetchVoid(): Promise<void> {
		const resp = await this.fetch();
		await this.throwOnError(resp);
	}

	async throwOnError(resp: Response) {
		if (!resp.ok) {
			throw new Error(await resp.json());
		}
	}

	async fetch(): Promise<Response> {
		this.url.search = `?${this.params}`;

		// TODO: Add timeout

		const reqOpts: RequestInit = {
			method: this.method,
			headers: this.headers,
			mode: 'cors',
			credentials: 'omit',
			referrerPolicy: 'no-referrer',
			keepalive: true,
			signal: this?.signal ?? null,
			body: this?.body ? JSON.stringify(this.body) : null,
		}

		const req = new Request(this.url, reqOpts);
		return fetch(req);
	}

	private getETag(obj: Object): string {
		const etag = Object.getOwnPropertyDescriptor(obj, ETagKey)?.value;

		if (!etag) {
			throw(new Error({
				messages: [
					`missing ETagKey in ${obj}`,
				],
			}));
		}

		return etag;
	}

	private setETag(obj: Object, resp: Response) {
		if (resp.headers.has('ETag')) {
			Object.defineProperty(obj, ETagKey, {
				value: resp.headers.get('ETag'),
			});
		}
	}
}

function trimPrefix(s: string, prefix: string): string {
	return s.substring(prefix.length);
}
