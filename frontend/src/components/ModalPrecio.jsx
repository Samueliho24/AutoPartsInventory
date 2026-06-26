import { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import styles from './ModalPrecio.module.scss';

const CURRENCIES = ['Bs', 'USD'];

function ModalPrecio({ isOpen, onClose, onConfirm, part }) {
  const [salePrice, setSalePrice] = useState(part?.sale_price?.toString() ?? '');
  const [purchaseCost, setPurchaseCost] = useState(part?.purchase_cost?.toString() ?? '');
  const [currency, setCurrency] = useState(part?.currency || 'USD');

  if (!isOpen || !part) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const priceNum = parseFloat(salePrice);
  const costNum = purchaseCost.trim() ? parseFloat(purchaseCost) : undefined;
  const isValid = salePrice.trim() && priceNum >= 0;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm(part.id, priceNum, currency, costNum);
    onClose();
  };

  const currencySymbol = currency === 'Bs' ? 'Bs.' : '$';

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Precios</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.accentLine} />

        <div className={styles.modalBody}>
          <div className={styles.partBadge}>
            <strong>{part.part_number}</strong> — {part.description}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Costo de Compra</label>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencyPrefix}>{currencySymbol}</span>
              <input
                type="number"
                className={styles.priceInput}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Precio de Venta</label>
            <div className={styles.priceInputWrapper}>
              <span className={styles.currencyPrefix}>{currencySymbol}</span>
              <input
                type="number"
                className={styles.priceInput}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Moneda</label>
            <div className={styles.currencyToggle}>
              {CURRENCIES.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  className={`${styles.currencyBtn} ${currency === cur ? styles.currencyActive : ''}`}
                  onClick={() => setCurrency(cur)}
                >
                  {cur === 'Bs' ? 'Bs. Bolívares' : '$ USD'}
                </button>
              ))}
            </div>
          </div>

          {isValid && (
            <div className={styles.preview}>
              <DollarSign size={16} />
              <span>
                Venta: <strong>{currencySymbol} {priceNum.toFixed(2)}</strong>
                {costNum !== undefined && (
                  <> | Costo: <strong>{currencySymbol} {costNum.toFixed(2)}</strong></>
                )}
                {' '}{currency}
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
            Guardar Precios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPrecio;
