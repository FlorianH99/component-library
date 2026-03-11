import * as React from 'react';
import { cx } from '../../internal/cx';
import styles from './Badge.module.css';

const badgeTones = ['neutral', 'accent', 'success', 'warning', 'danger'] as const;

type BadgeTone = (typeof badgeTones)[number];

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = 'neutral', ...props },
  forwardedRef
) {
  return <span ref={forwardedRef} className={cx(className, styles.badge, styles[tone])} {...props} />;
});

export type { BadgeTone };