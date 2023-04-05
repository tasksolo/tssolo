export interface DebugInfo {
    server?: ServerInfo | null;
    ip?: IPInfo | null;
    http?: HTTPInfo | null;
    tls?: TLSInfo | null;
}
export interface JSONError {
    messages: string[];
}
export interface Task {
    id?: string | null;
    etag?: string | null;
    generation?: number | null;
    userID?: string | null;
    name?: string | null;
    complete?: boolean | null;
    after?: string | null;
}
export interface Token {
    id?: string | null;
    etag?: string | null;
    generation?: number | null;
    userID?: string | null;
    token?: string | null;
}
export interface User {
    id?: string | null;
    etag?: string | null;
    generation?: number | null;
    name?: string | null;
    email?: string | null;
    password?: string | null;
    serviceAdmin?: boolean | null;
}
export interface ServerInfo {
    hostname: string;
}
export interface IPInfo {
    remoteAddr: string;
}
export interface HTTPInfo {
    protocol: string;
    method: string;
    header: string;
    url: string;
}
export interface TLSInfo {
    version: number;
    didResume: boolean;
    cipherSuite: number;
    negotiatedProtocol: string;
    serverName: string;
}
export declare class Client {
    private baseURL;
    private headers;
    constructor(baseURL: string);
    setBasicAuth(user: string, pass: string): void;
    setAuthToken(token: string): void;
    debugInfo(): Promise<DebugInfo>;
    createTask(obj: Task): Promise<Task>;
    createToken(obj: Token): Promise<Token>;
    createUser(obj: User): Promise<User>;
    createName<T>(name: string, obj: T): Promise<T>;
    private fetch;
}
export declare class Error {
    messages: string[];
    constructor(json: JSONError);
    toString(): string;
}
//# sourceMappingURL=client.d.ts.map