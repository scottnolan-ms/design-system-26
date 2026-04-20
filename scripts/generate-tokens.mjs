/**
 * generate-tokens.mjs
 *
 * Reads the Figma variable export JSON files and writes CSS custom property files.
 *
 * Output:
 *   src/design-tokens/primitives.css   ← --ref-* (raw palette, not used in components)
 *   src/design-tokens/system.css       ← --sys-* (semantic, alias --ref-*, used in components)
 *
 * Run: node scripts/generate-tokens.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ─── Load JSON ────────────────────────────────────────────────────────────────

const reference = JSON.parse(
  readFileSync(resolve(root, '_REF/Figma_variable_output/Colours 03 - Reference.json'), 'utf8')
);
const system = JSON.parse(
  readFileSync(resolve(root, '_REF/Figma_variable_output/Colours 02 - System.json'), 'utf8')
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toKebab(str) {
  return str
    .toLowerCase()
    .replace(/[()]/g, '')           // remove parentheses
    .replace(/\s*-\s*/g, '-')       // normalise " - " to "-"
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/-{2,}/g, '-')         // collapse double hyphens
    .replace(/^-|-$/g, '');         // trim edges
}

/**
 * Converts a Reference variable leaf name to a --ref-* CSS variable name.
 *
 * Strategy: take the leaf segment (e.g. "Purple 50", "Blue 30", "Neutral 100 - White"),
 * strip descriptor suffixes like "- White", then kebab-case.
 *
 * "Purple 50"          → --ref-purple-50
 * "Blue 30"            → --ref-blue-30
 * "Neutral 100 - White"→ --ref-neutral-100
 * "Purple Neon"        → --ref-purple-neon
 */
function refVarName(leafName) {
  // Strip trailing " - {descriptor}" (e.g. "- White", "- Black")
  const cleaned = leafName.replace(/\s*-\s*[A-Z][a-z]+$/, '');
  return `--ref-${toKebab(cleaned)}`;
}

/**
 * Converts a System variable (family + role) to a --sys-* CSS variable name.
 *
 * Rules:
 *  - "System" family    → --sys-{role}                    (e.g. --sys-background)
 *  - "Primary" family   → --sys-primary-{stripped-role}   (e.g. --sys-primary-on)
 *  - Other families     → --sys-{family}-{stripped-role}  (e.g. --sys-blue-on)
 *
 * "Stripped role" means the leading "Primary " is removed (since it's implicit in the family):
 *  "Primary On"             → "on"
 *  "Primary Container On"   → "container-on"
 *  "Primary Fixed Variant"  → "fixed-variant"
 *  "Primary" (base role)    → "" (empty → just the family name)
 */
function sysVarName(family, role) {
  const familyKebab = toKebab(family);

  if (family === 'System') {
    return `--sys-${toKebab(role)}`;
  }

  // Strip leading "Primary" from role
  const stripped = role.replace(/^Primary\s*/, '');

  if (family === 'Primary') {
    return stripped ? `--sys-primary-${toKebab(stripped)}` : '--sys-primary';
  }

  return stripped
    ? `--sys-${familyKebab}-${toKebab(stripped)}`
    : `--sys-${familyKebab}`;
}

// ─── Generate primitives.css ──────────────────────────────────────────────────

function generatePrimitives(data) {
  const lines = [
    `/**`,
    ` * PRIMITIVE TOKENS — Color Reference Palette`,
    ` *`,
    ` * Auto-generated from: _REF/Figma_variable_output/Colours 03 - Reference.json`,
    ` * DO NOT EDIT BY HAND — run: node scripts/generate-tokens.mjs`,
    ` *`,
    ` * These are raw color values. They are the single source of truth for every`,
    ` * color in the system. Components must NOT reference these directly — always`,
    ` * consume a --sys-* token from system.css instead.`,
    ` *`,
    ` * Naming: --ref-{family}-{tone}`,
    ` */`,
    ``,
    `:root {`,
  ];

  /**
   * Recursively walk the JSON tree. When we find a leaf with $type === "color",
   * emit a CSS variable. Group separator comments are emitted at depth 1.
   */
  function walk(node, depth, groupLabel) {
    const entries = Object.entries(node).filter(([k]) => k !== '$extensions');

    for (const [key, val] of entries) {
      if (!val || typeof val !== 'object') continue;

      if (val.$type === 'color') {
        // Leaf variable
        const hex = val.$value?.hex ?? '#000000';
        lines.push(`  ${refVarName(key)}: ${hex};`);
      } else {
        // Nested group — emit a comment at depth 1 only
        if (depth === 1) {
          lines.push(``);
          lines.push(`  /* ── ${key} ── */`);
        }
        walk(val, depth + 1, key);
      }
    }
  }

  for (const [topKey, topVal] of Object.entries(data)) {
    if (topKey === '$extensions') continue;
    lines.push(``);
    lines.push(`  /* ════ ${topKey} ════ */`);
    walk(topVal, 1, topKey);
  }

  lines.push(`}`);
  lines.push(``);
  return lines.join('\n');
}

