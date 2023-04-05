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

export class Client {
	private baseURL: URL;
	private headers: Headers = new Headers();

	constructor(baseURL: string) {
		this.baseURL = new URL(baseURL);
	}

	setBasicAuth(user: string, pass: string) {
		const enc = btoa(`${user}:${pass}`);
		this.headers.set('Authorization', `Basic ${enc}`);
	}

	setAuthToken(token: string) {
		this.headers.set('Authorization', `Bearer ${token}`);
	}

	async debugInfo(): Promise<DebugInfo> {
		return this.fetch('GET', '_debug');
	}

	//// Task

	async createTask(obj: Task): Promise<Task> {
		return this.createName("task", obj);
	}

	async deleteTask(id: string): Promise<void> {
		return this.deleteName("task", id);
	}

	//// Token

	async createToken(obj: Token): Promise<Token> {
		return this.createName("token", obj);
	}

	async deleteToken(id: string): Promise<void> {
		return this.deleteName("token", id);
	}

	//// User

	async createUser(obj: User): Promise<User> {
		return this.createName("user", obj);
	}

	async deleteUser(id: string): Promise<void> {
		return this.deleteName("user", id);
	}

	//// Generic

	async createName<T>(name: string, obj: T): Promise<T> {
		return this.fetch('POST', encodeURIComponent(name), obj);
	}

	// TODO: Add UpdateOpts
	async deleteName(name: string, id: string): Promise<void> {
		return this.fetch('DELETE', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`);
	}

	private async fetch(method: string, path: string, body?: any): Promise<any> {
		const url = new URL(path, this.baseURL);

		const opts: RequestInit = {
			method: method,
			headers: new Headers(this.headers),
			mode: 'cors',
			credentials: 'omit',
			referrerPolicy: 'no-referrer',
			keepalive: true,
		}

		if (body) {
			opts.body = JSON.stringify(body);
			(<Headers>opts.headers).set('Content-Type', 'application/json');
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
	messages: string[];

	constructor(json: JSONError) {
		this.messages = json.messages;
	}

	toString(): string {
		return this.messages[0] ?? 'error';
	}
}
