import * as React from 'react';
import { cx } from '../../internal/cx';
import { mergeRefs } from '../../internal/mergeRefs';
import styles from './Checkbox.module.css';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  label: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  indeterminate?: boolean;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, description, id, invalid = false, indeterminate = false, label, ...props },
  forwardedRef
) {
  const internalRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;

  React.useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={cx(className, styles.root)}
      data-disabled={props.disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      htmlFor={checkboxId}
    >
      <span className={styles.indicatorWrap}>
        <input
          {...props}
          ref={mergeRefs(forwardedRef, internalRef)}
          className={styles.input}
          data-indeterminate={indeterminate ? 'true' : undefined}
          id={checkboxId}
          type="checkbox"
          aria-invalid={invalid || undefined}
        />
        <span aria-hidden="true" className={styles.indicator} />
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
});