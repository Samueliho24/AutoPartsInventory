import { useState, useEffect } from 'react';
import { X, Mail, User, Info } from 'lucide-react';
import { getAppInfo } from '../services/api';
import styles from './ModalAcerca.module.scss';

function ModalAcerca({ isOpen, onClose }) {
  const [appInfo, setAppInfo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getAppInfo().then(setAppInfo);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Acerca de</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.accentLine} />

        <div className={styles.modalBody}>
          <div className={styles.logoSection}>
            <div className={styles.logoCircle}>
              <img src="./logo.svg" alt="AutoPartsInventory" width="36" height="36" />
            </div>
            <h3 className={styles.appName}>
              {appInfo?.name || 'AutoPartsInventory'}
            </h3>
            {appInfo?.version && (
              <span className={styles.version}>v{appInfo.version}</span>
            )}
          </div>

          {appInfo?.description && (
            <p className={styles.description}>{appInfo.description}</p>
          )}

          <div className={styles.divider} />

          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <User size={16} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Desarrollador</span>
                <span className={styles.infoValue}>
                  {appInfo?.developer || 'Samuel Chourio'}
                </span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <Mail size={16} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Contacto</span>
                <a
                  href={`mailto:${appInfo?.email || 'chourio.samuel.24@gmail.com'}`}
                  className={styles.emailLink}
                >
                  {appInfo?.email || 'chourio.samuel.24@gmail.com'}
                </a>
              </div>
            </div>
            <div className={styles.infoRow}>
              <Info size={16} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Tecnologías</span>
                <span className={styles.infoValue}>
                  Python · React · PyWebView · SQLite
                </span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <Info size={16} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Licencia</span>
                <span className={styles.infoValue}>
                  MIT License — ver LICENSE
                </span>
              </div>
            </div>
            <div className={styles.infoRow}>
              <Info size={16} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Copyright</span>
                <span className={styles.infoValue}>
                  © {new Date().getFullYear()} Samuel Chourio
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnClose} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalAcerca;
