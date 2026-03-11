import * as React from 'react';
import { composeEventHandlers } from '../internal/composeEventHandlers';
import { mergeRefs } from '../internal/mergeRefs';

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

function mergeProps(slotProps: React.HTMLAttributes<HTMLElement>, childProps: Record<string, unknown>) {
  const mergedProps: Record<string, unknown> = { ...slotProps, ...childProps };

  if (slotProps.className && typeof childProps.className === 'string') {
    mergedProps.className = `${slotProps.className} ${childProps.className}`;
  }

  if (slotProps.style || childProps.style) {
    mergedProps.style = {
      ...(slotProps.style ?? {}),
      ...(childProps.style as React.CSSProperties | undefined)
    };
  }

  for (const key of Object.keys(slotProps)) {
    if (!key.startsWith('on')) {
      continue;
    }

    const slotHandler = slotProps[key as keyof React.HTMLAttributes<HTMLElement>];
    const childHandler = childProps[key];

    if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
      mergedProps[key] = composeEventHandlers(
        childHandler as (event: React.SyntheticEvent) => void,
        slotHandler as (event: React.SyntheticEvent) => void
      );
    }
  }

  return mergedProps;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef
) {
  if (!React.isValidElement(children)) {
    return null;
  }

  const childProps = children.props as Record<string, unknown> & { ref?: React.Ref<HTMLElement> };

  return React.cloneElement(children, {
    ...mergeProps(slotProps, childProps),
    ref: mergeRefs(forwardedRef, childProps.ref)
  });
});