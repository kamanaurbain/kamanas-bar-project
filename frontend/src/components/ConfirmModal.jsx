import { Trash2, X } from "lucide-react";
import "../styles/invoices.css";

function ConfirmModal({
  title = "Supprimer ?",
  message = "Cette action est irréversible.",
  itemName = "",
  warning = "Cette suppression est simulée côté frontend.",
  onCancel,
  onConfirm,
}) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">
          <Trash2 size={28} />
        </div>

        <button type="button" className="confirm-close" onClick={onCancel}>
          <X size={16} />
        </button>

        <h2>{title}</h2>
        <p>{message}</p>

        {itemName && <div className="confirm-item-name">{itemName}</div>}

        <div className="confirm-warning">{warning}</div>

        <div className="confirm-actions">
          <button type="button" className="confirm-cancel" onClick={onCancel}>
            Annuler
          </button>

          <button type="button" className="confirm-delete" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;