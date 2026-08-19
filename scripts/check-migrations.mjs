#!/usr/bin/env node
/**
 * Fails when prisma/schema.prisma declares a column that no migration creates.
 *
 * This is the failure that took the profile page down twice: the schema gained
 * `city`, the generated client selected it, and the database had never been told
 * about it, so every read through Profile returned 500. Types, lint, tests and the
 * build all pass in that state — the client is generated from the schema, not from
 * the database, so nothing in the pipeline disagreed.
 *
 * Static on purpose. CI has no database credentials and should not have them, so
 * this compares two things already in the repository: every mapped column in the
 * schema must appear somewhere in supabase/migrations/*.sql.
 *
 * It cannot prove a migration has been *applied* — only that one exists. Applying
 * remains a deploy step; this catches the case where nobody wrote one at all.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SCHEMA = 'apps/api/prisma/schema.prisma'
const MIGRATIONS_DIR = 'supabase/migrations'

const schema = readFileSync(SCHEMA, 'utf8')
const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql'))
const sql = files.map((f) => readFileSync(join(MIGRATIONS_DIR, f), 'utf8')).join('\n').toLowerCase()

// Enums are columns; relations are not. Collecting enum names first is what makes
// the two distinguishable, since both are capitalised types.
const SCALARS = new Set([
  'String', 'Int', 'BigInt', 'Float', 'Decimal', 'Boolean', 'DateTime', 'Json', 'Bytes',
])
const enums = new Set([...schema.matchAll(/^enum\s+(\w+)\s*\{/gm)].map((m) => m[1]))

const columns = []
let model = null
for (const raw of schema.split(/\r?\n/)) {
  const line = raw.trim()
  const open = /^model\s+(\w+)\s*\{/.exec(line)
  if (open) { model = open[1]; continue }
  if (line === '}') { model = null; continue }
  if (!model || line.startsWith('//') || line.startsWith('@@')) continue

  const field = /^(\w+)\s+([\w[\]?]+)/.exec(line)
  if (!field) continue
  const name = field[1]
  const rawType = field[2]
  const type = rawType.replace(/[?[\]]/g, '')

  // A list is always a relation back-reference, never a column.
  if (rawType.endsWith('[]')) continue
  // A capitalised type that is neither scalar nor enum is a relation; its foreign
  // key is a separate field and gets checked on its own.
  if (!SCALARS.has(type) && !enums.has(type)) continue

  const mapped = /@map\("([^"]+)"\)/.exec(line)
  columns.push({ model, field: name, column: mapped ? mapped[1] : name })
}

const missing = columns.filter((c) => !sql.includes(c.column.toLowerCase()))

console.log(`checked ${columns.length} columns against ${files.length} migrations`)

if (missing.length) {
  console.error(`\n${missing.length} column(s) declared in the schema that no migration creates:\n`)
  for (const c of missing) console.error(`  ${c.model}.${c.field}  ->  column "${c.column}"`)
  console.error(`
Write the migration in ${MIGRATIONS_DIR} and apply it before merging the schema
change. Shipping the schema first generates a client that queries a column the
database does not have, and every read through that model returns 500.`)
  process.exit(1)
}

console.log('every schema column has a migration that creates it')
