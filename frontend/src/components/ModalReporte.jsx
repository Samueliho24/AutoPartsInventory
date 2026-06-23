import { useState } from 'react';
import { X, FileText, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import styles from './ModalReporte.module.scss';

const OPTIONS = [
  {
    value: 'all',
    label: 'Reporte Completo',
    desc: 'Todos los movimientos de entrada y salida',
    icon: FileText,
    color: '#3b82f6',
  },
  {
    value: 'IN',
    label: 'Solo Cargas',
    desc: 'Unicamente movimientos de entrada (IN)',
    icon: ArrowDownToLine,
    color: '#10b981',
  },
  {
    value: 'OUT',
    label: 'Solo Descargas',
    desc: 'Unicamente movimientos de salida (OUT)',
    icon: ArrowUpFromLine,
    color: '#ef4444',
  },
];

function ModalReporte({ isOpen, onClose, onGenerar }) {
  const [selected, setSelected] = useState('all');

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleGenerar = () => {
    onGenerar(selected);
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
                      borderColor: isSelected ? opt.color : '#2d3a50',
                      backgroundColor: isSelected ? opt.color : 'transparent',
                    }}
                  >
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </button>
              );
            })}
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
