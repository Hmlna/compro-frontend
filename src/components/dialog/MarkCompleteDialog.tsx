/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsComplete } from "@/api/approval";
import { toast } from "sonner";

interface MarkCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  onSuccess?: () => void;
}

export function MarkCompleteDialog({
  open,
  onOpenChange,
  requestId,
  onSuccess,
}: MarkCompleteDialogProps) {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: () => markAsComplete(requestId),
    onMutate: () => {
      const toastId = toast.loading("Marking request as complete...");
      return { toastId };
    },
    onSuccess: (_, __, context) => {
      toast.success("Request marked as completed!", { id: context?.toastId });

      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["request-detail", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err: any, _, context) => {
      toast.error(err?.message || "Failed to complete request", {
        id: context?.toastId,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark Request as Complete?</AlertDialogTitle>
          <AlertDialogDescription>
            This will finalize the request and notify the requester. Please
            ensure all development tasks are finished.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={completeMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              completeMutation.mutate();
            }}
            disabled={completeMutation.isPending}
            className=" text-white"
          >
            {completeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Completion"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
