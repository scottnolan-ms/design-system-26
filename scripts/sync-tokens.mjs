/**
 * sync-tokens.mjs
 *
 * Pulls variable collections directly from the Figma REST API and writes:
 *   src/design-tokens/primitives.css   --ref-* (raw palette)
 *   src/design-tokens/system.css       --sys-* (semantic, aliases --ref-*)
 *
 * Usage:
 *   1. Copy .env.example to .env and add your FIGMA_TOKEN
 *   2. npm run sync-tokens
 *
 * The Figma Variables API requires a Professional plan or above.
 * API docs: https://www.figma.com/developers/api#variables
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ─── Load .env (no external dependency) ──────────────────────────────────────

function loadEnv() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) {
    console.error('✗  .env file not found. Copy .env.example to .env and add your FIGMA_TOKEN.');
    process.exit(1);
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY ?? 'necw5Yysi70I8c7wbm3bmv';

// Collections to sync (Figma collection names — exact match)
const REF_COLLECTION = 'Colours 03 - Reference';
const SYS_COLLECTION = 'Colours 02 - System';

if (!FIGMA_TOKEN || FIGMA_TOKEN === 'your_token_here') {
  console.error('✗  FIGMA_TOKEN is not set. Add it to your .env file.');
  process.exit(1);
}

// ─── Figma API ────────────────────────────────────────────────────────────────

async function fetchVariables() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  console.log(`→ Fetching variables from Figma file ${FIGMA_FILE_KEY}…`);

  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 403) {
      console.error('✗  403 Forbidden — check your token has "File content" read scope,');
      console.error('   and that your Figma plan supports the Variables API (Professional+).');
    } else if (res.status === 404) {
      console.error(`✗  404 Not Found — file key "${FIGMA_FILE_KEY}" may be incorrect.`);
    } else {
      console.error(`✗  Figma API error ${res.status}: ${body}`);
    }
    process.exit(1);
  }

  const data = await res.json();
  return data.meta; // { variables: {...}, variableCollections: {...} }
}

// ─── Helpers (shared with generate-tokens.mjs) ────────────────────────────────

function toKebab(str) {
  return str
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** "Purple 50" → --ref-purple-50  |  "Neutral 100 - White" → --ref-neutral-100 */
function refVarName(leafName) {
  const cleaned = leafName.replace(/\s*-\s*[A-Z][a-z]+$/, '');
  return `--ref-${toKebab(cleaned)}`;
}

/** (family, role) → --sys-primary-on  |  --sys-blue  |  --sys-background */
function sysVarName(family, role) {
  const familyKebab = toKebab(family);
  if (family === 'System') return `--sys-${toKebab(role)}`;
  const stripped = role.replace(/^Primary\s*/, '');
  if (family === 'Primary') return stripped ? `--sys-primary-${toKebab(stripped)}` : '--sys-primary';
  return stripped ? `--sys-${familyKebab}-${toKebab(stripped)}` : `--sys-${familyKebab}`;
}

