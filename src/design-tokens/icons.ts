/**
 * Semantic Icon Registry — derived from icon-registry.ts
 *
 * All icon data lives in icon-registry.ts.
 * This file builds the ICONS lookup used by the Icon component so that
 * changing a token in icon-registry.ts updates every component automatically.
 *
 * Usage (token prop — preferred):
 *   <Icon token="skills" />
 *   <Icon token="bookmarkFilled" size="sm" label="Saved" />
 *   <Icon token="difficultyEasy" label="Easy" />
 *
 * Usage (spread — also valid):
 *   <Icon {...ICONS.skills} />
 */

import { ICON_REGISTRY, type IconRegistryEntry } from './icon-registry';
export type { IconName } from './icon-registry';

// ─── Token shapes ──────────────────────────────────────────────────────────────

/** A Material Symbols Rounded ligature — rendered via the icon font */
export interface SymbolToken {
  name: string;
  /** Default fill axis for this token (0 = outlined, 1 = filled). Caller can override. */
  fill?: 0 | 1;
}

/** A custom SVG icon — rendered via CSS mask-image, inherits currentColor */
export interface SvgToken {
  src: string;
}

export type IconToken = SymbolToken | SvgToken;

// ─── Derived lookup ───────────────────────────────────────────────────────────

/**
 * ICONS — lookup from semantic token name → icon implementation.
 *
 * Built from ICON_REGISTRY at module load time. Consumers should prefer
 * the `token` prop on <Icon> rather than spreading from this object directly,
 * but the spread form still works:  <Icon {...ICONS.skills} />
 */
export const ICONS = Object.fromEntries(
  (ICON_REGISTRY as ReadonlyArray<IconRegistryEntry>).map(entry => [
    entry.token,
    entry.type === 'symbol'
      ? entry.fill !== undefined
        ? { name: entry.source, fill: entry.fill }
        : { name: entry.source }
      : { src: entry.source },
  ]),
) as Record<string, IconToken>;
