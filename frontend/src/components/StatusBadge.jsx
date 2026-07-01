function StatusBadge({ status }) {
  const greenStatuses = [
    "Terminée",
    "Payée",
    "Disponible",
    "Actif",
    "Validée",
    "En cours",
  ];

  const redStatuses = [
    "Annulée",
    "Supprimée",
    "Désactivé",
    "Terminé",
    "Rupture",
  ];

  const isGreen = greenStatuses.includes(status);
  const isRed = redStatuses.includes(status);

  return (
    <span
      className={`status-badge ${isGreen ? "status-green" : ""} ${
        isRed ? "status-red" : ""
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;