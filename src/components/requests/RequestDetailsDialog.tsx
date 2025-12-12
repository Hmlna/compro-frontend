import type { RequestFormSchema } from "@/schema/requestFormSchema";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function RequestDetailsDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: RequestFormSchema | null;
}) {
  const entries = data ? Object.entries(data) : [];

  const renderValue = (v: unknown) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Request details</AlertDialogTitle>
          <AlertDialogDescription>
            Full preview of the submitted request
          </AlertDialogDescription>
        </AlertDialogHeader>

        {entries.length > 0 ? (
          <div className="mt-4 max-h-[60vh] overflow-auto space-y-4 px-1">
            {entries.map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-muted-foreground capitalize">
                  {k.replace(/([A-Z])/g, " $1")}
                </div>
                <pre className="text-sm whitespace-pre-wrap wrap-break-word bg-muted/30 rounded-md p-2">
                  {renderValue(v)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-4">No data</div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
