import { useState, useCallback } from 'react';
import { RouterContext } from './RouterContext';
import { VIEWS } from './views';

export function RouterProvider({ children }) {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);

  const navigate = useCallback((view) => {
    setActiveView(view);
  }, []);

  return (
    <RouterContext.Provider value={{ activeView, navigate, VIEWS }}>
      {children}
    </RouterContext.Provider>
  );
}
