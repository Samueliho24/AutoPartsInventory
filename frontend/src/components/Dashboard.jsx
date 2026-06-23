import { useState, useMemo } from 'react';
import { Printer, Search, Plus, Minus, Package } from 'lucide-react';
import styles from './Dashboard.module.scss';
import ModalCarga from './ModalCarga';
import ModalDescarga from './ModalDescarga';
import ModalReporte from './ModalReporte';

const initialParts = [
  { id: '1', part_number: 'BRAKE-PAD-001', location: 'Estante A3', description: 'Pastillas de freno delanteras', stock: 10 },
  { id: '2', part_number: 'OIL-FILTER-101', location: 'Estante B1', description: 'Filtro de aceite estándar', stock: 25 },
  { id: '3', part_number: 'SPARK-PLUG-X2', location: 'Estante C2', description: 'Bujía de encendido', stock: 50 },
];

function Dashboard() {
  const [parts, setParts] = useState(initialParts);
  const [search, setSearch] = useState('');
  const [modalCargaOpen, setModalCargaOpen] = useState(false);
  const [modalDescargaOpen, setModalDescargaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const filteredParts = useMemo(() => {
    if (!search.trim()) return parts;
    const q = search.toLowerCase();
    return parts.filter((p) => p.part_number.toLowerCase().includes(q));
  }, [search, parts]);

  const handleCargaConfirm = (partNumber, location, description, quantity) => {
    const existing = parts.find((p) => p.part_number === partNumber);
    if (existing) {
      setParts((prev) =>
        prev.map((p) =>
          p.part_number === partNumber
            ? { ...p, stock: p.stock + quantity, location: location || p.location, description: description || p.description }
            : p,
        ),
      );
    } else {
      const newPart = {
        id: Date.now().toString(),
        part_number: partNumber,
        location: location || '—',
        description: description || '—',
        stock: quantity,
      };
      setParts((prev) => [...prev, newPart]);
    }
  };

  const handleDescargaConfirm = (partNumber, quantity) => {
    setParts((prev) =>
      prev.map((p) =>
        p.part_number === partNumber ? { ...p, stock: p.stock - quantity } : p,
      ),
    );
  };

  const openDescarga = (part) => {
    setSelectedPart(part);
    setModalDescargaOpen(true);
  };

  const openCarga = (part) => {
    setSelectedPart(part);
    setModalCargaOpen(true);
  };

  const handleGenerarReporte = (reportType) => {
    if (window.pywebview?.api?.generate_report) {
      window.pywebview.api.generate_report(reportType);
    } else {
      alert(`Reporte "${reportType}" generado (demo).`);
    }
  };

  const getStockBadgeClass = (stock) => {
    if (stock <= 5) return styles.badgeLow;
    if (stock <= 20) return styles.badgeMid;
    return styles.badgeHigh;
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Package size={28} className={styles.headerIcon} />
          <div>
            <h1 className={styles.headerTitle}>Control de Inventario</h1>
            <p className={styles.headerSub}>Gestión rápida de repuestos</p>
          </div>
        </div>
        <button className={styles.btnPrint} onClick={() => setModalReporteOpen(true)}>
          <Printer size={18} />
          Imprimir Reporte
        </button>
      </header>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por Número de Parte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.btnCarga} onClick={() => openCarga(null)}>
            <Plus size={20} />
            Cargar Entrada
          </button>
          <button className={styles.btnDescarga} onClick={() => openDescarga(null)}>
            <Minus size={20} />
            Descargar Salida
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número de Parte</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Cantidad en Existencia</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((part) => (
              <tr key={part.id} className={styles.tableRow}>
                <td className={styles.cellPart}>{part.part_number}</td>
                <td className={styles.cellLocation}>{part.location}</td>
                <td className={styles.cellDesc}>{part.description}</td>
                <td>
                  <span className={`${styles.stockBadge} ${getStockBadgeClass(part.stock)}`}>
                    {part.stock}
                  </span>
                </td>
              </tr>
            ))}
            {filteredParts.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  No se encontraron repuestos con ese número de parte.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      <ModalCarga
        key={`carga-${modalCargaOpen}`}
        isOpen={modalCargaOpen}
        onClose={() => setModalCargaOpen(false)}
        onConfirm={handleCargaConfirm}
        initialPart={selectedPart}
      />
      <ModalDescarga
        key={`descarga-${modalDescargaOpen}`}
        isOpen={modalDescargaOpen}
        onClose={() => { setModalDescargaOpen(false); setSelectedPart(null); }}
        onConfirm={handleDescargaConfirm}
        parts={parts}
        initialPart={selectedPart}
      />
      <ModalReporte
        isOpen={modalReporteOpen}
        onClose={() => setModalReporteOpen(false)}
        onGenerar={handleGenerarReporte}
      />
    </div>
  );
}

export default Dashboard;
