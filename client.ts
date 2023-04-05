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

	// TODO: Add UpdateOpts
	async deleteTask(id: string): Promise<void> {
		return this.deleteName("task", id);
	}

	// TODO: Add fetch*()

	// TODO: Add GetOpts
	async getTask(id: string): Promise<Task> {
		return this.getName("task", id);
	}

	// TODO: Add ListOpts
	async listTask(): Promise<Task[]> {
		return this.listName("task");
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

	// TODO: Add fetch*()

	// TODO: Add GetOpts
	async getToken(id: string): Promise<Token> {
		return this.getName("token", id);
	}

	// TODO: Add ListOpts
	async listToken(): Promise<Token[]> {
		return this.listName("token");
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

	// TODO: Add fetch*()

	// TODO: Add GetOpts
	async getUser(id: string): Promise<User> {
		return this.getName("user", id);
	}

	// TODO: Add ListOpts
	async listUser(): Promise<User[]> {
		return this.listName("user");
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

	//// Generic

	async createName<T>(name: string, obj: T): Promise<T> {
		return this.fetch('POST', encodeURIComponent(name), obj);
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

	// TODO: Add ListOpts
	async listName<T>(name: string): Promise<T[]> {
		return this.fetch('GET', `${encodeURIComponent(name)}`);
	}

	// TODO: Add UpdateOpts
	async replaceName<T>(name: string, id: string, obj: T): Promise<T> {
		return this.fetch('PUT', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, obj);
	}

	// TODO: Add UpdateOpts
	async updateName<T>(name: string, id: string, obj: T): Promise<T> {
		return this.fetch('PATCH', `${encodeURIComponent(name)}/${encodeURIComponent(id)}`, obj);
	}

	// TODO: Add streamGetName
	// TODO: Add streamListName

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
