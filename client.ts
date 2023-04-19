// Solø API client

export interface TaskRequest {
	userID?:   string;
	name?:     string;
	complete?: boolean;
	after?:    string;
}

export interface TaskResponse extends MetadataResponse {
	userID?:   string;
	name?:     string;
	complete?: boolean;
	after?:    string;
}

export interface TokenRequest {
	userID?: string;
	token?:  string;
}

export interface TokenResponse extends MetadataResponse {
	userID?: string;
	token?:  string;
}

export interface UserRequest {
	name?:         string;
	email?:        string;
	password?:     string;
	serviceAdmin?: boolean;
}

export interface UserResponse extends MetadataResponse {
	name?:         string;
	email?:        string;
	password?:     string;
	serviceAdmin?: boolean;
}

export interface MetadataResponse {
	id:           string;
	etag:         string;
	generation:   number;
}

export interface GetOpts<T extends MetadataResponse> {
	prev?: T;
}

export interface ListOpts<T extends MetadataResponse> {
	stream?:  string;
	limit?:   number;
	offset?:  number;
	after?:   string;
	sorts?:   string[];
	filters?: Filter[];
	prev?:    T[];
}

export interface Filter {
	path:   string;
	op:     string;
	value:  string;
}

export interface UpdateOpts<T extends MetadataResponse> {
	prev?: T;
}

export interface JSONError {
	messages:  string[];
}

export interface DebugInfo {
	server: ServerInfo;
	ip:     IPInfo;
	http:   HTTPInfo;
	tls:    TLSInfo;
}

export interface ServerInfo {
	hostname:  string;
}

export interface IPInfo {
	remoteAddr:  string;
}

export interface HTTPInfo {
	protocol:  string;
	method:    string;
	header:    string;
	url:       string;
}

export interface TLSInfo {
	version:             number;
	didResume:           boolean;
	cipherSuite:         number;
	negotiatedProtocol:  string;
	serverName:          string;
}

interface FetchOptions {
	params?:  URLSearchParams;
	headers?: Headers;
	prev?:    any;
	body?:    any;
	signal?:  AbortSignal;
	stream?:  boolean;
}

interface StreamEvent {
	eventType: string;
	params:    Map<string, string>;
	data:      string;
}

const ETagKey = Symbol('etag');

class StreamCore {
	private reader: ReadableStreamDefaultReader;
	private controller: AbortController;

	private buf: string = '';

	constructor(resp: Response, controller: AbortController) {
		this.reader = resp.body!.pipeThrough(new TextDecoderStream()).getReader();
		this.controller = controller;
	}

	async abort() {
		this.controller.abort();
	}

	protected async readEvent(): Promise<StreamEvent | null> {
		const data: string[] = [];
		const ev: StreamEvent = {
			eventType: '',
			params: new Map(),
			data: '',
		};

		while (true) {
			const line = await this.readLine();

			if (line == null) {
				return null;

			} else if (line.startsWith(':')) {
				continue;

			} else if (line.startsWith('event: ')) {
				ev.eventType = this.removePrefix(line, 'event: ');

			} else if (line.startsWith('data: ')) {
				data.push(this.removePrefix(line, 'data: '));

			} else if (line.includes(': ')) {
				const [k, v] = line.split(': ', 2);
				ev.params.set(k!, v!);

			} else if (line == '') {
				ev.data = data.join('\n');
				return ev;
			}
		}
	}

