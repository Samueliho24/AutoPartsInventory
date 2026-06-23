import { useState, useMemo, useEffect } from 'react';
import { Printer, Search, Plus, Minus, Package } from 'lucide-react';
import styles from './Dashboard.module.scss';
import ModalCarga from './ModalCarga';
import ModalDescarga from './ModalDescarga';
import ModalReporte from './ModalReporte';

const initialParts = [
  { id: '1',  part_number: '90915-YZZN1',  location: 'Estante A1', description: 'Filtro de aceite original Toyota (Corolla, Yaris, Terios)', stock: 27 },
  { id: '2',  part_number: '15400-PLM-A02', location: 'Estante A1', description: 'Filtro de aceite original Honda (Civic, Accord)', stock: 16 },
  { id: '3',  part_number: 'FL-820S',       location: 'Estante A2', description: 'Filtro de aceite Motorcraft Ford (F-150, Explorer)', stock: 23 },
  { id: '4',  part_number: 'A2462C',        location: 'Estante A3', description: 'Filtro de aire de motor ACDelco GM (línea profesional)', stock: 12 },
  { id: '5',  part_number: '04465-0K290',   location: 'Estante B1', description: 'Pastillas de freno delanteras Toyota (Hilux, Fortuner)', stock: 36 },
  { id: '6',  part_number: '7L2Z-1104-A',   location: 'Estante B2', description: 'Cubo de rueda delantero Ford (Explorer 2006-2010)', stock: 8 },
  { id: '7',  part_number: '513288',        location: 'Estante B3', description: 'Rodamiento de rueda trasera SKF (Chevrolet)', stock: 50 },
  { id: '8',  part_number: '54611-3X000',   location: 'Estante B4', description: 'Amortiguador delantero Hyundai (Elantra)', stock: 9 },
  { id: '9',  part_number: '12622441',      location: 'Estante C1', description: 'Bobina de encendido GM Genuine (Tahoe, Silverado)', stock: 20 },
  { id: '10', part_number: 'ILKAR7B11',     location: 'Estante C2', description: 'Bujía de iridio NGK (Subaru, Toyota, Nissan)', stock: 88 },
  { id: '11', part_number: '30520-R40-007', location: 'Estante C1', description: 'Bobina de encendido Honda (K24 Accord, CR-V)', stock: 9 },
  { id: '12', part_number: '7701048390',    location: 'Estante C3', description: 'Bobina de encendido Renault (Clio, Logan, Megane)', stock: 11 },
  { id: '13', part_number: 'K060840',       location: 'Estante D1', description: 'Correa de accesorios Gates serpentina 6 canales', stock: 34 },
  { id: '14', part_number: '16100-39426',   location: 'Estante D2', description: 'Bomba de agua original Toyota (4Runner, Tacoma)', stock: 5 },
  { id: '15', part_number: '5070',          location: 'Estante D3', description: 'Termostato de motor Stant (Ford, GM)', stock: 55 },
];

function Dashboard() {
  const [parts, setParts] = useState(initialParts);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (window.pywebview?.api?.get_all_parts) {
      window.pywebview.api.get_all_parts().then((data) => {
        if (Array.isArray(data)) setParts(data);
      });
    }
  }, []);
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
