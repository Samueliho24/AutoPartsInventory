<<<<<<< Updated upstream
import { useRouter } from './context/RouterContext';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import Movements from './views/Movements';
import Reports from './views/Reports';

const viewMap = {
  dashboard: Dashboard,
  inventory: Inventory,
  movements: Movements,
  reports: Reports,
};

function App() {
  const { activeView } = useRouter();
  const ViewComponent = viewMap[activeView] || Dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <ViewComponent />
      </main>
=======
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Dashboard />
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