	private async readLine(): Promise<string | null> {
		while (true) {
			const lineEnd = this.buf.indexOf('\n');

			if (lineEnd == -1) {
				let chunk: ReadableStreamReadResult<any>;

				try {
					chunk = await this.reader.read();
				} catch {
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

	private removePrefix(s: string, prefix: string): string {
		return s.substring(prefix.length);
	}
}

export class GetStream<T extends MetadataResponse> extends StreamCore {
	private prev: T | null;

	constructor(resp: Response, controller: AbortController, prev: T | null | undefined) {
		super(resp, controller);

		this.prev = prev ?? null;
	}

	async read(): Promise<T | null> {
		while (true) {
			const ev = await this.readEvent();

			if (ev == null) {
				return null;

			} else if (ev.eventType == 'initial' || ev.eventType == 'update') {
				return JSON.parse(ev.data);

			} else if (ev.eventType == 'notModified') {
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

			} else if (ev.eventType == 'heartbeat') {
				continue;

			}
		}
	}

	async close() {
		this.abort();

		for await (const _ of this) {}
	}

	async *[Symbol.asyncIterator](): AsyncIterableIterator<T> {
		while (true) {
			const obj = await this.read();

			if (obj == null) {
				return;
			}

			yield obj;
		}
	}
}

export abstract class ListStream<T extends MetadataResponse> extends StreamCore {
	constructor(resp: Response, controller: AbortController) {
		super(resp, controller);
	}

	async close() {
		this.abort();

		for await (const _ of this) {}
	}

	abstract read(): Promise<T[] | null>;

	async *[Symbol.asyncIterator](): AsyncIterableIterator<T[]> {
		while (true) {
			const list = await this.read();

			if (list == null) {
				return;
			}

			yield list;
		}
	}
}

export class ListStreamFull<T extends MetadataResponse> extends ListStream<T> {
	private prev: T[] | null;

	constructor(resp: Response, controller: AbortController, prev: T[] | null | undefined) {
		super(resp, controller);
		this.prev = prev ?? null;
	}

	async read(): Promise<T[] | null> {
		while (true) {
			const ev = await this.readEvent();

			if (ev == null) {
				return null;

			} else if (ev.eventType == 'list') {
				return JSON.parse(ev.data);

			} else if (ev.eventType == 'notModified') {
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

			} else if (ev.eventType == 'heartbeat') {
				continue;

			}
		}
	}
}

export class ListStreamDiff<T extends MetadataResponse> extends ListStream<T> {
	private prev: T[] | null;
	private objs: T[] = [];

	constructor(resp: Response, controller: AbortController, prev: T[] | null | undefined) {
		super(resp, controller);
		this.prev = prev ?? null;
	}

	async read(): Promise<T[] | null> {
		while (true) {
			const ev = await this.readEvent();

			if (ev == null) {
				return null;

			} else if (ev.eventType == 'add') {
				const obj = JSON.parse(ev.data) as T;
				this.objs.splice(parseInt(ev.params.get('new-position')!, 10), 0, obj);

			} else if (ev.eventType == 'update') {
				this.objs.splice(parseInt(ev.params.get('old-position')!, 10), 1);

				const obj = JSON.parse(ev.data) as T;
				this.objs.splice(parseInt(ev.params.get('new-position')!, 10), 0, obj);

			} else if (ev.eventType == 'remove') {
				this.objs.splice(parseInt(ev.params.get('old-position')!, 10), 1);

			} else if (ev.eventType == 'sync') {
				return this.objs;

			} else if (ev.eventType == 'notModified') {
				if (!this.prev) {
					throw new Error({
						messages: [
							"notModified without prev",
						],
					});
				}

				this.objs = this.prev;
				return this.objs;

			} else if (ev.eventType == 'heartbeat') {
				continue;

			}
		}
	}
}

class ClientCore {
	protected baseURL: URL;
	protected headers: Headers = new Headers();

	constructor(baseURL: string) {
		this.baseURL = new URL(baseURL, globalThis?.location?.href);
	}

	async debugInfo(): Promise<DebugInfo> {
		return this.fetch('GET', '_debug');
	}

	//// Generic

	async createName<TOut extends MetadataResponse, TIn>(name: string, obj: TIn): Promise<TOut> {
		return this.fetch(
			'POST',
			encodeURIComponent(name),
			{
				body: obj,
			},
		);
	}

	async deleteName<TOut extends MetadataResponse>(name: string, id: string, opts?: UpdateOpts<TOut> | null): Promise<void> {
		return this.fetch(
			'DELETE',
			`${encodeURIComponent(name)}/${encodeURIComponent(id)}`,
			{
				headers: this.buildUpdateHeaders(opts),
			},
		);
	}

	async findName<TOut extends MetadataResponse>(name: string, shortID: string): Promise<TOut> {
		const opts: ListOpts<TOut> = {
			filters: [
				{
					path: 'id',
					op: 'hp',
					value: shortID,
				},
			],
		};

		const list = await this.listName<TOut>(name, opts);

		if (list.length != 1) {
			throw new Error({
				messages: [
					'not found',
				],
			});
		}

		return list[0]!;
	}

	async getName<TOut extends MetadataResponse>(name: string, id: string, opts?: GetOpts<TOut> | null): Promise<TOut> {
		return this.fetch(
			'GET',
			`${encodeURIComponent(name)}/${encodeURIComponent(id)}`,
			{
				headers: this.buildGetHeaders(opts),
				prev: opts?.prev,
			},
		);
	}

	async listName<TOut extends MetadataResponse>(name: string, opts?: ListOpts<TOut> | null): Promise<TOut[]> {
		return this.fetch(
			'GET',
			`${encodeURIComponent(name)}`,
			{
				params: this.buildListParams(opts),
				headers: this.buildListHeaders(opts),
				prev: opts?.prev,
			},
		);
	}

	async replaceName<TOut extends MetadataResponse, TIn>(name: string, id: string, obj: TIn, opts?: UpdateOpts<TOut> | null): Promise<TOut> {
		return this.fetch(
			'PUT',
			`${encodeURIComponent(name)}/${encodeURIComponent(id)}`,
			{
				headers: this.buildUpdateHeaders(opts),
				body: obj,
			},
		);
	}

	async updateName<TOut extends MetadataResponse, TIn>(name: string, id: string, obj: TIn, opts?: UpdateOpts<TOut> | null): Promise<TOut> {
		return this.fetch(
			'PATCH',
			`${encodeURIComponent(name)}/${encodeURIComponent(id)}`,
			{
				headers: this.buildUpdateHeaders(opts),
				body: obj,
			},
		);
	}

	async streamGetName<TOut extends MetadataResponse>(name: string, id: string, opts?: GetOpts<TOut> | null): Promise<GetStream<TOut>> {
		const controller = new AbortController();

		const resp = await this.fetch(
			'GET',
			`${encodeURIComponent(name)}/${encodeURIComponent(id)}`,
			{
				headers: this.buildGetHeaders(opts),
				stream: true,
				signal: controller.signal,
			},
		);

		return new GetStream<TOut>(resp, controller, opts?.prev);
	}

	async streamListName<TOut extends MetadataResponse>(name: string, opts?: ListOpts<TOut> | null): Promise<ListStream<TOut>> {
		const controller = new AbortController();

		const resp = await this.fetch(
			'GET',
			`${encodeURIComponent(name)}`,
			{
				params: this.buildListParams(opts),
				headers: this.buildListHeaders(opts),
				stream: true,
				signal: controller.signal,
			},
		);

		try {
			switch (resp.headers.get('Stream-Format')) {
			case 'full':
				return new ListStreamFull<TOut>(resp, controller, opts?.prev);

			case 'diff':
				return new ListStreamDiff<TOut>(resp, controller, opts?.prev);

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

	private buildListParams<T extends MetadataResponse>(opts: ListOpts<T> | null | undefined): URLSearchParams {
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

	private buildListHeaders<T extends MetadataResponse>(opts: ListOpts<T> | null | undefined): Headers {
		const headers = new Headers();

		this.addETagHeader(headers, 'If-None-Match', opts?.prev);

		return headers;
	}

	private buildGetHeaders<T extends MetadataResponse>(opts: GetOpts<T> | null | undefined): Headers {
		const headers = new Headers();

		this.addETagHeader(headers, 'If-None-Match', opts?.prev);

		return headers;
	}

	private buildUpdateHeaders<T extends MetadataResponse>(opts: UpdateOpts<T> | null | undefined): Headers {
		const headers = new Headers();

		this.addETagHeader(headers, 'If-Match', opts?.prev);

		return headers;
	}

	private addETagHeader(headers: Headers, name: string, obj: any | undefined) {
		if (!obj) {
			return;
		}

		const etag = Object.getOwnPropertyDescriptor(obj, ETagKey)?.value;

		if (!etag) {
			throw(new Error({
				messages: [
					`missing ETagKey in ${obj}`,
				],
			}));
		}

		headers.set(name, etag);
	}

	protected async fetch(method: string, path: string, opts?: FetchOptions): Promise<any> {
		const url = new URL(path, this.baseURL);

		if (opts?.params) {
			url.search = `?${opts.params}`;
		}

		// TODO: Add timeout
		// TODO: Add retry strategy
		// TODO: Add Idempotency-Key support

		const reqOpts: RequestInit = {
			method: method,
			headers: new Headers(this.headers),
			mode: 'cors',
			credentials: 'omit',
			referrerPolicy: 'no-referrer',
			keepalive: true,
			signal: opts?.signal ?? null,
		}

		if (opts?.headers) {
			for (const [k, v] of opts.headers) {
				(<Headers>reqOpts.headers).append(k, v);
			}
		}

		if (opts?.body) {
			reqOpts.body = JSON.stringify(opts.body);
			(<Headers>reqOpts.headers).set('Content-Type', 'application/json');
		}

		if (opts?.stream) {
			(<Headers>reqOpts.headers).set('Accept', 'text/event-stream');
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
	constructor(baseURL: string) {
		super(baseURL);
	}

	setBasicAuth(user: string, pass: string) {
		const enc = btoa(`${user}:${pass}`);
		this.headers.set('Authorization', `Basic ${enc}`);
	}

	setAuthToken(token: string) {
		this.headers.set('Authorization', `Bearer ${token}`);
	}

	//// Task

	async createTask(obj: TaskRequest): Promise<TaskResponse> {
		return this.createName<TaskResponse, TaskRequest>('task', obj);
	}

	async deleteTask(id: string, opts?: UpdateOpts<TaskResponse> | null): Promise<void> {
		return this.deleteName('task', id, opts);
	}

	async findTask(shortID: string): Promise<TaskResponse> {
		return this.findName<TaskResponse>('task', shortID);
	}

	async getTask(id: string, opts?: GetOpts<TaskResponse> | null): Promise<TaskResponse> {
		return this.getName<TaskResponse>('task', id, opts);
	}

	async listTask(opts?: ListOpts<TaskResponse> | null): Promise<TaskResponse[]> {
		return this.listName<TaskResponse>('task', opts);
	}

	async replaceTask(id: string, obj: TaskRequest, opts?: UpdateOpts<TaskResponse> | null): Promise<TaskResponse> {
		return this.replaceName<TaskResponse, TaskRequest>('task', id, obj, opts);
	}

	async updateTask(id: string, obj: TaskRequest, opts?: UpdateOpts<TaskResponse> | null): Promise<TaskResponse> {
		return this.updateName<TaskResponse, TaskRequest>('task', id, obj, opts);
	}

	async streamGetTask(id: string, opts?: GetOpts<TaskResponse> | null): Promise<GetStream<TaskResponse>> {
		return this.streamGetName<TaskResponse>('task', id, opts);
	}

	async streamListTask(opts?: ListOpts<TaskResponse> | null): Promise<ListStream<TaskResponse>> {
		return this.streamListName<TaskResponse>('task', opts);
	}

	//// Token

	async createToken(obj: TokenRequest): Promise<TokenResponse> {
		return this.createName<TokenResponse, TokenRequest>('token', obj);
	}

	async deleteToken(id: string, opts?: UpdateOpts<TokenResponse> | null): Promise<void> {
		return this.deleteName('token', id, opts);
	}

	async findToken(shortID: string): Promise<TokenResponse> {
		return this.findName<TokenResponse>('token', shortID);
	}

	async getToken(id: string, opts?: GetOpts<TokenResponse> | null): Promise<TokenResponse> {
		return this.getName<TokenResponse>('token', id, opts);
	}

	async listToken(opts?: ListOpts<TokenResponse> | null): Promise<TokenResponse[]> {
		return this.listName<TokenResponse>('token', opts);
	}

	async replaceToken(id: string, obj: TokenRequest, opts?: UpdateOpts<TokenResponse> | null): Promise<TokenResponse> {
		return this.replaceName<TokenResponse, TokenRequest>('token', id, obj, opts);
	}

	async updateToken(id: string, obj: TokenRequest, opts?: UpdateOpts<TokenResponse> | null): Promise<TokenResponse> {
		return this.updateName<TokenResponse, TokenRequest>('token', id, obj, opts);
	}

	async streamGetToken(id: string, opts?: GetOpts<TokenResponse> | null): Promise<GetStream<TokenResponse>> {
		return this.streamGetName<TokenResponse>('token', id, opts);
	}

	async streamListToken(opts?: ListOpts<TokenResponse> | null): Promise<ListStream<TokenResponse>> {
		return this.streamListName<TokenResponse>('token', opts);
	}

	//// User

	async createUser(obj: UserRequest): Promise<UserResponse> {
		return this.createName<UserResponse, UserRequest>('user', obj);
	}

	async deleteUser(id: string, opts?: UpdateOpts<UserResponse> | null): Promise<void> {
		return this.deleteName('user', id, opts);
	}

	async findUser(shortID: string): Promise<UserResponse> {
		return this.findName<UserResponse>('user', shortID);
	}

	async getUser(id: string, opts?: GetOpts<UserResponse> | null): Promise<UserResponse> {
		return this.getName<UserResponse>('user', id, opts);
	}

	async listUser(opts?: ListOpts<UserResponse> | null): Promise<UserResponse[]> {
		return this.listName<UserResponse>('user', opts);
	}

	async replaceUser(id: string, obj: UserRequest, opts?: UpdateOpts<UserResponse> | null): Promise<UserResponse> {
		return this.replaceName<UserResponse, UserRequest>('user', id, obj, opts);
	}

	async updateUser(id: string, obj: UserRequest, opts?: UpdateOpts<UserResponse> | null): Promise<UserResponse> {
		return this.updateName<UserResponse, UserRequest>('user', id, obj, opts);
	}

	async streamGetUser(id: string, opts?: GetOpts<UserResponse> | null): Promise<GetStream<UserResponse>> {
		return this.streamGetName<UserResponse>('user', id, opts);
	}

	async streamListUser(opts?: ListOpts<UserResponse> | null): Promise<ListStream<UserResponse>> {
		return this.streamListName<UserResponse>('user', opts);
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

// vim: set filetype=typescript:
