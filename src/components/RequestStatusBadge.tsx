import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types/request";

const STATUS_STYLES: Record<
  string,
  {
    label: string;
    className: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING_MANAGER: {
    label: "Manager Review",
    className: "bg-blue-50 text-blue-700 border border-black/5",
  },
  PENDING_VP: {
    label: "VP Review",
    className: "bg-blue-50 text-blue-700 border border-black/5",
  },
  REVISION_MANAGER: {
    label: "Revision Needed",
    className: "bg-red-50 text-red-700 border border-black/5",
  },
  REVISION_VP: {
    label: "Revision Needed",
    className: "bg-red-50 text-red-700 border border-black/5",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border border-black/5",
  },
  ASSIGNED_DEV: {
    label: "Dev Process",
    className: "bg-blue-50 text-blue-700 border border-black/5",
  },
  REJECTED_MANAGER: {
    label: "Rejected",
    className: "",
    variant: "destructive",
  },
  REJECTED_VP: { label: "Rejected", className: "", variant: "destructive" },
  COMPLETED: { label: "Completed", className: "", variant: "outline" },
  DRAFT: {
    label: "Draft",
    className: "border border-black/5",
    variant: "secondary",
  },
};

export const RequestStatusBadge = ({ status }: { status: RequestStatus }) => {
  const config = STATUS_STYLES[status];

  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <Badge className={config.className} variant={config.variant}>
      {config.label}
    </Badge>
  );
};
