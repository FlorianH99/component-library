import * as React from 'react';
import { cx } from '../../internal/cx';
import styles from './Card.module.css';

export type CardPadding = 'sm' | 'md' | 'lg';
export type CardSurface = 'outline' | 'raised' | 'sunken';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
  surface?: CardSurface;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, padding = 'md', surface = 'outline', ...props },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      className={cx(className, styles.card, styles[padding], styles[surface])}
      {...props}
    />
  );
});