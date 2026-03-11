import * as React from 'react';
import { cx } from '../../internal/cx';
import { useFieldControlProps } from '../Field/Field';
import styles from '../shared/Control.module.css';

const textareaSizes = ['sm', 'md', 'lg'] as const;
const textareaResizes = ['vertical', 'both', 'none'] as const;

type TextareaSize = (typeof textareaSizes)[number];
type TextareaResize = (typeof textareaResizes)[number];

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: TextareaSize;
  resize?: TextareaResize;
  invalid?: boolean;
};

function getResizeClass(resize: TextareaResize) {
  switch (resize) {
    case 'both':
      return styles.resizeBoth;
    case 'none':
      return styles.noResize;
    default:
      return undefined;
  }
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size = 'md', resize = 'vertical', invalid, rows = 5, ...props },
  forwardedRef
) {
  const fieldProps = useFieldControlProps({ ...props, invalid });
  const { invalid: resolvedInvalid, ...textareaProps } = fieldProps;

  return (
    <textarea
      ref={forwardedRef}
      className={cx(
        className,
        styles.root,
        styles.textarea,
        styles[size],
        resolvedInvalid && styles.invalid,
        getResizeClass(resize)
      )}
      rows={rows}
      {...textareaProps}
    />
  );
});

export type { TextareaResize, TextareaSize };