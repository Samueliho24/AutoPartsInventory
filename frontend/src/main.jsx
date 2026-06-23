import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.scss';
<<<<<<< Updated upstream
import { RouterProvider } from './context/RouterContext';
=======
>>>>>>> Stashed changes
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< Updated upstream
    <RouterProvider>
      <App />
    </RouterProvider>
=======
    <App />
>>>>>>> Stashed changes
  </StrictMode>,
);
