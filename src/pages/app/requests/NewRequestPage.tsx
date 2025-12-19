import { Form } from "@/components/ui/form";
import { RequestBasicInfo } from "@/components/requests/RequestBasicInfo";
import { RequestDetailedInfo } from "@/components/requests/RequestDetailedInfo";
import { RequestPreviewDialog } from "@/components/dialog/RequestPreviewDialog";
import { useRequestForm } from "@/hooks/useRequestForm";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import type { requestFormSchema } from "@/schema/requestFormSchema";
import type z from "zod";
import { Button } from "@/components/ui/button";
import { createRequest } from "@/api/requests/createRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateRequestPayload } from "@/types/request";
import { toast } from "sonner";
import { getRequestById } from "@/api/requests/getRequests";
import { updateRequest } from "@/api/requests/updateRequests";
import { submitRequest } from "@/api/requests/submitRequests";
import { uploadDocument } from "@/api/requests/uploadDocument";
import { deleteDocument } from "@/api/requests/deleteDocument";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { resubmitRequest } from "@/api/requests/resubmitRequests";

const NewRequestPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [actionType, setActionType] = useState<"save" | "submit">("save");

  const { id: urlId } = useParams();
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);
  const currentId = urlId || createdRequestId;
  const isEditMode = !!currentId;

  const [uploadError, setUploadError] = useState(false);

  const form = useRequestForm(isEditMode);
  const { handleSubmit, control, clearDraft, reset } = form;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = useState(false);

  type RequestFormValues = z.infer<typeof requestFormSchema>;
  const [formPreview, setFormPreview] = useState<RequestFormValues>(
    {} as RequestFormValues
  );
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const { data: existingRequest, isLoading: isLoadingRequest } = useQuery({
    queryKey: ["request", currentId],
    queryFn: () => getRequestById(currentId!),
    enabled: isEditMode,
  });

  const isResubmitMode = existingRequest?.status?.includes("REVISION");
  useEffect(() => {
    if (existingRequest && existingRequest.formData) {
      reset({
        ...existingRequest.formData,
      });
    }
  }, [existingRequest, reset]);

  const deleteDocMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(currentId!, documentId),
    onSuccess: () => {
      toast.success("Document removed successfully");
      queryClient.invalidateQueries({ queryKey: ["request", currentId] });
    },
    onError: (error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });

  const createMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      console.log("Request created successfully!");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CreateRequestPayload) =>
      updateRequest(currentId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", currentId] });
      queryClient.invalidateQueries({ queryKey: ["request-detail"] });
      console.log("Request updated successfully!");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (requestId: string) => submitRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", currentId] });
      queryClient.invalidateQueries({ queryKey: ["request-detail"] });
      console.log("Request submitted for approval!");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const resubmitMutation = useMutation({
    mutationFn: (requestId: string) => resubmitRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request", currentId] });
      console.log("Request resubmitted successfully!");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleSaveOrSubmit = async (values: RequestFormValues) => {
    const payload: CreateRequestPayload = { formData: { ...values } };
    let activeId = currentId || createdRequestId;

    try {
      setIsUploading(true);

      if (activeId) {
        await updateMutation.mutateAsync(payload);
      } else {
        const newRequest = await createMutation.mutateAsync(payload);
        activeId = newRequest.data.id;
        setCreatedRequestId(activeId);
        window.history.replaceState(null, "", `/requests/edit/${activeId}`);
      }

      if (selectedFiles.length > 0 && activeId) {
        const uploadPromise = Promise.all(
          selectedFiles.map((file) => uploadDocument(activeId!, file))
        );

        toast.promise(uploadPromise, {
          loading: `Uploading ${selectedFiles.length} file(s)...`,
          success: "Files uploaded successfully!",
          error: "Failed to upload files.",
        });

        try {
          await uploadPromise;
          setSelectedFiles([]);
          queryClient.invalidateQueries({ queryKey: ["request", activeId] });
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          setUploadError(true);
          return;
        }
      }

      // Submit or resubmit
      if (actionType === "submit" && activeId) {
        try {
          if (isResubmitMode) {
            await resubmitMutation.mutateAsync(activeId);
            toast.success("Request revised and resubmitted successfully!");
          } else {
            await submitMutation.mutateAsync(activeId);
            toast.success("Request submitted successfully!");
          }
        } catch (error) {
          console.error("Submission failed", error);
          toast.error("Submission failed. Please try again.");
          return;
        }
      } else {
        toast.success("Request saved!");
      }

      navigate("/requests");
      clearDraft();
    } catch (error) {
      console.error("General Process failed", error);
      if (!currentId && activeId) {
        toast.warning("Draft saved, but the process was interrupted.");
        navigate(`/requests/edit/${activeId}`);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setConfirmOpen(false);
    }
  };

  const onSubmit = handleSubmit((values) => {
    setFormPreview(values);
    if (actionType === "save") {
      handleSaveOrSubmit(values);
    } else {
      setConfirmOpen(true);
    }
  });

  const handleDialogConfirm = async () => {
    if (!formPreview) return;
    await handleSaveOrSubmit(formPreview);
  };

  if (isEditMode && isLoadingRequest) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading request details...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w space-y-6">
      <div className="flex items-center gap-4">
        {isEditMode && (
          <Button
            variant="outline"
            size="icon"
            className="bg-white"
            onClick={() => {
              navigate("/requests");
              clearDraft();
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode
              ? isResubmitMode
                ? "Resubmit Change Request"
                : "Edit Change Request"
              : "Create Change Request"}
          </h1>
          {/* {isEditMode && (
            <p className="text-muted-foreground mt-1">
              Editing Request ID: {currentId}
            </p>
          )} */}
          {isEditMode && (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">ID: {currentId}</p>
              {isResubmitMode && (
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium border border-orange-200">
                  Revision Required
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <RequestBasicInfo control={control} />

          <RequestDetailedInfo
            control={control}
            // Local Files (New uploads)
            onFilesChange={setSelectedFiles}
            filePreviews={selectedFiles}
            // Existing Files (From Server)
            existingFiles={existingRequest?.documents || []}
            // Delete Logic
            onRemoveExistingFile={(docId) => deleteDocMutation.mutate(docId)}
            isDeleting={deleteDocMutation.isPending}
            requestId={currentId}
          />

          {uploadError && (
            <div className="mb-4 flex gap-3 rounded-md bg-red-50 p-4 border border-red-200 text-red-900">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">
                  Request saved but files failed to upload.
                </p>
                <p className="mt-1 text-red-800">
                  Your draft has been created. You can retry via "Save Changes"
                  or submit.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto hover:bg-gray-200"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                submitMutation.isPending ||
                isUploading
              }
              onClick={() => setActionType("save")}
            >
              {isEditMode ? "Save changes" : "Create draft"}
            </Button>

            <Button
              type="button"
              variant="default"
              className=" w-full sm:w-auto"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                submitMutation.isPending ||
                resubmitMutation.isPending ||
                isUploading
              }
              onClick={() => {
                form.handleSubmit((values) => {
                  setFormPreview(values);
                  setActionType("submit");
                  setConfirmOpen(true);
                })();
              }}
            >
              {isResubmitMode ? "Resubmit for approval" : "Submit for approval"}
            </Button>
          </div>
        </form>
      </Form>

      <RequestPreviewDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        data={formPreview ?? undefined}
        basicOnly={true}
        onConfirm={handleDialogConfirm}
        confirmDisabled={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default NewRequestPage;
