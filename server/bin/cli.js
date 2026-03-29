#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly resolve the absolute path of the 'tsx' package from the CLI's own node_modules
const require = createRequire(import.meta.url);
let tsxLoader;
try {
  // require.resolve('tsx') returns the main entry (dist/loader.mjs in tsx v4)
  tsxLoader = require.resolve('tsx');
} catch (e) {
  console.error('Error: "tsx" module not found in CLI local dependencies. Please run "npm install" in the server directory.');
  process.exit(1);
}

const mainFile = join(__dirname, '../src/cli/main.ts');

// Run node with the absolute path to the tsx loader
const result = spawnSync('node', [
  '--no-warnings',
  '--import', `file://${tsxLoader}`,
  mainFile,
  ...process.argv.slice(2)
], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

process.exit(result.status ?? 0);
