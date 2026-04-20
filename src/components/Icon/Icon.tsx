import React from 'react';
import { ICONS, IconName } from '../../design-tokens/icons';
import './Icon.css';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Icon size in pixels.
 * Matches the three component size steps used across the system.
 *
 *   sm → 20px  (Small button / dense UI)
 *   md → 24px  (Default — matches Google Material Symbols 24dp optical size)
 *   lg → 28px  (Large button)
 */
type IconSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<IconSize, number> = { sm: 20, md: 24, lg: 28 };

/**
 * Fill axis: 0 = outlined (default per spec), 1 = filled.
 * Filled icons are reserved for specific UX signals (e.g. active favourites,
 * bookmarked state, star ratings).
 */
type IconFill = 0 | 1;

export interface IconProps {
  /**
   * Semantic icon token from the design-system registry.
   * Resolves to the correct Material Symbol ligature name or custom SVG path,
   * so changing an icon in icons.ts updates every component that uses it.
   *
   * Preferred over `name` / `src` for all product icons.
   *
   * Example: <Icon token="skills" />  <Icon token="difficultyEasy" />
   */
  token?: IconName;

  /**
   * Material Symbols Rounded ligature name (snake_case).
   * Use `token` instead for product icons — reserve `name` for one-off UI
   * icons not worth adding to the registry.
   *
   * Examples: 'add', 'close', 'arrow_forward', 'home', 'search'
   */
  name?: string;

  /**
   * Custom SVG URL — for Mathspace-specific icons not available in Material Symbols.
   * Rendered via CSS mask-image so the icon inherits the parent's `color`.
   * Use `token` instead so the path is centralised.
   */
  src?: string;

  /** Accessible label. If omitted the icon is decorative and hidden from screen readers. */
  label?: string;

  /**
   * Visual size. Default: 'md' (24px).
   * Maps to sm=20px / md=24px / lg=28px — mirrors Default/Small/Large component sizes.
   */
  size?: IconSize;

  /**
   * Fill axis (Material Symbols only). Default: 0 (outlined).
   * Tokens that encode a fill state (e.g. bookmarkFilled) apply it automatically;
   * an explicit prop always overrides the token default.
   */
  fill?: IconFill;

  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Icon
 *
 * Renders either a Material Symbols Rounded icon or a custom SVG icon,
 * sourced from the semantic icon registry or provided directly.
 *
 * Preferred usage — token prop (registry-backed):
 *   <Icon token="skills" />
 *   <Icon token="bookmarkFilled" size="sm" label="Saved" />
 *   <Icon token="difficultyEasy" label="Easy" />
 *
 * Direct usage — for one-off icons not in the registry:
 *   <Icon name="add" />
 *   <Icon name="star" fill={1} />
 *   <Icon src="/icons/custom-topic.svg" label="Topic" />
 *
 * Token resolution order (fill axis):
 *   explicit fill prop → token's default fill → 0 (outlined)
 *
 * Colour always inherits from the parent via CSS `color` / `currentColor`.
 */
export const Icon: React.FC<IconProps> = ({
  token,
  name: nameProp,
  src: srcProp,
  label,
  size = 'md',
  fill: fillProp,
  className = '',
}) => {
  // ── Resolve token → name / src / fill ────────────────────────────────────
  let name = nameProp;
  let src  = srcProp;
  let fill: IconFill = 0; // component default

  if (token) {
    const resolved = ICONS[token];
    if ('name' in resolved) {
      name = resolved.name;
      if (resolved.fill !== undefined) fill = resolved.fill;
    } else {
      src = resolved.src;
    }
  }

  // Explicit fill prop always wins over token default
  if (fillProp !== undefined) fill = fillProp;

  // ── Render ────────────────────────────────────────────────────────────────
  const px = SIZE_MAP[size];

  const cssVars = {
    '--icon-size': `${px}px`,
    '--icon-fill': fill,
  } as React.CSSProperties;

  const a11y = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  // Material Symbols Rounded (ligature font)
  if (name) {
    return (
      <span
        className={['icon', 'icon--symbol', className].filter(Boolean).join(' ')}
        style={cssVars}
        {...a11y}
      >
        {name}
      </span>
    );
  }

  // Custom SVG via CSS mask-image
  if (src) {
    return (
      <span
        className={['icon', 'icon--svg', className].filter(Boolean).join(' ')}
        style={cssVars}
        {...a11y}
      >
        <span
          className="icon__mask"
          style={{ maskImage: `url('${src}')` }}
        />
      </span>
    );
  }

  return null;
};

export default Icon;
