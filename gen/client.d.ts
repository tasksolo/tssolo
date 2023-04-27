export interface ShardServerConfig {
    shardID?: string;
    instanceID?: string;
}
export interface Task {
    userID?: string;
    name?: string;
    complete?: boolean;
    after?: string;
}
export interface Token {
    userID?: string;
    token?: string;
}
export interface User {
    name?: string;
    email?: string;
    password?: string;
    shard?: string;
    serviceAdmin?: boolean;
    replicationClient?: boolean;
}
export interface Metadata {
    id: string;
    etag: string;
    generation: number;
}
export interface GetOpts<T> {
    prev?: T & Metadata;
}
export interface ListOpts<T> {
    stream?: string;
    limit?: number;
    offset?: number;
    after?: string;
    sorts?: string[];
    filters?: Filter[];
    prev?: (T & Metadata)[];
}
export interface Filter {
    path: string;
    op: string;
    value: string;
}
export interface UpdateOpts<T> {
    prev?: T & Metadata;
}
export interface JSONError {
    messages: string[];
}
export declare class Client {
    private baseURL;
    private headers;
    constructor(baseURL: string);
    setHeader(name: string, value: string): void;
    resetAuth(): void;
    setBasicAuth(user: string, pass: string): void;
    setAuthToken(token: string): void;
    debugInfo(): Promise<Object>;
    openAPI(): Promise<Object>;
    goClient(): Promise<string>;
    tsClient(): Promise<string>;
    createShardServerConfig(obj: ShardServerConfig): Promise<ShardServerConfig & Metadata>;
    deleteShardServerConfig(id: string, opts?: UpdateOpts<ShardServerConfig> | null): Promise<void>;
    findShardServerConfig(shortID: string): Promise<ShardServerConfig & Metadata>;
    getShardServerConfig(id: string, opts?: GetOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata>;
    listShardServerConfig(opts?: ListOpts<ShardServerConfig> | null): Promise<(ShardServerConfig & Metadata)[]>;
    replaceShardServerConfig(id: string, obj: ShardServerConfig, opts?: UpdateOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata>;
    updateShardServerConfig(id: string, obj: ShardServerConfig, opts?: UpdateOpts<ShardServerConfig> | null): Promise<ShardServerConfig & Metadata>;
    streamGetShardServerConfig(id: string, opts?: GetOpts<ShardServerConfig> | null): Promise<GetStream<ShardServerConfig>>;
    streamListShardServerConfig(opts?: ListOpts<ShardServerConfig> | null): Promise<ListStream<ShardServerConfig>>;
    createTask(obj: Task): Promise<Task & Metadata>;
    deleteTask(id: string, opts?: UpdateOpts<Task> | null): Promise<void>;
    findTask(shortID: string): Promise<Task & Metadata>;
    getTask(id: string, opts?: GetOpts<Task> | null): Promise<Task & Metadata>;
    listTask(opts?: ListOpts<Task> | null): Promise<(Task & Metadata)[]>;
    replaceTask(id: string, obj: Task, opts?: UpdateOpts<Task> | null): Promise<Task & Metadata>;
    updateTask(id: string, obj: Task, opts?: UpdateOpts<Task> | null): Promise<Task & Metadata>;
    streamGetTask(id: string, opts?: GetOpts<Task> | null): Promise<GetStream<Task>>;
    streamListTask(opts?: ListOpts<Task> | null): Promise<ListStream<Task>>;
    createToken(obj: Token): Promise<Token & Metadata>;
    deleteToken(id: string, opts?: UpdateOpts<Token> | null): Promise<void>;
    findToken(shortID: string): Promise<Token & Metadata>;
    getToken(id: string, opts?: GetOpts<Token> | null): Promise<Token & Metadata>;
    listToken(opts?: ListOpts<Token> | null): Promise<(Token & Metadata)[]>;
    replaceToken(id: string, obj: Token, opts?: UpdateOpts<Token> | null): Promise<Token & Metadata>;
    updateToken(id: string, obj: Token, opts?: UpdateOpts<Token> | null): Promise<Token & Metadata>;
    streamGetToken(id: string, opts?: GetOpts<Token> | null): Promise<GetStream<Token>>;
    streamListToken(opts?: ListOpts<Token> | null): Promise<ListStream<Token>>;
    createUser(obj: User): Promise<User & Metadata>;
    deleteUser(id: string, opts?: UpdateOpts<User> | null): Promise<void>;
    findUser(shortID: string): Promise<User & Metadata>;
    getUser(id: string, opts?: GetOpts<User> | null): Promise<User & Metadata>;
    listUser(opts?: ListOpts<User> | null): Promise<(User & Metadata)[]>;
    replaceUser(id: string, obj: User, opts?: UpdateOpts<User> | null): Promise<User & Metadata>;
    updateUser(id: string, obj: User, opts?: UpdateOpts<User> | null): Promise<User & Metadata>;
    streamGetUser(id: string, opts?: GetOpts<User> | null): Promise<GetStream<User>>;
    streamListUser(opts?: ListOpts<User> | null): Promise<ListStream<User>>;
    createName<T>(name: string, obj: T): Promise<T & Metadata>;
    deleteName<T>(name: string, id: string, opts?: UpdateOpts<T> | null): Promise<void>;
    findName<T>(name: string, shortID: string): Promise<T & Metadata>;
    getName<T>(name: string, id: string, opts?: GetOpts<T> | null): Promise<T & Metadata>;
    listName<T>(name: string, opts?: ListOpts<T> | null): Promise<(T & Metadata)[]>;
    replaceName<T>(name: string, id: string, obj: T, opts?: UpdateOpts<T> | null): Promise<T & Metadata>;
    updateName<T>(name: string, id: string, obj: T, opts?: UpdateOpts<T> | null): Promise<T & Metadata>;
    streamGetName<T>(name: string, id: string, opts?: GetOpts<T> | null): Promise<GetStream<T>>;
    streamListName<T>(name: string, opts?: ListOpts<T> | null): Promise<ListStream<T>>;
    private newReq;
}
declare class StreamEvent<T> {
    eventType: string;
    params: Map<string, string>;
    data: string;
    decodeObj(): T & Metadata;
    decodeList(): (T & Metadata)[];
}
declare class EventStream<T> {
    private scan;
    constructor(stream: ReadableStream);
    readEvent(): Promise<StreamEvent<T> | null>;
}
export declare class GetStream<T> {
    private eventStream;
    private controller;
    private prev;
    private lastEvent;
    constructor(resp: Response, controller: AbortController, prev: (T & Metadata) | null | undefined);
    lastEventReceived(): Date;
    abort(): Promise<void>;
    read(): Promise<(T & Metadata) | null>;
    close(): Promise<void>;
    [Symbol.asyncIterator](): AsyncIterableIterator<T & Metadata>;
}
export declare abstract class ListStream<T> {
    protected eventStream: EventStream<T>;
    private controller;
    protected lastEvent: Date;
    constructor(resp: Response, controller: AbortController);
    lastEventReceived(): Date;
    abort(): Promise<void>;
    close(): Promise<void>;
    abstract read(): Promise<(T & Metadata)[] | null>;
    [Symbol.asyncIterator](): AsyncIterableIterator<(T & Metadata)[]>;
}
export declare class ListStreamFull<T> extends ListStream<T> {
    private prev;
    constructor(resp: Response, controller: AbortController, prev: (T & Metadata)[] | null | undefined);
    read(): Promise<(T & Metadata)[] | null>;
}
export declare class ListStreamDiff<T> extends ListStream<T> {
    private prev;
    private objs;
    constructor(resp: Response, controller: AbortController, prev: (T & Metadata)[] | null | undefined);
    read(): Promise<(T & Metadata)[] | null>;
}
export declare class Error {
    messages: string[];
    constructor(json: JSONError);
    toString(): string;
}
export {};
//# sourceMappingURL=client.d.ts.map