#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vitestBin = path.resolve(__dirname, '../node_modules/vitest/vitest.mjs');

// Collect arguments passed to npm test
const rawArgs = process.argv.slice(2);

// Filter out Jest-specific flags such as --watchAll=false
const hasWatchAllTrue = rawArgs.includes('--watchAll=true') || rawArgs.includes('--watchAll');
const filteredArgs = rawArgs.filter((arg) => !arg.startsWith('--watchAll'));

// Vitest uses 'run' for non-interactive single run (CI mode)
const vitestArgs = hasWatchAllTrue
  ? [vitestBin, ...filteredArgs]
  : [vitestBin, 'run', ...filteredArgs];

const child = spawn(process.execPath, vitestArgs, {
  stdio: 'inherit',
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
