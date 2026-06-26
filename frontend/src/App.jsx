import { ToastProvider } from './context/ToastContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ToastProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Dashboard />
      </div>
    </ToastProvider>
  );
}

export default App;
