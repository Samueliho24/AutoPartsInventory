import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import styles from './Dashboard.module.scss';

const stats = [
  { label: 'Total de repuestos', value: 0, Icon: Package, color: '#00bcd4' },
  { label: 'Entradas del mes', value: 0, Icon: TrendingUp, color: '#4caf50' },
  { label: 'Stock bajo', value: 0, Icon: AlertTriangle, color: '#ff9800' },
  { label: 'Valor en inventario', value: '$0.00', Icon: DollarSign, color: '#ff6f00' },
];

function Dashboard() {
  return (
    <div className="page-container">
      <h1 className="page-title">Panel de control</h1>

      <div className={styles.grid}>
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className={styles.card}>
            <div className={styles.cardIcon} style={{ backgroundColor: `${color}20`, color }}>
              <Icon size={24} />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{value}</span>
              <span className={styles.cardLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
