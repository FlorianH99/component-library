import * as React from 'react';
import { cx } from '../../internal/cx';
import styles from './Switch.module.css';

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, description, id, label, ...props },
  forwardedRef
) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  return (
    <label className={cx(className, styles.root)} htmlFor={switchId}>
      <span className={styles.trackWrap}>
        <input
          {...props}
          ref={forwardedRef}
          className={styles.input}
          id={switchId}
          role="switch"
          type="checkbox"
        />
        <span aria-hidden="true" className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </span>
      <span className={styles.copy}>
        <span className={styles.label}>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
});