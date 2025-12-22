/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { RequestFormSchema } from "@/schema/requestFormSchema";

export const RequestPreviewDialog = ({
  open,
  onOpenChange,
  data,
  onConfirm,
  basicOnly = false,
  confirmDisabled = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: RequestFormSchema;
  onConfirm: () => void;
  basicOnly?: boolean;
  confirmDisabled?: boolean;
}) => {
  const basicKeys: (keyof RequestFormSchema)[] = [
    "requester1",
    "requester2",
    "businessArea",
    "targetDate",
    "title",
  ];

  const entries = data
    ? basicOnly
      ? (basicKeys.map((k) => [k, data[k]]) as [string, any][])
      : Object.entries(data)
    : [];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit change request?</AlertDialogTitle>
          <AlertDialogDescription>
            Please review your information before submitting.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {entries.length > 0 && (
          <div className="text-sm space-y-2 mt-4">
            {entries.map(([key, value]) => (
              <div key={String(key)}>
                <strong className="capitalize">
                  {String(key)
                    .replace(/([A-Z])/g, " $1")
                    .replace(/(\d+)/g, " $1")}
                  :
                </strong>{" "}
                {value}
              </div>
            ))}
            <AlertDialogDescription>
              and detailed info...
            </AlertDialogDescription>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={confirmDisabled}>
            Continue editing
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={confirmDisabled}>
            {confirmDisabled ? "Submitting..." : "Submit request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
