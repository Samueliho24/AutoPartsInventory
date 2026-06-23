<<<<<<< Updated upstream
import { useRouter } from '../context/RouterContext';
=======
import { useRouter } from '../context/useRouter';
>>>>>>> Stashed changes
import { LayoutDashboard, Package, ArrowRightLeft, FileSpreadsheet } from 'lucide-react';
import styles from './Sidebar.module.scss';

const menuItems = [
  { view: 'dashboard', label: 'Panel', Icon: LayoutDashboard },
  { view: 'inventory', label: 'Inventario', Icon: Package },
  { view: 'movements', label: 'Movimientos', Icon: ArrowRightLeft },
  { view: 'reports', label: 'Reportes', Icon: FileSpreadsheet },
];

function Sidebar() {
  const { activeView, navigate } = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Package size={28} />
        <span className={styles.logoText}>Repuestos</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map(({ view, label, Icon }) => (
          <button
            key={view}
            className={`${styles.navItem} ${activeView === view ? styles.active : ''}`}
            onClick={() => navigate(view)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
