import styles from './Movements.module.scss';

function Movements() {
  return (
    <div className="page-container">
      <h1 className="page-title">Movimientos</h1>
      <p className={styles.placeholder}>
        Aquí se registrarán las entradas y salidas de mercancía, con su tipo,
        cantidad y referencia.
      </p>
    </div>
  );
}

export default Movements;
