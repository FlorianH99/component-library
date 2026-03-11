import * as React from 'react';

export function createContext<ContextValue>(name: string) {
  const context = React.createContext<ContextValue | null>(null);

  function useContextValue(): ContextValue {
    const value = React.useContext(context);

    if (value === null) {
      throw new Error(`${name} must be used within ${name}Provider.`);
    }

    return value;
  }

  return [context.Provider, useContextValue] as const;
}