// ─── Generate system.css ──────────────────────────────────────────────────────

function generateSystem(data) {
  const lines = [
    `/**`,
    ` * SYSTEM TOKENS — Semantic Color Layer`,
    ` *`,
    ` * Auto-generated from: _REF/Figma_variable_output/Colours 02 - System.json`,
    ` * DO NOT EDIT BY HAND — run: node scripts/generate-tokens.mjs`,
    ` *`,
    ` * These are the tokens components use directly. Each aliases a --ref-* primitive`,
    ` * so the alias chain matches Figma exactly:`,
    ` *   Component fill → --sys-primary → var(--ref-purple-50) → #5D51AE`,
    ` *`,
    ` * Naming:`,
    ` *   --sys-{role}              for the System group (background, surface, outline)`,
    ` *   --sys-primary-{role}      for the Primary color family`,
    ` *   --sys-{family}-{role}     for all other families (blue, green, red, etc.)`,
    ` *`,
    ` * "role" variants:`,
    ` *   (base)           → the main interactive/brand color`,
    ` *   -on              → foreground color on top of base (text, icons)`,
    ` *   -container       → muted/tonal fill (lower emphasis backgrounds)`,
    ` *   -container-on    → foreground on container`,
    ` *   -container-light → extra-light container (hover states, subtle fills)`,
    ` *   -fixed           → fixed color (does not change between modes)`,
    ` *   -fixed-on        → foreground on fixed`,
    ` *   -fixed-variant   → secondary fixed tone`,
    ` *   -fixed-variant-on→ foreground on fixed variant`,
    ` */`,
    ``,
    `:root {`,
  ];

  for (const [family, familyVal] of Object.entries(data)) {
    if (family === '$extensions') continue;
    if (!familyVal || typeof familyVal !== 'object') continue;

    lines.push(``);
    lines.push(`  /* ════ ${family} ════ */`);

    for (const [role, roleVal] of Object.entries(familyVal)) {
      if (role === '$extensions') continue;
      if (!roleVal || typeof roleVal !== 'object' || roleVal.$type !== 'color') continue;

      const varName = sysVarName(family, role);
      const hex = roleVal.$value?.hex ?? '#000000';

      // Resolve alias to a --ref-* var
      const aliasTarget = roleVal.$extensions?.['com.figma.aliasData']?.targetVariableName;
      const value = aliasTarget ? `var(${refVarName(aliasTarget.split('/').pop())})` : hex;

      lines.push(`  ${varName}: ${value}; /* ${hex} */`);
    }
  }

  lines.push(`}`);
  lines.push(``);
  return lines.join('\n');
}

// ─── Write files ──────────────────────────────────────────────────────────────

mkdirSync(resolve(root, 'src/design-tokens'), { recursive: true });

const primitivesCSS = generatePrimitives(reference);
const systemCSS = generateSystem(system);

writeFileSync(resolve(root, 'src/design-tokens/primitives.css'), primitivesCSS);
writeFileSync(resolve(root, 'src/design-tokens/system.css'), systemCSS);

// Count variables for summary
const refCount = (primitivesCSS.match(/--ref-/g) ?? []).length;
const sysCount = (systemCSS.match(/--sys-/g) ?? []).length;

console.log(`✓ primitives.css  — ${refCount} --ref-* variables`);
console.log(`✓ system.css      — ${sysCount} --sys-* variables`);
console.log(`\nNext step: import both files in src/main.tsx`);
