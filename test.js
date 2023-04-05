import { strict as assert } from 'node:assert';
import { Client } from './client.js';

const tests = [
	async () => {
		const client = new Client('https://api.solø.com/v1/');
		const dbg = await client.debugInfo();
		assert.ok(dbg);
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
