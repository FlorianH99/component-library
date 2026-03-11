import * as React from 'react';
import { cx } from '../../internal/cx';
import buttonStyles from '../Button/Button.module.css';

type IconButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
type IconButtonTone = 'accent' | 'neutral' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> & {
  children: React.ReactElement;
  'aria-label': string;
  variant?: IconButtonVariant;
  tone?: IconButtonTone;
  size?: IconButtonSize;
};

function getVariantClass(variant: IconButtonVariant, tone: IconButtonTone) {
  return buttonStyles[`${variant}${tone.charAt(0).toUpperCase()}${tone.slice(1)}`];
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, children, variant = 'ghost', tone = 'neutral', size = 'md', type = 'button', ...props },
  forwardedRef
) {
  return (
    <button
      ref={forwardedRef}
      className={cx(className, buttonStyles.button, buttonStyles[size], getVariantClass(variant, tone))}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});