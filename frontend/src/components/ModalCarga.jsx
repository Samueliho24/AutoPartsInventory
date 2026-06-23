import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './ModalCarga.module.scss';

function ModalCarga({ isOpen, onClose, onConfirm, initialPart }) {
  const [partNumber, setPartNumber] = useState(initialPart?.part_number ?? '');
  const [location, setLocation] = useState(initialPart?.location ?? '');
  const [description, setDescription] = useState(initialPart?.description ?? '');
  const [quantity, setQuantity] = useState('');
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!partNumber.trim() || !quantity || parseInt(quantity, 10) < 1) return;
    onConfirm(partNumber.trim(), location.trim(), description.trim(), parseInt(quantity, 10));
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isValid = partNumber.trim() && parseInt(quantity, 10) >= 1;

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Registrar Entrada de Inventario</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.accentLine} />

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Número de Parte</label>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Ej. BRAKE-PAD-001"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ubicación</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ej. Estante A3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad a Cargar</label>
              <input
                type="number"
                className={styles.input}
                placeholder="1"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.textarea}
              placeholder="Descripción del producto (opcional)"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.btnConfirm}
            onClick={handleConfirm}
            disabled={!isValid}
          >
            Confirmar Carga
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCarga;
