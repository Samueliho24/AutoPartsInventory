import { useState, useEffect, useMemo, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import styles from './ModalDescarga.module.scss';

function ModalDescarga({ isOpen, onClose, onConfirm, parts, initialPart }) {
  const [partNumber, setPartNumber] = useState(initialPart?.part_number ?? '');
  const [quantity, setQuantity] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!partNumber.trim()) return [];
    const q = partNumber.toLowerCase();
    return parts.filter(
      (p) =>
        p.part_number.toLowerCase().includes(q) &&
        p.part_number.toLowerCase() !== q,
    );
  }, [partNumber, parts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const selectedPart = parts.find(
    (p) => p.part_number.toLowerCase() === partNumber.toLowerCase(),
  );
  const stockDisponible = selectedPart ? selectedPart.stock : 0;
  const qty = parseInt(quantity, 10);
  const excedeStock = qty > stockDisponible;
  const isValid = partNumber.trim() && qty >= 1 && selectedPart && !excedeStock;

  const handleSelectSuggestion = (pn) => {
    setPartNumber(pn);
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    if (!isValid || !selectedPart) return;
    onConfirm(partNumber.trim(), qty);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSuggestions(false);
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Registrar Salida de Inventario</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.accentLine} />

        <div className={styles.modalBody}>
          <div className={styles.formGroup} ref={wrapperRef}>
            <label className={styles.label}>Número de Parte</label>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Buscar o escribir número de parte..."
              value={partNumber}
              onChange={(e) => {
                setPartNumber(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    className={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(p.part_number)}
                  >
                    <span className={styles.suggPart}>{p.part_number}</span>
                    <span className={styles.suggStock}>Stock: {p.stock}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Cantidad a Retirar</label>
            <input
              type="number"
              className={`${styles.input} ${excedeStock && qty > 0 ? styles.inputError : ''}`}
              placeholder="1"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {selectedPart && (
            <div className={styles.partInfo}>
              <strong>{selectedPart.part_number}</strong> — {selectedPart.description}
              <br />
              <span className={styles.stockLabel}>
                Stock disponible: <strong>{stockDisponible}</strong>
              </span>
            </div>
          )}

          {excedeStock && qty > 0 && (
            <div className={styles.alert}>
              <AlertTriangle size={16} />
              <span>
                Error: La cantidad ingresada supera las existencias en el inventario
              </span>
            </div>
          )}
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
            Confirmar Descarga
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDescarga;
