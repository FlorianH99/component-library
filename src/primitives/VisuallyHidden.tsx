import type * as React from 'react';

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="visuallyHidden">{children}</span>;
}