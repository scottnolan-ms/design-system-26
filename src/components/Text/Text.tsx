import React from 'react';
import './Text.css';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Visual style — maps 1:1 to a Figma text style.
 * Completely independent of the HTML element rendered.
 *
 * Figma group → style prefix:
 *   Headings/     → "heading-{size}"
 *   Body/         → "body-{size}" / "body-{size}--strong"
 *   Label/        → "label-{size}" / "label-{size}--strong"
 *   Milo/         → "milo-{size}"
 */
type TextStyle =
  // Headings (Gilroy ExtraBold)
  | 'heading-xl' | 'heading-l' | 'heading-m' | 'heading-s' | 'heading-xs'
  // Body regular (Proxima Nova 400)
  | 'body-xl' | 'body-l' | 'body' | 'body-s' | 'body-xs'
  // Body strong (Proxima Nova 600)
  | 'body-xl--strong' | 'body-l--strong' | 'body--strong' | 'body-s--strong' | 'body-xs--strong'
  // Labels medium (Proxima Nova 500, tight line-height)
  | 'label-l' | 'label' | 'label-s' | 'label-xs'
  // Labels strong (Proxima Nova 600, tight line-height)
  | 'label-l--strong' | 'label--strong' | 'label-s--strong' | 'label-xs--strong'
  // Milo regular (Playpen Sans 400) — student voice
  | 'milo-heading-xl' | 'milo-heading-l' | 'milo-heading-m'
  | 'milo-xl' | 'milo-l' | 'milo' | 'milo-s' | 'milo-xs'
  // Milo strong (Playpen Sans 600)
  | 'milo-heading-xl--strong' | 'milo-heading-l--strong' | 'milo-heading-m--strong'
  | 'milo-xl--strong' | 'milo-l--strong' | 'milo--strong' | 'milo-s--strong' | 'milo-xs--strong';

/**
 * Semantic HTML elements this component can render as.
 * h1–h6 are for document structure / accessibility — NOT for controlling visual size.
 */
type TextElement =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'div' | 'label' | 'legend' | 'figcaption' | 'caption';

type TextColor = 'on-primary' | 'on-surface' | 'primary' | 'subtle';

export interface TextProps {
  /**
   * The HTML element to render — controls semantics and accessibility.
   * Does NOT affect visual appearance.
   *
   * Use h1–h6 for document headings (screen readers, SEO, focus order).
   * Use p/span/div for body copy and inline text.
   *
   * Default: 'p' for block styles, 'span' for inline.
   */
  as?: TextElement;
  /**
   * The visual style — maps to a Figma text style.
   * Completely independent of `as`.
   *
   * Examples:
   *   as="h1" style="heading-xs"  → semantically h1, visually small (tight dashboard)
   *   as="h1" style="heading-xl"  → semantically h1, visually large (hero section)
   *   as="p"  style="heading-m"   → not a heading in the document, but looks like one
   */
  style?: TextStyle;
  /** Optional colour override */
  color?: TextColor;
  children: React.ReactNode;
  className?: string;
  id?: string;
  htmlFor?: string; // for <label>
  [key: string]: unknown; // pass-through aria-*, data-* etc.
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Text
 *
 * The core primitive for all text rendering in the design system.
 *
 * Key principle: semantic element and visual style are independent.
 *
 *   ✓  <Text as="h2" style="heading-m">Chapter title</Text>
 *   ✓  <Text as="h2" style="heading-xs">Widget title in dense dashboard</Text>
 *   ✓  <Text as="p"  style="body-s">Supporting copy</Text>
 *   ✓  <Text as="span" style="label-xs--strong">Badge</Text>
 *
 * Do NOT use raw h1–h6, p, span etc. in components — always go through Text
 * so the design system controls the visual output consistently.
 *
 * Component sizing (Default / Small / Large):
 *   Size variants are handled by the PARENT COMPONENT, not by Text.
 *   e.g. a Card component in "small" mode passes a smaller style prop to Text:
 *     size="small" → <Text style="body-s" />
 *     size="large" → <Text style="body-l" />
 *   This keeps sizing decisions in the component, typography tokens stay fixed.
 */
export const Text: React.FC<TextProps> = ({
  as: Tag = 'p',
  style,
  color,
  children,
  className = '',
  htmlFor,
  ...rest
}) => {
  const classes = [
    'text',
    style ? `text-${style}` : '',
    color ? `text--${color}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // labelFor is only valid on <label>
  const labelProps = Tag === 'label' && htmlFor ? { htmlFor } : {};

  return (
    <Tag className={classes} {...labelProps} {...rest}>
      {children}
    </Tag>
  );
};

export default Text;
