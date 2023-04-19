export interface TaskRequest {
    userID?: string;
    name?: string;
    complete?: boolean;
    after?: string;
}
export interface TaskResponse extends MetadataResponse {
    userID?: string;
    name?: string;
    complete?: boolean;
    after?: string;
}
export interface TokenRequest {
    userID?: string;
    token?: string;
}
export interface TokenResponse extends MetadataResponse {
    userID?: string;
    token?: string;
}
export interface UserRequest {
    name?: string;
    email?: string;
    password?: string;
    serviceAdmin?: boolean;
}
export interface UserResponse extends MetadataResponse {
    name?: string;
    email?: string;
    password?: string;
    serviceAdmin?: boolean;
}
export interface MetadataResponse {
    id: string;
    etag: string;
    generation: number;
}
export interface GetOpts<T extends MetadataResponse> {
    prev?: T;
}
export interface ListOpts<T extends MetadataResponse> {
    stream?: string;
    limit?: number;
    offset?: number;
    after?: string;
    sorts?: string[];
    filters?: Filter[];
    prev?: T[];
}
export interface Filter {
    path: string;
    op: string;
    value: string;
}
export interface UpdateOpts<T extends MetadataResponse> {
    prev?: T;
}
export interface JSONError {
    messages: string[];
}
export interface DebugInfo {
    server: ServerInfo;
    ip: IPInfo;
    http: HTTPInfo;
    tls: TLSInfo;
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
interface FetchOptions {
    params?: URLSearchParams;
    headers?: Headers;
    prev?: any;
    body?: any;
    signal?: AbortSignal;
    stream?: boolean;
}
interface StreamEvent {
    eventType: string;
    params: Map<string, string>;
    data: string;
}
declare class StreamCore {
    private reader;
    private controller;
    private buf;
    constructor(resp: Response, controller: AbortController);
    abort(): Promise<void>;
    protected readEvent(): Promise<StreamEvent | null>;
    private readLine;
    private removePrefix;
}
export declare class GetStream<T extends MetadataResponse> extends StreamCore {
    private prev;
    constructor(resp: Response, controller: AbortController, prev: T | null | undefined);
    read(): Promise<T | null>;
    close(): Promise<void>;
    [Symbol.asyncIterator](): AsyncIterableIterator<T>;
}
export declare abstract class ListStream<T extends MetadataResponse> extends StreamCore {
    constructor(resp: Response, controller: AbortController);
    close(): Promise<void>;
    abstract read(): Promise<T[] | null>;
    [Symbol.asyncIterator](): AsyncIterableIterator<T[]>;
}
export declare class ListStreamFull<T extends MetadataResponse> extends ListStream<T> {
    private prev;
    constructor(resp: Response, controller: AbortController, prev: T[] | null | undefined);
    read(): Promise<T[] | null>;
}
export declare class ListStreamDiff<T extends MetadataResponse> extends ListStream<T> {
    private prev;
    private objs;
    constructor(resp: Response, controller: AbortController, prev: T[] | null | undefined);
    read(): Promise<T[] | null>;
}
declare class ClientCore {
    protected baseURL: URL;
    protected headers: Headers;
    constructor(baseURL: string);
    debugInfo(): Promise<DebugInfo>;
    createName<TOut extends MetadataResponse, TIn>(name: string, obj: TIn): Promise<TOut>;
    deleteName<TOut extends MetadataResponse>(name: string, id: string, opts?: UpdateOpts<TOut> | null): Promise<void>;
    findName<TOut extends MetadataResponse>(name: string, shortID: string): Promise<TOut>;
    getName<TOut extends MetadataResponse>(name: string, id: string, opts?: GetOpts<TOut> | null): Promise<TOut>;
    listName<TOut extends MetadataResponse>(name: string, opts?: ListOpts<TOut> | null): Promise<TOut[]>;
    replaceName<TOut extends MetadataResponse, TIn>(name: string, id: string, obj: TIn, opts?: UpdateOpts<TOut> | null): Promise<TOut>;
    updateName<TOut extends MetadataResponse, TIn>(name: string, id: string, obj: TIn, opts?: UpdateOpts<TOut> | null): Promise<TOut>;
    streamGetName<TOut extends MetadataResponse>(name: string, id: string, opts?: GetOpts<TOut> | null): Promise<GetStream<TOut>>;
    streamListName<TOut extends MetadataResponse>(name: string, opts?: ListOpts<TOut> | null): Promise<ListStream<TOut>>;
    private buildListParams;
    private buildListHeaders;
    private buildGetHeaders;
    private buildUpdateHeaders;
    private addETagHeader;
    protected fetch(method: string, path: string, opts?: FetchOptions): Promise<any>;
}
export declare class Client extends ClientCore {
    constructor(baseURL: string);
    setBasicAuth(user: string, pass: string): void;
    setAuthToken(token: string): void;
    createTask(obj: TaskRequest): Promise<TaskResponse>;
    deleteTask(id: string, opts?: UpdateOpts<TaskResponse> | null): Promise<void>;
    findTask(shortID: string): Promise<TaskResponse>;
    getTask(id: string, opts?: GetOpts<TaskResponse> | null): Promise<TaskResponse>;
    listTask(opts?: ListOpts<TaskResponse> | null): Promise<TaskResponse[]>;
    replaceTask(id: string, obj: TaskRequest, opts?: UpdateOpts<TaskResponse> | null): Promise<TaskResponse>;
    updateTask(id: string, obj: TaskRequest, opts?: UpdateOpts<TaskResponse> | null): Promise<TaskResponse>;
    streamGetTask(id: string, opts?: GetOpts<TaskResponse> | null): Promise<GetStream<TaskResponse>>;
    streamListTask(opts?: ListOpts<TaskResponse> | null): Promise<ListStream<TaskResponse>>;
    createToken(obj: TokenRequest): Promise<TokenResponse>;
    deleteToken(id: string, opts?: UpdateOpts<TokenResponse> | null): Promise<void>;
    findToken(shortID: string): Promise<TokenResponse>;
    getToken(id: string, opts?: GetOpts<TokenResponse> | null): Promise<TokenResponse>;
    listToken(opts?: ListOpts<TokenResponse> | null): Promise<TokenResponse[]>;
    replaceToken(id: string, obj: TokenRequest, opts?: UpdateOpts<TokenResponse> | null): Promise<TokenResponse>;
    updateToken(id: string, obj: TokenRequest, opts?: UpdateOpts<TokenResponse> | null): Promise<TokenResponse>;
    streamGetToken(id: string, opts?: GetOpts<TokenResponse> | null): Promise<GetStream<TokenResponse>>;
    streamListToken(opts?: ListOpts<TokenResponse> | null): Promise<ListStream<TokenResponse>>;
    createUser(obj: UserRequest): Promise<UserResponse>;
    deleteUser(id: string, opts?: UpdateOpts<UserResponse> | null): Promise<void>;
    findUser(shortID: string): Promise<UserResponse>;
    getUser(id: string, opts?: GetOpts<UserResponse> | null): Promise<UserResponse>;
    listUser(opts?: ListOpts<UserResponse> | null): Promise<UserResponse[]>;
    replaceUser(id: string, obj: UserRequest, opts?: UpdateOpts<UserResponse> | null): Promise<UserResponse>;
    updateUser(id: string, obj: UserRequest, opts?: UpdateOpts<UserResponse> | null): Promise<UserResponse>;
    streamGetUser(id: string, opts?: GetOpts<UserResponse> | null): Promise<GetStream<UserResponse>>;
    streamListUser(opts?: ListOpts<UserResponse> | null): Promise<ListStream<UserResponse>>;
}
export declare class Error {
    messages: string[];
    constructor(json: JSONError);
    toString(): string;
}
export {};
//# sourceMappingURL=client.d.ts.map