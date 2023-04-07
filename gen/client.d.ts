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
export interface Filter {
    path: string;
    op: string;
    value: string;
}
declare class ClientCore {
    protected baseURL: URL;
    protected headers: Headers;
    private static etag;
    constructor(baseURL: string);
    debugInfo(): Promise<DebugInfo>;
    createName<T>(name: string, obj: T): Promise<T>;
    deleteName(name: string, id: string): Promise<void>;
    getName<T>(name: string, id: string): Promise<T>;
    listName<T>(name: string, opts?: ListOpts | null): Promise<T[]>;
    replaceName<T>(name: string, id: string, obj: T): Promise<T>;
    updateName<T>(name: string, id: string, obj: T): Promise<T>;
    private buildListParams;
    private buildListHeaders;
    protected fetch(method: string, path: string, params?: URLSearchParams | null, headers?: Headers | null, prev?: any | null, body?: any): Promise<any>;
}
export declare class Client extends ClientCore {
    constructor(baseURL: string);
    setBasicAuth(user: string, pass: string): void;
    setAuthToken(token: string): void;
    createTask(obj: Task): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    getTask(id: string): Promise<Task>;
    listTask(opts?: ListOpts | null): Promise<Task[]>;
    replaceTask(id: string, obj: Task): Promise<Task>;
    updateTask(id: string, obj: Task): Promise<Task>;
    createToken(obj: Token): Promise<Token>;
    deleteToken(id: string): Promise<void>;
    getToken(id: string): Promise<Token>;
    listToken(opts?: ListOpts | null): Promise<Token[]>;
    replaceToken(id: string, obj: Token): Promise<Token>;
    updateToken(id: string, obj: Token): Promise<Token>;
    createUser(obj: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getUser(id: string): Promise<User>;
    listUser(opts?: ListOpts | null): Promise<User[]>;
    replaceUser(id: string, obj: User): Promise<User>;
    updateUser(id: string, obj: User): Promise<User>;
}
export declare class Error {
    messages: string[];
    constructor(json: JSONError);
    toString(): string;
}
export {};
//# sourceMappingURL=client.d.ts.map