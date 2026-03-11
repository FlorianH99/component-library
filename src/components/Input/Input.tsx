import * as React from 'react';
import { cx } from '../../internal/cx';
import { useFieldControlProps } from '../Field/Field';
import styles from '../shared/Control.module.css';

const inputSizes = ['sm', 'md', 'lg'] as const;

type InputSize = (typeof inputSizes)[number];

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: InputSize;
  invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = 'md', invalid, type = 'text', ...props },
  forwardedRef
) {
  const fieldProps = useFieldControlProps({ ...props, invalid });
  const { invalid: resolvedInvalid, ...inputProps } = fieldProps;

  return (
    <input
      ref={forwardedRef}
      className={cx(className, styles.root, styles[size], resolvedInvalid && styles.invalid)}
      type={type}
      {...inputProps}
    />
  );
});

export type { InputSize };