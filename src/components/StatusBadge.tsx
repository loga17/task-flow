/**
 * Badge coloré selon le statut d'une tâche.
 */
interface StatusBadgeProps {
  status: "A_FAIRE" | "EN_COURS" | "TERMINEE";
}

const statusConfig = {
  A_FAIRE: {
    label: "À faire",
    className: "badge-error",
  },
  EN_COURS: {
    label: "En cours",
    className: "badge-warning",
  },
  TERMINEE: {
    label: "Terminé",
    className: "badge-success",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config.className} badge-sm font-medium`}>
      {config.label}
    </span>
  );
}