import React, { useId, useState } from 'react';
import { Icon } from '../Icon';
import './Input.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputValidation = 'default' | 'error' | 'success' | 'disabled' | 'readonly';

export interface InputIconProps {
  /** Material Symbols Rounded ligature name */
  name?: string;
  /** Custom SVG URL for Mathspace-specific icons */
  src?: string;
  /** Accessible label for the icon */
  label?: string;
}

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> {
  /**
   * Physical size of the field — controls height and font size.
   *   sm → 32px  compact forms, tables, filter sidebars
   *   md → 40px  standard (default)
   *   lg → 48px  landing pages, prominent onboarding forms
   */
  size?: InputSize;
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
   *   readonly → grey bg, native readOnly, no focus ring
   */
  validation?: InputValidation;
  /** Leading icon — rendered at 24px (md size) */
  iconLeft?: InputIconProps;
  /** Trailing icon — rendered at 24px (md size) */
  iconRight?: InputIconProps;
  /**
   * Override the auto-generated id.
   * The id is used to link the <label> and hint text via aria-describedby.
   */
  id?: string;
  /** Applied to the outer .field wrapper */
  className?: string;
}

// Icon shown in the hint message per validation state
const HINT_ICONS: Partial<Record<InputValidation, string>> = {
  error: 'error',
  success: 'check_circle',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Input
 *
 * Accessible text input with label, help text, and validation messaging.
 * Built on a native <input> element — inherits all HTML input attributes.
 *
 * Figma source: DS2 - Mathspace - 2025 (node 42:6052)
 *
 * Features:
 *   - Label linked via htmlFor/id (auto-generated if not provided)
 *   - aria-describedby links hint text for screen readers
 *   - aria-invalid on error state; role="alert" on error hint
 *   - aria-required reflects the required prop
 *   - Password fields get a show/hide toggle button automatically
 *   - forwardRef — can be used with react-hook-form and other form libraries
 *
 * Usage:
 *   <Input label="Email" type="email" placeholder="you@example.com" required />
 *   <Input label="Name" validation="error" hint="Name is required" />
 *   <Input label="Score" validation="success" hint="Looks good!" />
 *   <Input label="Bio" validation="disabled" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helpText,
      hint,
      validation = 'default',
      iconLeft,
      iconRight,
      id: idProp,
      className = '',
      size,
      disabled,
      readOnly,
      required,
      type = 'text',
      ...rest
    },
    ref,
  ) => {
    // Auto-generate a stable id so label is always associated even when caller
    // doesn't provide one. React.useId() is stable across renders.
    const autoId = useId();
    const id = idProp ?? `input-${autoId}`;
    const hintId = hint ? `${id}-hint` : undefined;

    // Password show/hide toggle
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    // Resolve the effective validation state — prop takes precedence, then
    // fall back to the disabled/readOnly HTML attributes for convenience.
    const effectiveValidation: InputValidation =
      disabled ? 'disabled'
      : readOnly ? 'readonly'
      : validation;

    const controlClass = [
      'field__control',
      effectiveValidation === 'error'    && 'field__control--error',
      effectiveValidation === 'success'  && 'field__control--success',
      effectiveValidation === 'disabled' && 'field__control--disabled',
      effectiveValidation === 'readonly' && 'field__control--readonly',
    ].filter(Boolean).join(' ');

    const hintClass = [
      'field__hint',
      effectiveValidation === 'error'   && 'field__hint--error',
      effectiveValidation === 'success' && 'field__hint--success',
    ].filter(Boolean).join(' ');

    const hintIcon = HINT_ICONS[effectiveValidation];

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

        <div className={controlClass}>
          {iconLeft && (
            <Icon
              name={iconLeft.name}
              src={iconLeft.src}
              label={iconLeft.label ?? ''}
              size="md"
              className="field__icon"
            />
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            className="input__field"
            disabled={effectiveValidation === 'disabled' || disabled}
            readOnly={effectiveValidation === 'readonly' || readOnly}
            required={required}
            aria-required={required || undefined}
            aria-invalid={effectiveValidation === 'error' || undefined}
            aria-describedby={hintId}
            {...rest}
          />

          {/* Password show/hide — replaces iconRight for password type */}
          {isPassword ? (
            <button
              type="button"
              className="input__toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="md" />
            </button>
          ) : (
            iconRight && (
              <Icon
                name={iconRight.name}
                src={iconRight.src}
                label={iconRight.label ?? ''}
                size="md"
                className="field__icon"
              />
            )
          )}
        </div>

        {hint && (
          <p
            id={hintId}
            className={hintClass}
            role={effectiveValidation === 'error' ? 'alert' : undefined}
          >
            {hintIcon && <Icon name={hintIcon} size="sm" />}
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
