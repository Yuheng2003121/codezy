#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mainPath = join(__dirname, 'main.ts');

const result = spawnSync('node', [
  '--import', 'tsx',
  mainPath,
  ...process.argv.slice(2)
], { 
  stdio: 'inherit',
  shell: true 
});

process.exit(result.status ?? 0);
