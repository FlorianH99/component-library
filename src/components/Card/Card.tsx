import * as React from 'react';
import { cx } from '../../internal/cx';
import styles from './Card.module.css';

const cardPaddings = ['sm', 'md', 'lg'] as const;
const cardSurfaces = ['outline', 'raised', 'sunken'] as const;

type CardPadding = (typeof cardPaddings)[number];
type CardSurface = (typeof cardSurfaces)[number];

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

export type { CardPadding, CardSurface };