import * as React from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  children: React.ReactNode;
  container?: HTMLElement | null;
};

export function Portal({ children, container }: PortalProps): React.ReactPortal | null {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, container ?? document.body);
}