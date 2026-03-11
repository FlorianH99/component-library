import * as React from 'react';
import { composeEventHandlers } from '../internal/composeEventHandlers';
import { mergeRefs } from '../internal/mergeRefs';

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

type SlotChildProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

function mergeProps(slotProps: React.HTMLAttributes<HTMLElement>, childProps: SlotChildProps) {
  const mergedProps: SlotChildProps = { ...slotProps, ...childProps };

  if (slotProps.className && typeof childProps.className === 'string') {
    mergedProps.className = `${slotProps.className} ${childProps.className}`;
  }

  if (slotProps.style || childProps.style) {
    mergedProps.style = {
      ...(slotProps.style ?? {}),
      ...(childProps.style ?? {})
    };
  }

  for (const key of Object.keys(slotProps)) {
    if (!key.startsWith('on')) {
      continue;
    }

    const slotHandler = slotProps[key as keyof React.HTMLAttributes<HTMLElement>];
    const childHandler = childProps[key as keyof SlotChildProps];

    if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
      mergedProps[key as keyof SlotChildProps] = composeEventHandlers(
        childHandler as (event: React.SyntheticEvent) => void,
        slotHandler as (event: React.SyntheticEvent) => void
      ) as SlotChildProps[keyof SlotChildProps];
    }
  }

  return mergedProps;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef
) {
  if (!React.isValidElement<SlotChildProps>(children)) {
    return null;
  }

  const childProps = children.props;

  return React.cloneElement(children, {
    ...mergeProps(slotProps, childProps),
    ref: mergeRefs(forwardedRef, childProps.ref)
  });
});