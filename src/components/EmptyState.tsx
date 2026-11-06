import Link from "next/link";
import Image from "next/image";

/**
 * Composant d'état vide pour les listes sans contenu.
 */
interface EmptyStateProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  imageSrc,
  title,
  subtitle,
  actionLabel,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Illustration */}
      <Image
        src={imageSrc}
        alt={title}
        width={200}
        height={200}
        className="mb-6 opacity-80"
      />

      {/* Titre */}
      <h3 className="text-xl font-semibold text-base-content mb-2">{title}</h3>

      {/* Sous-titre */}
      <p className="text-base-content/70 max-w-md mb-6">{subtitle}</p>

      {/* Bouton d'action */}
      {actionLabel && (
        <>
          {actionHref ? (
            <Link href={actionHref} className="btn btn-primary">
              {actionLabel}
            </Link>
          ) : (
            <button onClick={onActionClick} className="btn btn-primary">
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}