/** { r, g, b } (0–1 floats) → "#RRGGBB" */
function toHex({ r, g, b }) {
  const ch = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${ch(r)}${ch(g)}${ch(b)}`.toUpperCase();
}

// ─── Build lookup tables from API response ────────────────────────────────────

function buildLookups(meta) {
  const { variables, variableCollections } = meta;

  // Map collection ID → collection name
  const collectionNames = Object.fromEntries(
    Object.values(variableCollections).map((c) => [c.id, c.name])
  );

  // Map variable ID → variable object (enriched with collectionName + defaultModeId)
  const varById = {};
  for (const v of Object.values(variables)) {
    const collName = collectionNames[v.variableCollectionId] ?? '';
    const coll = variableCollections[v.variableCollectionId];
    varById[v.id] = { ...v, collectionName: collName, defaultModeId: coll?.defaultModeId };
  }

  return { varById, collectionNames };
}

// ─── Resolve a variable's value in its default mode ───────────────────────────

/**
 * Returns { hex, aliasRefVar } where:
 *   hex         = the resolved hex color (always present, follows alias chain)
 *   aliasRefVar = "--ref-xxx" if this variable directly aliases a Reference var,
 *                 undefined otherwise (will fall back to raw hex in system.css)
 */
function resolveValue(variable, varById) {
  const modeId = variable.defaultModeId;
  const raw = variable.valuesByMode[modeId];

  if (!raw) return { hex: '#000000' };

  if (raw.type === 'VARIABLE_ALIAS') {
    const target = varById[raw.id];
    if (target) {
      // Resolved alias: use target's hex, and build the --ref-* name from target's leaf
      const leafName = target.name.split('/').pop();
      return {
        hex: resolveValue(target, varById).hex,
        aliasRefVar: refVarName(leafName),
      };
    }
  }

  // Raw color value
  return { hex: toHex(raw) };
}

// ─── Generate primitives.css ──────────────────────────────────────────────────

function generatePrimitives(refVars) {
  // Group by top-level path segment for section comments
  const groups = {};
  for (const v of refVars) {
    const topKey = v.name.split('/')[0];
    (groups[topKey] ??= []).push(v);
  }

  const lines = [
    `/**`,
    ` * PRIMITIVE TOKENS — Color Reference Palette`,
    ` *`,
    ` * Auto-generated by: scripts/sync-tokens.mjs`,
    ` * Source: Figma file ${FIGMA_FILE_KEY} — collection "${REF_COLLECTION}"`,
    ` * DO NOT EDIT BY HAND — run: npm run sync-tokens`,
    ` *`,
    ` * These are raw color values. Components must NOT reference these directly —`,
    ` * always consume a --sys-* token from system.css instead.`,
    ` *`,
    ` * Naming: --ref-{family}-{tone}`,
    ` */`,
    ``,
    `:root {`,
  ];

  for (const [groupName, vars] of Object.entries(groups)) {
    lines.push(``, `  /* ════ ${groupName} ════ */`);
    for (const v of vars) {
      const leafName = v.name.split('/').pop();
      const varName = refVarName(leafName);
      const { hex } = resolveValue(v, {});
      lines.push(`  ${varName}: ${hex};`);
    }
  }

  lines.push(`}`, ``);
  return lines.join('\n');
}

// ─── Generate system.css ──────────────────────────────────────────────────────

function generateSystem(sysVars, varById) {
  // Group by top-level path segment (family)
  const groups = {};
  for (const v of sysVars) {
    const [family] = v.name.split('/');
    (groups[family] ??= []).push(v);
  }

  const lines = [
    `/**`,
    ` * SYSTEM TOKENS — Semantic Color Layer`,
    ` *`,
    ` * Auto-generated by: scripts/sync-tokens.mjs`,
    ` * Source: Figma file ${FIGMA_FILE_KEY} — collection "${SYS_COLLECTION}"`,
    ` * DO NOT EDIT BY HAND — run: npm run sync-tokens`,
    ` *`,
    ` * Components use these tokens directly. Each aliases a --ref-* primitive.`,
    ` * Alias chain: Component → --sys-primary → var(--ref-purple-50) → #5D51AE`,
    ` *`,
    ` * Naming:`,
    ` *   --sys-{role}              System group (background, surface, outline)`,
    ` *   --sys-primary-{role}      Primary color family`,
    ` *   --sys-{family}-{role}     All other color families`,
    ` */`,
    ``,
    `:root {`,
  ];

  for (const [family, vars] of Object.entries(groups)) {
    lines.push(``, `  /* ════ ${family} ════ */`);
    for (const v of vars) {
      const parts = v.name.split('/');
      const role = parts.slice(1).join('/'); // everything after family
      const varName = sysVarName(family, role);
      const { hex, aliasRefVar } = resolveValue(v, varById);
      const value = aliasRefVar ? `var(${aliasRefVar})` : hex;
      lines.push(`  ${varName}: ${value}; /* ${hex} */`);
    }
  }

  lines.push(`}`, ``);
  return lines.join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const meta = await fetchVariables();
const { varById, collectionNames } = buildLookups(meta);

// Find collection IDs by name
const refCollId = Object.keys(varById).length > 0
  ? Object.values(meta.variableCollections).find((c) => c.name === REF_COLLECTION)?.id
  : null;
const sysCollId = Object.values(meta.variableCollections).find((c) => c.name === SYS_COLLECTION)?.id;

if (!refCollId) {
  console.error(`✗  Collection "${REF_COLLECTION}" not found in this file.`);
  console.log('   Available collections:');
  Object.values(meta.variableCollections).forEach((c) => console.log(`     • ${c.name}`));
  process.exit(1);
}
if (!sysCollId) {
  console.error(`✗  Collection "${SYS_COLLECTION}" not found in this file.`);
  console.log('   Available collections:');
  Object.values(meta.variableCollections).forEach((c) => console.log(`     • ${c.name}`));
  process.exit(1);
}

// Filter variables by collection, sort by name for stable output
const refVars = Object.values(varById)
  .filter((v) => v.variableCollectionId === refCollId && v.resolvedType === 'COLOR')
  .sort((a, b) => a.name.localeCompare(b.name));

const sysVars = Object.values(varById)
  .filter((v) => v.variableCollectionId === sysCollId && v.resolvedType === 'COLOR')
  .sort((a, b) => a.name.localeCompare(b.name));

console.log(`✓  Found ${refVars.length} Reference variables, ${sysVars.length} System variables`);

mkdirSync(resolve(root, 'src/design-tokens'), { recursive: true });

const primitivesCSS = generatePrimitives(refVars);
const systemCSS = generateSystem(sysVars, varById);

writeFileSync(resolve(root, 'src/design-tokens/primitives.css'), primitivesCSS);
writeFileSync(resolve(root, 'src/design-tokens/system.css'), systemCSS);

const refCount = (primitivesCSS.match(/--ref-/g) ?? []).length;
const sysCount = (systemCSS.match(/--sys-/g) ?? []).length;

console.log(`✓  primitives.css — ${refCount} --ref-* variables`);
console.log(`✓  system.css     — ${sysCount} --sys-* variables`);
console.log(`\nDone. Restart your dev server if it's running.`);
