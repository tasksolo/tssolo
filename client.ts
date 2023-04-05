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
	id:          string;
	etag:        string;
	generation:  number;
	userID?:     string | null;
	name?:       string | null;
	complete?:   boolean | null;
	after?:      string | null;
}

export interface Token {
	id:          string;
	etag:        string;
	generation:  number;
	userID?:     string | null;
	token?:      string | null;
}

export interface User {
	id:            string;
	etag:          string;
	generation:    number;
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

	async debugInfo(): Promise<DebugInfo> {
		return this.fetch('_debug');
	}

	private async fetch(path: string): Promise<any> {
		const url = new URL(path, this.baseURL);

		const req = new Request(url, {
			headers: this.headers,
		});

		const resp = await fetch(req);
		if (!resp.ok) {
			throw new Error(await resp.json());
		}

		return resp.json();
	}
}

export class Error {
	messages: string[];

	constructor(json: JSONError) {
		this.messages = json.messages;
	}

	toString(): string {
		return this.messages[0];
	}
}
