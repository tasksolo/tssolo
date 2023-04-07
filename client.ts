// Solø API client

export interface DebugInfo {
	server?: ServerInfo | null;
	ip?:     IPInfo | null;
	http?:   HTTPInfo | null;
	tls?:    TLSInfo | null;
}

export interface JSONError {
	messages:  string[];
}

export interface GetOpts {
	prev?: any | null;
}

export interface ListOpts {
	stream?:  string | null;
	limit?:   number | null;
	offset?:  number | null;
	after?:   string | null;
	sorts?:   string[] | null;
	filters?: Filter[] | null;
	prev?:    any | null;
}

export interface UpdateOpts {
	prev?: any | null;
}

export interface Task {
	id?:         string | null;
	etag?:       string | null;
	generation?: number | null;
	userID?:     string | null;
	name?:       string | null;
	complete?:   boolean | null;
	after?:      string | null;
}

export interface Token {
	id?:         string | null;
	etag?:       string | null;
	generation?: number | null;
	userID?:     string | null;
	token?:      string | null;
}

export interface User {
	id?:           string | null;
	etag?:         string | null;
	generation?:   number | null;
	name?:         string | null;
	email?:        string | null;
	password?:     string | null;
	serviceAdmin?: boolean | null;
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

export interface Filter {
	path:   string;
	op:     string;
	value:  string;
}

class ClientCore {
	protected baseURL: URL;
	protected headers: Headers = new Headers();

	private static etag = Symbol('etag');

	constructor(baseURL: string) {
		this.baseURL = new URL(baseURL);
	}

	async debugInfo(): Promise<DebugInfo> {
		return this.fetch('GET', '_debug');
	}

	//// Generic

	async createName<T>(name: string, obj: T): Promise<T> {
		return this.fetch('POST', encodeURIComponent(name), null, null, null, obj);
	}

	// TODO: Add UpdateOpts
	async deleteName(name: string, id: string): Promise<void> {
		return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
	}

	// TODO: Add findName()

	// TODO: Add GetOpts
	async getName<T>(name: string, id: string): Promise<T> {
		return this.fetch('GET', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
	}

	async listName<T>(name: string, opts?: ListOpts | null): Promise<T[]> {
		return this.fetch('GET', `${encodeURIComponent(name)}`, this.buildListParams(opts), this.buildListHeaders(opts), opts?.prev);
	}

	// TODO: Add UpdateOpts
	async replaceName<T>(name: string, id: string, obj: T): Promise<T> {
		return this.fetch('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, null, null, null, obj);
	}

	// TODO: Add UpdateOpts
	async updateName<T>(name: string, id: string, obj: T): Promise<T> {
		return this.fetch('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, null, null, null, obj);
	}

	// TODO: Add streamGetName
	// TODO: Add streamListName

	private buildListParams(opts: ListOpts | null | undefined): URLSearchParams {
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

	private buildListHeaders(opts: ListOpts | null | undefined): Headers {
		const headers = new Headers();

		if (!opts) {
			return headers;
		}

		if (opts.prev) {
			const etag = Object.getOwnPropertyDescriptor(opts.prev, ClientCore.etag)!.value;
			headers.set('If-None-Match', etag);
		}

		return headers;
	}

	protected async fetch(method: string, path: string, params?: URLSearchParams | null, headers?: Headers | null, prev?: any | null, body?: any): Promise<any> {
		const url = new URL(path, this.baseURL);

		if (params) {
			url.search = `?${params.toString()}`;
		}

		const opts: RequestInit = {
			method: method,
			headers: new Headers(this.headers),
			mode: 'cors',
			credentials: 'omit',
			referrerPolicy: 'no-referrer',
			keepalive: true,
		}

		if (headers) {
			for (const [k, v] of headers) {
				(<Headers>opts.headers).append(k, v);
			}
		}

		if (body) {
			opts.body = JSON.stringify(body);
			(<Headers>opts.headers).set('Content-Type', 'application/json');
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

	async createTask(obj: Task): Promise<Task> {
		return this.createName("task", obj);
	}

	// TODO: Add UpdateOpts
	async deleteTask(id: string): Promise<void> {
		return this.deleteName("task", id);
	}

	// TODO: Add find*()

	// TODO: Add GetOpts
	async getTask(id: string): Promise<Task> {
		return this.getName("task", id);
	}

	async listTask(opts?: ListOpts | null): Promise<Task[]> {
		return this.listName("task", opts);
	}

	// TODO: Add UpdateOpts
	async replaceTask(id: string, obj: Task): Promise<Task> {
		return this.replaceName("task", id, obj);
	}

	// TODO: Add UpdateOpts
	async updateTask(id: string, obj: Task): Promise<Task> {
		return this.updateName("task", id, obj);
	}

	// TODO: Add streamGet
	// TODO: Add streamList

	//// Token

	async createToken(obj: Token): Promise<Token> {
		return this.createName("token", obj);
	}

	// TODO: Add UpdateOpts
	async deleteToken(id: string): Promise<void> {
		return this.deleteName("token", id);
	}

	// TODO: Add find*()

	// TODO: Add GetOpts
	async getToken(id: string): Promise<Token> {
		return this.getName("token", id);
	}

	async listToken(opts?: ListOpts | null): Promise<Token[]> {
		return this.listName("token", opts);
	}

	// TODO: Add UpdateOpts
	async replaceToken(id: string, obj: Token): Promise<Token> {
		return this.replaceName("token", id, obj);
	}

	// TODO: Add UpdateOpts
	async updateToken(id: string, obj: Token): Promise<Token> {
		return this.updateName("token", id, obj);
	}

	// TODO: Add streamGet
	// TODO: Add streamList

	//// User

	async createUser(obj: User): Promise<User> {
		return this.createName("user", obj);
	}

	// TODO: Add UpdateOpts
	async deleteUser(id: string): Promise<void> {
		return this.deleteName("user", id);
	}

	// TODO: Add find*()

	// TODO: Add GetOpts
	async getUser(id: string): Promise<User> {
		return this.getName("user", id);
	}

	async listUser(opts?: ListOpts | null): Promise<User[]> {
		return this.listName("user", opts);
	}

	// TODO: Add UpdateOpts
	async replaceUser(id: string, obj: User): Promise<User> {
		return this.replaceName("user", id, obj);
	}

	// TODO: Add UpdateOpts
	async updateUser(id: string, obj: User): Promise<User> {
		return this.updateName("user", id, obj);
	}

	// TODO: Add streamGet
	// TODO: Add streamList
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
