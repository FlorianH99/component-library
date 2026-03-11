import * as React from 'react';
import { composeEventHandlers } from '../internal/composeEventHandlers';
import { mergeRefs } from '../internal/mergeRefs';

export type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

type SlotChildProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLElement>;
};

type SyntheticEventHandler = (event: React.SyntheticEvent) => void;

function mergeProps(slotProps: React.HTMLAttributes<HTMLElement>, childProps: SlotChildProps): SlotChildProps {
  const mergedProps: Record<string, unknown> = { ...slotProps, ...childProps };

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

    const slotHandler = slotProps[key as keyof React.HTMLAttributes<HTMLElement>] as unknown;
    const childHandler = childProps[key as keyof SlotChildProps] as unknown;

    if (typeof slotHandler === 'function' && typeof childHandler === 'function') {
      mergedProps[key] = composeEventHandlers(
        childHandler as SyntheticEventHandler,
        slotHandler as SyntheticEventHandler
      );
    }
  }

  return mergedProps as SlotChildProps;
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