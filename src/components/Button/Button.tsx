import * as React from 'react';
import { Slot } from '../../primitives/Slot';
import { cx } from '../../internal/cx';
import { VisuallyHidden } from '../../primitives/VisuallyHidden';
import styles from './Button.module.css';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ButtonTone = 'accent' | 'neutral' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonCommonProps = {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
};

type ButtonAsChildProps = ButtonCommonProps & {
  asChild: true;
  children: React.ReactElement;
  disabled?: never;
  loading?: never;
  loadingLabel?: never;
  type?: never;
};

type ButtonNativeProps = ButtonCommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
    asChild?: false;
    children: React.ReactNode;
    loading?: boolean;
    loadingLabel?: string;
  };

export type ButtonProps = ButtonAsChildProps | ButtonNativeProps;

function getVariantClass(variant: ButtonVariant, tone: ButtonTone) {
  return styles[`${variant}${tone.charAt(0).toUpperCase()}${tone.slice(1)}`];
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, forwardedRef) {
  const {
    variant = 'solid',
    tone = 'accent',
    size = 'md',
    block = false,
    className
  } = props;

  const classes = cx(className, styles.button, styles[size], block && styles.block, getVariantClass(variant, tone));

  if (props.asChild) {
    return (
      <Slot ref={forwardedRef as React.Ref<HTMLElement>} className={classes}>
        {props.children}
      </Slot>
    );
  }

  const {
    children,
    loading = false,
    loadingLabel = 'Loading',
    disabled,
    type = 'button',
    ...buttonProps
  } = props;

  return (
    <button
      ref={forwardedRef}
      className={classes}
      data-loading={loading ? '' : undefined}
      disabled={disabled || loading}
      type={type}
      {...buttonProps}
    >
      {loading ? (
        <>
          <span aria-hidden="true" className={styles.spinner} />
          <span className={styles.contentHidden}>{children}</span>
          <VisuallyHidden>{loadingLabel}</VisuallyHidden>
        </>
      ) : (
        children
      )}
    </button>
  );
});