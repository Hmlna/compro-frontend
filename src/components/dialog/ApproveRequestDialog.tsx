import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApproveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  setReason: (value: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export const ApproveRequestDialog = ({
  open,
  onOpenChange,
  reason,
  setReason,
  onConfirm,
  isSubmitting,
}: ApproveRequestDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this request?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-3">
            <label
              htmlFor="approve-notes"
              className="text-sm font-medium leading-non"
            >
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (Optional)
              </span>
            </label>
            <Textarea
              id="approve-notes"
              placeholder="Approved. Please proceed."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 h-15"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
