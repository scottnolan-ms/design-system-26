import React from 'react';
import { Icon } from '../Icon';
import './Chip.css';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Emphasis controls visual treatment — mirrors Figma "Emphasis" property.
 *
 *   filled         → Tonal filled chip (Figma: "Varient") — uses container colour
 *   outline        → Solid border, transparent bg (Figma: "Outline")
 *   outline-dashed → Dashed border, transparent bg (Figma: "Outline - dashed")
 *   data           → Non-interactive label — no fill, uses the base colour for text
 */
type ChipEmphasis = 'filled' | 'outline' | 'outline-dashed' | 'data';

/**
 * Color family — maps to the --sys-{color}-* token group.
 *
 *   filled/outline:  bg = --sys-{color}-container, text = --sys-{color}-container-on
 *   data:            text = --sys-{color}
 *   selected:        bg = --sys-{color}-container-on, text = --sys-{color}-on
 */
type ChipColor =
  | 'primary'
  | 'neutral'
  | 'green'
  | 'red'
  | 'orange'
  | 'blue'
  | 'silver'
  | 'turquoise'
  | 'yellow'
  | 'tan'
  | 'crimson'
  | 'flame'
  | 'sunshine';

export interface ChipIconProps {
  /** Material Symbols Rounded ligature name */
  name?: string;
  /** Custom SVG URL for Mathspace-specific icons */
  src?: string;
  /** Accessible label */
  label?: string;
}

export type ChipSize = 'sm' | 'md' | 'lg';

// Icon size tracks chip size for proportional rendering
const CHIP_ICON_SIZE: Record<ChipSize, 'sm' | 'md'> = {
  sm: 'sm', // 20px icon in 24px chip
  md: 'sm', // 20px icon in 32px chip (default)
  lg: 'md', // 24px icon in 40px chip
};

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  emphasis?: ChipEmphasis;
  color?: ChipColor;
  /**
   * Physical size of the chip — controls height, font, and padding.
   *   sm → 24px  table cells, dense filter bars
   *   md → 32px  standard (default)
   *   lg → 40px  landing page labels, hero tags
   */
  size?: ChipSize;
  /** Toggle/selected state — inverts to darker bg with light text */
  selected?: boolean;
  /** Leading icon — size tracks chip size automatically */
  iconLeft?: ChipIconProps;
  /** Trailing icon — size tracks chip size automatically */
  iconRight?: ChipIconProps;
  children: React.ReactNode;
  /** Whether the chip is interactive (renders as <button>) or static (renders as <span>) */
  as?: 'button' | 'span';
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Chip
 *
 * Faithfully implements the Figma Chips component (node 25:1855).
 *
 * Shape: 4px corner radius (--corner-extra-small) — NOT pill.
 * Height: 32px (0 outer vert + 7 label vert + 18 line-height + 7 + 0)
 * Icons: 20px (sm size — smaller than button's 24px icons)
 * Font: Proxima Nova Medium 14px / 18px line-height
 *
 * Colour pattern — uses CSS custom properties set per colour class:
 *   --chip-color-bg        container fill (filled/outline emphasis)
 *   --chip-color-fg        container-on text/icon colour
 *   --chip-color-border    border colour (outline variants)
 *   --chip-color-data-fg   base colour (data emphasis — no fill)
 *   --chip-selected-bg     darker fill for selected state
 *   --chip-selected-fg     text/icon on selected bg
 *
 * Usage:
 *   <Chip color="primary">Topic</Chip>
 *   <Chip emphasis="filled" color="green" iconLeft={{ name: 'check' }}>Correct</Chip>
 *   <Chip emphasis="outline" color="neutral" selected>Active filter</Chip>
 *   <Chip emphasis="data" color="red">At risk</Chip>
 */
export const Chip: React.FC<ChipProps> = ({
  emphasis = 'filled',
  color = 'primary',
  size,
  selected = false,
  iconLeft,
  iconRight,
  children,
  className = '',
  as: Tag = 'span',
  disabled,
  ...rest
}) => {
  const iconSize = CHIP_ICON_SIZE[size ?? 'md'];

  const classes = [
    'chip',
    `chip--${emphasis}`,
    `chip--${color}`,
    size && size !== 'md' ? `chip--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const interactiveProps =
    Tag === 'button'
      ? { type: 'button' as const, disabled }
      : {};

  return (
    <Tag
      className={classes}
      data-selected={selected || undefined}
      {...interactiveProps}
      {...rest}
    >
      <span className="chip__state-layer">
        {iconLeft && (
          <Icon
            name={iconLeft.name}
            src={iconLeft.src}
            label={iconLeft.label}
            size={iconSize}
            className="chip__icon"
          />
        )}
        <span className="chip__label">{children}</span>
        {iconRight && (
          <Icon
            name={iconRight.name}
            src={iconRight.src}
            label={iconRight.label}
            size={iconSize}
            className="chip__icon"
          />
        )}
      </span>
    </Tag>
  );
};

export default Chip;
