#!/usr/bin/env node
/**
 * One-shot import of the talk-map canvas data: copies
 * $DSH_HOME/storages/talk_map.json to talk_pages.json (storage unit renamed).
 * The first map open then converts the old workspace folders into boxes.
 * Refuses to overwrite an existing talk_pages.json. Quit dsh first.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const dir = join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'storages')
const from = join(dir, 'talk_map.json')
const to = join(dir, 'talk_pages.json')
if (!existsSync(from)) { console.error(`nothing to import: ${from} not found`); process.exit(1) }
if (existsSync(to)) { console.error(`${to} already exists; not overwriting`); process.exit(1) }
const data = JSON.parse(readFileSync(from, 'utf8'))
if (data?.unit !== undefined && typeof data.unit === 'object') data.unit.name = 'talk_pages'
copyFileSync(from, `${from}.bak`)
writeFileSync(to, JSON.stringify(data))
console.log(`imported ${from} -> ${to} (backup: ${from}.bak)`)
