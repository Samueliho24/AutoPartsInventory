import { useState } from 'react';
import { X, FileText, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import styles from './ModalReporte.module.scss';

const OPTIONS = [
  {
    value: 'all',
    label: 'Reporte Completo',
    desc: 'Todos los movimientos de entrada y salida',
    icon: FileText,
    color: '#5b8def',
  },
  {
    value: 'IN',
    label: 'Solo Cargas',
    desc: 'Unicamente movimientos de entrada (IN)',
    icon: ArrowDownToLine,
    color: '#34c759',
  },
  {
    value: 'OUT',
    label: 'Solo Descargas',
    desc: 'Unicamente movimientos de salida (OUT)',
    icon: ArrowUpFromLine,
    color: '#ff6b6b',
  },
];

function toDateInput(d) {
  return d.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const r = new Date(date);
  r.setDate(r.getDate() + days);
  return r;
}

function ModalReporte({ isOpen, onClose, onGenerar }) {
  const [selected, setSelected] = useState('all');
  const today = new Date();

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rangeMode, setRangeMode] = useState('all'); // 'all' | 'week' | 'month' | 'year' | 'custom'

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleQuickRange = (mode) => {
    setRangeMode(mode);
    if (mode === 'all') {
      setDateFrom('');
      setDateTo('');
    } else if (mode === 'week') {
      setDateFrom(toDateInput(addDays(today, -7)));
      setDateTo(toDateInput(today));
    } else if (mode === 'month') {
      setDateFrom(toDateInput(addDays(today, -30)));
      setDateTo(toDateInput(today));
    } else if (mode === 'year') {
      setDateFrom(toDateInput(addDays(today, -365)));
      setDateTo(toDateInput(today));
    }
  };

  const handleCustomFrom = (val) => {
    setDateFrom(val);
    setRangeMode('custom');
  };

  const handleCustomTo = (val) => {
    setDateTo(val);
    setRangeMode('custom');
  };

  const handleGenerar = () => {
    const f = dateFrom || null;
    const t = dateTo || null;
    onGenerar(selected, f, t);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Generar Reporte</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.accentLine} />

        <div className={styles.modalBody}>
          <p className={styles.hint}>
            Selecciona el tipo de reporte que deseas generar:
          </p>

          <div className={styles.options}>
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                  style={{
                    '--accent-color': opt.color,
                    ...(isSelected ? { borderColor: opt.color } : {}),
                  }}
                  onClick={() => setSelected(opt.value)}
                  type="button"
                >
                  <div className={styles.optionIcon} style={{ color: opt.color }}>
                    <Icon size={28} />
                  </div>
                  <div className={styles.optionInfo}>
                    <span className={styles.optionLabel}>{opt.label}</span>
                    <span className={styles.optionDesc}>{opt.desc}</span>
                  </div>
                  <div
                    className={styles.radio}
                    style={{
                      borderColor: isSelected ? opt.color : '#e2e8f0',
                      backgroundColor: isSelected ? opt.color : 'transparent',
                    }}
                  >
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className={styles.divider} />

          <div className={styles.dateSection}>
            <p className={styles.hint}>Filtrar por rango de fechas (opcional):</p>

            <div className={styles.quickBtns}>
              {[
                { label: 'Todo', value: 'all' },
                { label: 'Última Semana', value: 'week' },
                { label: 'Último Mes', value: 'month' },
                { label: 'Último Año', value: 'year' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  type="button"
                  className={`${styles.quickBtn} ${rangeMode === btn.value ? styles.quickBtnActive : ''}`}
                  onClick={() => handleQuickRange(btn.value)}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className={styles.dateInputs}>
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>Desde</label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dateFrom}
                  onChange={(e) => handleCustomFrom(e.target.value)}
                />
              </div>
              <div className={styles.dateField}>
                <label className={styles.dateLabel}>Hasta</label>
                <input
                  type="date"
                  className={styles.dateInput}
                  value={dateTo}
                  onChange={(e) => handleCustomTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnGenerate} onClick={handleGenerar}>
            <FileText size={16} />
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalReporte;
