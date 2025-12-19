import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export const StatsGrid = ({ stats }: { stats: StatItem[] }) => {
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1 md:grid-cols-1 lg:max-w-md mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    if (count === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 md:grid-cols-3 lg:grid-cols-5";
  };

  return (
    <div className={`grid gap-4 ${getGridClass(stats.length)}`}>
      {stats.map((stat, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card text-card-foreground shadow-sm p-4"
        >
          <div className="flex flex-row items-center gap-4">
            <div>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <span className="text-xl font-bold leading-none tracking-tight">
                {stat.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
