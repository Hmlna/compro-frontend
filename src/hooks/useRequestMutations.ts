/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRequest } from "@/api/requests/deleteRequests";
import { processApproval, markAsComplete } from "@/api/approval";
import { downloadDocument } from "@/api/requests/downloadDocument";

// --- DELETE ---
export const useDeleteRequest = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      toast.success("Request deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete request");
    },
  });
};

// --- APPROVE / REJECT / REVISE ---
export const useProcessApproval = (
  requestId: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      reasonText,
      role,
    }: {
      action: "approve" | "reject" | "revision";
      reasonText?: string;
      role: "manager" | "vp";
    }) => {
      await processApproval(requestId, role, action, reasonText);
      return action;
    },
    onMutate: () => {
      const toastId = toast.loading("Processing your request...");
      return { toastId };
    },
    onSuccess: (action, _, context) => {
      const actionLabel =
        action === "approve"
          ? "approved"
          : action === "reject"
          ? "rejected"
          : "returned for revision";

      toast.success(`Request ${actionLabel} successfully`, {
        id: context?.toastId,
      });

      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["request-detail", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any, _, context) => {
      toast.error(err?.response?.data?.message || "Action failed", {
        id: context?.toastId,
      });
    },
  });
};

// --- MARK COMPLETE ---
export const useMarkComplete = (
  requestId: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
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
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: any, _, context) => {
      toast.error(err?.message || "Failed to complete request", {
        id: context?.toastId,
      });
    },
  });
};

// --- DOWNLOAD ---
export const useDownloadDocument = (requestId: string) => {
  return useMutation({
    mutationFn: async (documentId: string) => {
      return await downloadDocument(requestId, documentId);
    },
    onSuccess: (response) => {
      if (response && response.downloadUrl) {
        window.open(response.downloadUrl, "_blank");
      } else {
        toast.error("Download link not found in server response.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to retrieve download link.");
    },
  });
};
