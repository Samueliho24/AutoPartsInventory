import { useContext } from 'react';
import { RouterContext } from './RouterContext';

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter debe usarse dentro de un RouterProvider');
  }
  return ctx;
}
