#!/usr/bin/env node
/**
 * Reproducible build for lib/index.js — the host half dsh loads as the
 * package entry. esbuild bundles src/index.ts; zod and node built-ins stay
 * external (the host provides them / resolves them from node_modules).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/index.ts')],
  outfile: path.join(ROOT, 'lib/index.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  external: ['zod', 'node:*'],
  // Keep non-ASCII copy (Chinese error text, the inject guard rails) literal:
  // that is how the shipped bundle reads, and the static contract tests match
  // those strings. The client build sets the same flag.
  charset: 'utf8',
  logLevel: 'info',
})
