/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@/components/ui/form";
import { RequestBasicInfo } from "@/components/RequestBasicInfo";
import { RequestDetailedInfo } from "@/components/RequestDetailedInfo";
import { RequestPreviewDialog } from "@/components/RequestPreviewDialog";
import { useRequestForm } from "@/hooks/useRequestForm";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { requestFormSchema } from "@/schema/requestFormSchema";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { createRequest } from "@/api/requests/createRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/hooks/useAuth"; // Import useAuth
import type { RequestRecord } from "@/types/request"; // Import new type

const NewRequestPage = () => {
  const { user } = useAuth(); // Get current user
  const form = useRequestForm();
  const { handleSubmit, control, clearDraft } = form;

  const navigate = useNavigate();

  type RequestFormValues = z.infer<typeof requestFormSchema>;
  const [formPreview, setFormPreview] = useState<RequestFormValues>(
    {} as RequestFormValues
  );

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // Update mutation to accept the full record structure (minus ID which json-server adds)
  const {
    mutateAsync: createRequestMutation,
    isPending: createRequestLoading,
  } = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const onSubmit = handleSubmit((values) => {
    setFormPreview(values);
    setConfirmOpen(true);
  });

  const handleConfirm = async () => {
    if (!user) return;

    try {
      // Construct the full payload
      const payload: Omit<RequestRecord, "id"> = {
        ...formPreview,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "pending_manager",
        createdByEmail: user.email,
        createdById: String(user.id),
        unit: user.unit,
      };

      console.log("Submitting Payload:", payload);
      await createRequestMutation(payload as any);
    } catch (error) {
      console.error("createRequest failed", error);
      return;
    }

    clearDraft();
    setConfirmOpen(false);
    navigate("/requests");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Change Request</h1>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <RequestBasicInfo control={control} />
          <RequestDetailedInfo control={control} />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/requests")} // Fixed route
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer">
              Submit Request
            </Button>
          </div>
        </form>
      </Form>

      <RequestPreviewDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        data={formPreview ?? undefined}
        basicOnly={true}
        onConfirm={handleConfirm}
        confirmDisabled={createRequestLoading}
      />
    </div>
  );
};

export default NewRequestPage;
