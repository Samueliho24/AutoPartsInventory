import styles from './Inventory.module.scss';

function Inventory() {
  return (
    <div className="page-container">
      <h1 className="page-title">Inventario</h1>
      <p className={styles.placeholder}>
        Aquí se mostrará la tabla de repuestos con búsqueda, filtros y opciones de
        edición.
      </p>
    </div>
  );
}

export default Inventory;
