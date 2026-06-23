import styles from './Reports.module.scss';

function Reports() {
  return (
    <div className="page-container">
      <h1 className="page-title">Reportes</h1>
      <p className={styles.placeholder}>
        Aquí se podrán generar y exportar reportes en PDF del inventario y
        movimientos.
      </p>
    </div>
  );
}

export default Reports;
