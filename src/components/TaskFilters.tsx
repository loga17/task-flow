"use client";

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    aFaire: number;
    enCours: number;
    terminee: number;
    mine: number;
  };
}

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  counts,
}: TaskFiltersProps) {
  const filters = [
    { key: "ALL", label: "Tous", count: counts.all },
    { key: "A_FAIRE", label: "À faire", count: counts.aFaire },
    { key: "EN_COURS", label: "En cours", count: counts.enCours },
    { key: "TERMINEE", label: "Finis", count: counts.terminee },
    { key: "MINE", label: "Vos tâches", count: counts.mine },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`btn btn-sm ${
            activeFilter === filter.key ? "btn-primary" : "btn-ghost bg-base-200"
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
}