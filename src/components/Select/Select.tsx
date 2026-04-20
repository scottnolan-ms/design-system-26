import React, { useId, useState } from 'react';
import { Icon } from '../Icon';
import '../Input/Input.css'; // shared .field__* and label/hint styles
import './Select.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type SelectValidation = 'default' | 'error' | 'success' | 'disabled';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children' | 'size'> {
  /** The list of options to render */
  options: SelectOption[];
  /**
   * Physical size of the field — controls height and font size.
   *   sm → 32px  compact forms, tables, filter panels
   *   md → 40px  standard (default)
   *   lg → 48px  landing pages, prominent onboarding forms
   */
  size?: SelectSize;
  /**
   * Placeholder rendered as the first, disabled option.
   * Shows when no value is selected and prompts the user to choose.
   * Should be descriptive: "Select a state" rather than "Choose…"
   */
  placeholder?: string;
  /** Visible label rendered above the field in a <label> element */
  label?: string;
  /**
   * Supplementary description between the label and the control.
   * Use for guidance that helps the user complete the field correctly.
   */
  helpText?: string;
  /**
   * Feedback message rendered below the control.
   * Colour and icon are derived from `validation`.
   */
  hint?: string;
  /**
   * Visual + semantic validation state.
   *   default  → no validation signal
   *   error    → red border + pink bg, aria-invalid, role=alert on hint
   *   success  → green border
   *   disabled → grey bg, pointer-events none, aria-disabled propagated
   */
  validation?: SelectValidation;
  /** Leading icon — rendered at 24px (md size) */
  iconLeft?: { name?: string; src?: string; label?: string };
  /**
   * Override the auto-generated id.
   * The id is used to link the <label> and hint text via aria-describedby.
   */
  id?: string;
  /** Applied to the outer .field wrapper */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Select (Dropdown)
 *
 * Accessible dropdown built on a native <select> element.
 *
 * Figma source: DS2 - Mathspace - 2025 (node 180:46611)
 *
 * Why native <select>?
 *   - Full keyboard navigation out of the box (arrows, type-ahead, Enter)
 *   - Screen reader semantics are correct without custom ARIA
 *   - Mobile devices open the native OS picker — familiar and accessible
 *   - No JavaScript required for open/close state management
 *
 * The chevron rotates on :focus-within as a visual cue that the dropdown
 * is open. Browser-rendered option lists remain unstyled — this is
 * intentional: it ensures reliable accessibility across all platforms.
 *
 * For multi-select, virtualized lists, or custom option rendering,
 * a headless library like Radix Select or React Aria ComboBox should
 * be used instead of this component.
 *
 * Features:
 *   - Label linked via htmlFor/id (auto-generated if not provided)
 *   - aria-describedby links hint text for screen readers
 *   - aria-invalid on error state; role="alert" on error hint
 *   - aria-required reflects the required prop
 *   - forwardRef — compatible with react-hook-form and other form libraries
 *
 * Usage:
 *   <Select
 *     label="Year level"
 *     placeholder="Select a year…"
 *     options={[
 *       { value: '7', label: 'Year 7' },
 *       { value: '8', label: 'Year 8' },
 *       { value: '9', label: 'Year 9' },
 *     ]}
 *   />
 *   <Select label="State" validation="error" hint="Please select a state" options={states} />
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      placeholder,
      label,
      helpText,
      hint,
      validation = 'default',
      iconLeft,
      id: idProp,
      className = '',
      size,
      disabled,
      required,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? `select-${autoId}`;
    const hintId = hint ? `${id}-hint` : undefined;

    // Track open state to rotate the chevron
    const [isOpen, setIsOpen] = useState(false);

    const effectiveValidation: SelectValidation = disabled ? 'disabled' : validation;

    const controlClass = [
      'field__control',
      effectiveValidation === 'error'    && 'field__control--error',
      effectiveValidation === 'success'  && 'field__control--success',
      effectiveValidation === 'disabled' && 'field__control--disabled',
    ].filter(Boolean).join(' ');

    const hintClass = [
      'field__hint',
      effectiveValidation === 'error'   && 'field__hint--error',
      effectiveValidation === 'success' && 'field__hint--success',
    ].filter(Boolean).join(' ');

    const fieldClass = [
      'field',
      size && size !== 'md' ? `field--${size}` : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={fieldClass}>
        {label && (
          <label htmlFor={id} className="field__label">
            {label}
            {required && (
              <span className="field__required" aria-hidden="true">
                {' '}*
              </span>
            )}
          </label>
        )}

        {helpText && <p className="field__help">{helpText}</p>}

        <div
          className={controlClass}
          data-open={isOpen || undefined}
        >
          {iconLeft && (
            <Icon
              name={iconLeft.name}
              src={iconLeft.src}
              label={iconLeft.label ?? ''}
              size="md"
              className="field__icon"
            />
          )}

          <select
            ref={ref}
            id={id}
            className="select__field"
            disabled={effectiveValidation === 'disabled' || disabled}
            required={required}
            aria-required={required || undefined}
            aria-invalid={effectiveValidation === 'error' || undefined}
            aria-describedby={hintId}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onChange={e => {
              setIsOpen(false);
              onChange?.(e);
            }}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron — pointer-events:none so clicks pass through to the native select */}
          <Icon
            name="expand_more"
            size="md"
            className="select__arrow"
            aria-hidden
          />
        </div>

        {hint && (
          <p
            id={hintId}
            className={hintClass}
            role={effectiveValidation === 'error' ? 'alert' : undefined}
          >
            {effectiveValidation === 'error'   && <Icon name="error" size="sm" />}
            {effectiveValidation === 'success' && <Icon name="check_circle" size="sm" />}
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
