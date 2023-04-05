import { strict as assert } from 'node:assert';
import { Client } from './client.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const baseURL = 'https://127.0.0.1:8443/v1/';

const tests = [

	async () => {
		const client = new Client(baseURL);
		const dbg = await client.debugInfo();
		assert.ok(dbg);
	},

	async () => {
		const client = new Client(baseURL);
		client.setBasicAuth(process.env.TSSOLO_TEST_USER, process.env.TSSOLO_TEST_PASS);
		// TODO: Create token, call setAuthToken(), do something with it
	},

];

async function runTests() {
	const proms = [];
	for (const test of tests) {
		proms.push(test());
	}

	return Promise.all(proms);
}

await runTests();
