// Solø API client

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
