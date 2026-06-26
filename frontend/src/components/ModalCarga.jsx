import { useState, useEffect, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './ModalCarga.module.scss';

function ModalCarga({ isOpen, onClose, onConfirm, initialPart, parts }) {
  const [partNumber, setPartNumber] = useState(initialPart?.part_number ?? '');
  const [location, setLocation] = useState(initialPart?.location ?? '');
  const [description, setDescription] = useState(initialPart?.description ?? '');
  const [quantity, setQuantity] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(initialPart?.purchase_cost?.toString() ?? '');
  const [salePrice, setSalePrice] = useState(initialPart?.sale_price?.toString() ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const suggestions = useMemo(() => {
    if (!partNumber.trim()) return [];
    const q = partNumber.toLowerCase();
    return (parts || []).filter(
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

  const handleSelectSuggestion = (pn) => {
    const p = parts.find((x) => x.part_number === pn);
    if (p) {
      setPartNumber(p.part_number);
      setLocation(p.location);
      setDescription(p.description);
      setPurchaseCost(p.purchase_cost?.toString() ?? '');
      setSalePrice(p.sale_price?.toString() ?? '');
    }
    setShowSuggestions(false);
  };

  const handleConfirm = () => {
    if (!partNumber.trim() || !quantity || parseInt(quantity, 10) < 1) return;
    const cost = purchaseCost.trim() ? parseFloat(purchaseCost) : undefined;
    const sale = salePrice.trim() ? parseFloat(salePrice) : undefined;
    onConfirm(partNumber.trim(), location.trim(), description.trim(), parseInt(quantity, 10), cost, sale);
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
          <div className={styles.formGroup} ref={wrapperRef}>
            <label className={styles.label}>Número de Parte</label>
            <input
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
                    type="button"
                  >
                    <div className={styles.suggestionInfo}>
                      <span className={styles.suggPart}>{p.part_number}</span>
                      <span className={styles.suggDesc}>{p.description}</span>
                    </div>
                    <span className={styles.suggStock}>Stock: {p.stock}</span>
                  </button>
                ))}
              </div>
            )}
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Costo de Compra (opcional)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Precio de Venta (opcional)</label>
              <input
                type="number"
                className={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </div>
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
