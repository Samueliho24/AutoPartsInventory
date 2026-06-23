import { useState, useMemo, useEffect, useCallback } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { Printer, Search, Plus, Minus, Package, Info, Pencil } from 'lucide-react';
import styles from './Dashboard.module.scss';
import ModalCarga from './ModalCarga';
import ModalDescarga from './ModalDescarga';
import ModalReporte from './ModalReporte';
import ModalPrecio from './ModalPrecio';
import ModalAcerca from './ModalAcerca';
import { getInventory, loadEntry, unloadExit, updatePartPrice, generateReportPdf } from '../services/api';

function Dashboard() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventory().then((data) => {
      if (Array.isArray(data)) setParts(data);
      setLoading(false);
    });
  }, []);

  const refreshInventory = useCallback(() => {
    getInventory().then((data) => {
      if (Array.isArray(data)) setParts(data);
    });
  }, []);

  const [modalCargaOpen, setModalCargaOpen] = useState(false);
  const [modalDescargaOpen, setModalDescargaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);
  const [modalPrecioOpen, setModalPrecioOpen] = useState(false);
  const [modalAcercaOpen, setModalAcercaOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const filteredParts = useMemo(() => {
    if (!search.trim()) return parts;
    const q = search.toLowerCase();
    return parts.filter((p) => p.part_number.toLowerCase().includes(q));
  }, [search, parts]);

  const handleCargaConfirm = async (partNumber, location, description, quantity) => {
    try {
      await loadEntry(partNumber, location, description, quantity);
      refreshInventory();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDescargaConfirm = async (partNumber, quantity) => {
    try {
      await unloadExit(partNumber, quantity);
      refreshInventory();
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePrecioConfirm = async (partId, salePrice, currency) => {
    try {
      const updated = await updatePartPrice(partId, salePrice, currency);
      setParts((prev) =>
        prev.map((p) => (p.id === partId ? { ...p, ...updated } : p)),
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const handleGenerarReporte = async (reportType, dateFrom, dateTo) => {
    try {
      await generateReportPdf(reportType, dateFrom, dateTo);
    } catch (e) {
      alert(e.message);
    }
  };

  const openDescarga = (part) => {
    setSelectedPart(part);
    setModalDescargaOpen(true);
  };

  const openCarga = (part) => {
    setSelectedPart(part);
    setModalCargaOpen(true);
  };

  const openPrecio = (part) => {
    setSelectedPart(part);
    setModalPrecioOpen(true);
  };

  const getStockBadgeClass = (stock) => {
    if (stock <= 5) return styles.badgeLow;
    if (stock <= 20) return styles.badgeMid;
    return styles.badgeHigh;
  };

  const formatPrice = (part) => {
    if (part.sale_price == null) return '—';
    const symbol = part.currency === 'Bs' ? 'Bs.' : '$';
    return `${symbol} ${Number(part.sale_price).toFixed(2)}`;
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Package size={28} className={styles.headerIcon} />
          <div>
            <h1 className={styles.headerTitle}>Control de Inventario</h1>
            <p className={styles.headerSub}>Gestión rápida de repuestos</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnAbout} onClick={() => setModalAcercaOpen(true)}>
            <Info size={18} />
            Acerca de
          </button>
          <button className={styles.btnPrint} onClick={() => setModalReporteOpen(true)}>
            <Printer size={18} />
            Imprimir Reporte
          </button>
        </div>
      </header>

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

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingRow}>Cargando inventario...</div>
        ) : (
          <TableVirtuoso
            style={{ height: '100%' }}
            data={filteredParts}
            fixedHeaderContent={() => (
              <tr>
                <th style={{ width: 160 }}>Número de Parte</th>
                <th style={{ width: 120 }}>Ubicación</th>
                <th>Descripción</th>
                <th style={{ width: 100 }}>Stock</th>
                <th style={{ width: 120 }}>Precio Venta</th>
                <th style={{ width: 80 }}>Moneda</th>
                <th style={{ width: 110 }}>Acción</th>
              </tr>
            )}
            itemContent={(index, part) => (
              <>
                <td className={styles.cellPart}>{part.part_number}</td>
                <td className={styles.cellLocation}>{part.location}</td>
                <td className={styles.cellDesc}>{part.description}</td>
                <td>
                  <span className={`${styles.stockBadge} ${getStockBadgeClass(part.stock)}`}>
                    {part.stock}
                  </span>
                </td>
                <td className={styles.cellPrice}>{formatPrice(part)}</td>
                <td className={styles.cellCurrency}>{part.currency || '—'}</td>
                <td>
                  <div className={styles.actionBtns}>
                    <button className={styles.btnAction} onClick={() => openCarga(part)} title="Entrada">
                      <Plus size={14} />
                    </button>
                    <button className={styles.btnAction} onClick={() => openDescarga(part)} title="Salida">
                      <Minus size={14} />
                    </button>
                    <button className={styles.btnAction} onClick={() => openPrecio(part)} title="Editar precio">
                      <Pencil size={14} />
                    </button>
                  </div>
                </td>
              </>
            )}
            components={{
              Table: (props) => <table {...props} className={styles.table} />,
              EmptyPlaceholder: () => (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    No se encontraron repuestos con ese número de parte.
                  </td>
                </tr>
              ),
              TableRow: ({ item, ...props }) => (
                <tr {...props} className={styles.tableRow} />
              ),
            }}
          />
        )}
      </div>

      <footer className={styles.footer}>
        <span>© 2026 Tu Nombre. Todos los derechos reservados.</span>
        <span className={styles.footerVersion}>v1.1.0</span>
      </footer>

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
      <ModalPrecio
        isOpen={modalPrecioOpen}
        onClose={() => { setModalPrecioOpen(false); setSelectedPart(null); }}
        onConfirm={handlePrecioConfirm}
        part={selectedPart}
      />
      <ModalAcerca
        isOpen={modalAcercaOpen}
        onClose={() => setModalAcercaOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
