import React from 'react';
import { Icon } from '../Icon';
import './Button.css';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Emphasis controls visual weight — mirrors Figma "Emphasis" property.
 *
 *   high     → Filled (solid brand colour)          Figma: High
 *   medium   → Tonal (container colour, lower key)  Figma: Medium
 *   outline  → Outlined border, transparent bg       Figma: Outline
 *   low      → Ghost / icon-must (no bg, no border)  Figma: Low-iconMUST
 *   text     → Text-only link style
 */
type Emphasis = 'high' | 'medium' | 'outline' | 'low' | 'text';

/**
 * Variant controls button type — Figma has two distinct button components:
 *
 *   default  → "Button" (node 16:6249) — Proxima Nova Medium, pill, no depth border
 *   display  → "Button-Display" (node 320:19894) — Gilroy ExtraBold, pill, depth border
 *
 * Both are pill-shaped. The difference is font, weight, and the depth border.
 */
type Variant = 'default' | 'display';

/**
 * Size controls the physical height and font size of the button.
 *
 *   xs  → 28px  — dense data tables, admin row actions
 *   sm  → 32px  — compact filters, sidebars, secondary controls
 *   md  → 40px  — standard (default for most UI)
 *   lg  → 48px  — form submits, prominent CTAs, landing page
 *   xl  → 56px  — hero sections, marketing pages
 *
 * When not set, the button uses the md default (or whatever the responsive
 * breakpoint default is — see breakpoints.css).
 */
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color controls the semantic colour family applied.
 * Figma component property: "Color" → "Primary" | ...
 */
type Color = 'primary' | 'neutral' | 'destructive';

/**
 * Icon spec for button leading/trailing icons.
 *
 * Pass either:
 *   name  → Material Symbols Rounded ligature (e.g. 'add', 'arrow_forward')
 *   src   → Custom SVG URL for Mathspace-specific icons not in Material Symbols
 *
 * Icons inside buttons are always size 'sm' (20px) — this matches the Figma
 * component spec where icon size tracks the button's label size, not the base
 * 24dp icon size.
 */
export interface ButtonIconProps {
  /** Material Symbols Rounded ligature name */
  name?: string;
  /** Custom SVG URL */
  src?: string;
  /** Accessible label for the icon */
  label?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  emphasis?: Emphasis;
  variant?: Variant;
  color?: Color;
  /**
   * Physical size of the button — controls height, font, and padding.
   * Defaults to 'md' (40px). See Size type for per-size heights.
   * When not set, the responsive defaults from breakpoints.css apply.
   */
  size?: Size;
  /** Toggle/selected state — adds Selected and its sub-states (hover, press, focus) */
  selected?: boolean;
  /** Leading icon */
  iconLeft?: ButtonIconProps;
  /** Trailing icon */
  iconRight?: ButtonIconProps;
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Button
 *
 * Faithfully implements the Figma Button component structure (node 3:562).
 *
 * Layer structure (mirrors Figma):
 *   button.btn                     ← outer shell: bg colour, pill radius, depth border
 *     span.btn__state-layer         ← state overlay: handles hover/press opacity changes
 *       Icon (iconLeft)             ← leading icon (Material Symbols or custom SVG)
 *       span.btn__label             ← text label
 *       Icon (iconRight)            ← trailing icon
 *
 * Interactive states (CSS only — no JS state needed):
 *   :hover           → Hover
 *   :active          → Press
 *   :focus-visible   → Focus (keyboard only)
 *   [data-selected]  → Selected (+ its own hover/press/focus sub-states)
 */
// Icon size tracks button size so the icon stays proportional to the label.
// xs/sm/md → 20px (Icon 'sm'); lg/xl → 24px (Icon 'md').
const ICON_SIZE: Record<Size, 'sm' | 'md'> = {
  xs: 'sm',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
};

export const Button: React.FC<ButtonProps> = ({
  emphasis = 'high',
  variant = 'display',
  color = 'primary',
  size,
  selected = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${emphasis}`,
    `btn--${variant}`,
    `btn--${color}`,
    // Explicit size class — overrides the responsive :root defaults
    size && size !== 'md' ? `btn--${size}` : '',
    // Widen the padding on any side that has no icon for optical balance
    !iconLeft  ? 'btn--no-icon-left'  : '',
    !iconRight ? 'btn--no-icon-right' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      data-selected={selected || undefined}
      disabled={disabled}
      {...rest}
    >
      {/* State layer — Figma's interaction overlay lives here */}
      <span className="btn__state-layer">
        {iconLeft && (
          <Icon
            name={iconLeft.name}
            src={iconLeft.src}
            label={iconLeft.label}
            size={ICON_SIZE[size ?? 'md']}
            className="btn__icon"
          />
        )}
        <span className="btn__label">{children}</span>
        {iconRight && (
          <Icon
            name={iconRight.name}
            src={iconRight.src}
            label={iconRight.label}
            size={ICON_SIZE[size ?? 'md']}
            className="btn__icon"
          />
        )}
      </span>
    </button>
  );
};

export default Button;
