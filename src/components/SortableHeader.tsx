import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

interface SortableHeaderProps {
  title: string;
  field: string;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export const SortableHeader = ({
  title,
  field,
  currentSortBy,
  currentSortOrder,
  onSort,
}: SortableHeaderProps) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
      <span>{title}</span>
      {currentSortBy === field ? (
        currentSortOrder === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};
