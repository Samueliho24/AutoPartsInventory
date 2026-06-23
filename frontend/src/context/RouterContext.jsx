import { createContext, useContext, useState, useCallback } from 'react';

const VIEWS = {
  DASHBOARD: 'dashboard',
  INVENTORY: 'inventory',
  MOVEMENTS: 'movements',
  REPORTS: 'reports',
};

const RouterContext = createContext(null);

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

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter debe usarse dentro de un RouterProvider');
  }
  return ctx;
}
