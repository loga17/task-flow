/**
 * Barre de progression avec label et pourcentage.
 * Utilise la couleur primaire (bleu) de manière uniforme.
 */
interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
}

export default function ProgressBar({
  label,
  value,
  total,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Label + pourcentage */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-base-content">
          {label} <span className="text-base-content/60">{value}</span>
        </span>
        <span className="text-xs text-base-content/60">{percentage}%</span>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}