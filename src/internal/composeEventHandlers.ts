import type * as React from 'react';

export function composeEventHandlers<EventType extends React.SyntheticEvent>(
  originalHandler: ((event: EventType) => void) | undefined,
  nextHandler: (event: EventType) => void
): (event: EventType) => void {
  return (event) => {
    originalHandler?.(event);

    if (!event.defaultPrevented) {
      nextHandler(event);
    }
  };
}