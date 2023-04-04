import { strict as assert } from 'node:assert';
import { Client } from './client.js';

const client = new Client('https://api.solø.com/v1/');
const dbg = await client.debugInfo();
assert.ok(dbg)
