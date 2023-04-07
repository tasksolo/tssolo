export interface DebugInfo {
    server?: ServerInfo | null;
    ip?: IPInfo | null;
    http?: HTTPInfo | null;
    tls?: TLSInfo | null;
}
export interface JSONError {
    messages: string[];
}
export interface GetOpts {
    prev?: any | null;
}
export interface ListOpts {
    stream?: string | null;
    limit?: number | null;
    offset?: number | null;
    after?: string | null;
    sorts?: string[] | null;
    filters?: Filter[] | null;
    prev?: any | null;
}
export interface UpdateOpts {
    prev?: any | null;
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
export interface TaskResponse {
    id: string;
    etag: string;
    generation: number;
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
export interface TokenResponse {
    id: string;
    etag: string;
    generation: number;
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
export interface UserResponse {
    id: string;
    etag: string;
    generation: number;
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
export interface Filter {
    path: string;
    op: string;
    value: string;
}
export interface ObjectCore {
    id: string;
    etag: string;
    generation: number;
}
declare class ClientCore {
    protected baseURL: URL;
    protected headers: Headers;
    private static etag;
    constructor(baseURL: string);
    debugInfo(): Promise<DebugInfo>;
    createName<T1, T2>(name: string, obj: T1): Promise<T2>;
    deleteName(name: string, id: string): Promise<void>;
    getName<T>(name: string, id: string, opts?: GetOpts | null): Promise<T>;
    listName<T>(name: string, opts?: ListOpts | null): Promise<T[]>;
    replaceName<T1, T2>(name: string, id: string, obj: T1): Promise<T2>;
    updateName<T1, T2>(name: string, id: string, obj: T1): Promise<T2>;
    private buildListParams;
    private buildListHeaders;
    private buildGetHeaders;
    protected fetch(method: string, path: string, params?: URLSearchParams | null, headers?: Headers | null, prev?: any | null, body?: any): Promise<any>;
}
export declare class Client extends ClientCore {
    constructor(baseURL: string);
    setBasicAuth(user: string, pass: string): void;
    setAuthToken(token: string): void;
    createTask(obj: Task): Promise<TaskResponse>;
    deleteTask(id: string): Promise<void>;
    getTask(id: string, opts?: GetOpts | null): Promise<TaskResponse>;
    listTask(opts?: ListOpts | null): Promise<TaskResponse[]>;
    replaceTask(id: string, obj: Task): Promise<TaskResponse>;
    updateTask(id: string, obj: Task): Promise<TaskResponse>;
    createToken(obj: Token): Promise<TokenResponse>;
    deleteToken(id: string): Promise<void>;
    getToken(id: string, opts?: GetOpts | null): Promise<TokenResponse>;
    listToken(opts?: ListOpts | null): Promise<TokenResponse[]>;
    replaceToken(id: string, obj: Token): Promise<TokenResponse>;
    updateToken(id: string, obj: Token): Promise<TokenResponse>;
    createUser(obj: User): Promise<UserResponse>;
    deleteUser(id: string): Promise<void>;
    getUser(id: string, opts?: GetOpts | null): Promise<UserResponse>;
    listUser(opts?: ListOpts | null): Promise<UserResponse[]>;
    replaceUser(id: string, obj: User): Promise<UserResponse>;
    updateUser(id: string, obj: User): Promise<UserResponse>;
}
export declare class Error {
    messages: string[];
    constructor(json: JSONError);
    toString(): string;
}
export {};
//# sourceMappingURL=client.d.ts.map