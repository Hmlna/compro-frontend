import {
  ArrowLeft,
  User,
  Building2,
  Clock,
  Briefcase,
  AlertTriangle,
  Paperclip,
  Loader2,
  Info,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { AssignDevDialog } from "@/components/dialog/AssignDevDialog";
import { MarkCompleteDialog } from "@/components/dialog/MarkCompleteDialog";
import { ApproveRequestDialog } from "@/components/dialog/ApproveRequestDialog";
import { DeleteRequestDialog } from "@/components/dialog/DeleteRequestDialog";

import {
  useRequestDetailLogic,
  MIN_NOTE_LENGTH,
} from "@/hooks/useRequestDetailLogic";
import {
  InfoField,
  TextBlock,
  AttachmentItem,
  OfficialDocBanner,
} from "@/components/requests/RequestDetailComponents";

const formatDateOnly = (dateString?: string | null) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
const formatDateTime = (dateString?: string | null) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export default function RequestDetailPage() {
  const {
    id,
    handleBack,
    navigate,
    displayData,
    progressData,
    isQueryLoading,
    isSyncing,
    reason,
    setReason,
    showReasonInput,
    pendingAction,
    resetState,
    dialogs,
    permissions,
    validation,
    revisionInfo,
    computed,
    mutations,
    handleActionClick,
    submitReason,
  } = useRequestDetailLogic();

  if (isQueryLoading || !displayData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground animate-pulse">
          Loading request details...
        </p>
      </div>
    );
  }

  const fd = displayData.formData!;
  const isSubmitting = mutations.approvalMutation.isPending;
  const showFooter =
    permissions.canApprove ||
    permissions.canEdit ||
    permissions.canAssignDev ||
    permissions.canComplete;

  const handleConfirmApprove = () => {
    mutations.approvalMutation.mutate({
      action: "approve",
      reasonText: reason,
      role: permissions.isManager ? "manager" : "vp",
    });
    dialogs.setIsApproveDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    mutations.deleteMutation.mutate(displayData.id);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* --- HEADER --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-white"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {fd.title || "Untitled Request"}
                {(isSyncing || isSubmitting) && (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin text-muted-foreground inline" />
                )}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {displayData.id}
                </span>
                <span>Created on {formatDateOnly(displayData.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT COLUMN: DETAILS */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Revision/Rejection Banners */}
              {computed.latestRevisionNote && (
                <div
                  className={`col-span-full mb-4 p-4 rounded-lg border flex gap-3 ${
                    displayData.status.includes("REJECTED")
                      ? "bg-red-50 border-red-200 text-red-900"
                      : "bg-orange-50 border-orange-200 text-orange-900"
                  }`}
                >
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1">
                      {displayData.status.includes("REJECTED")
                        ? "Rejection Reason"
                        : "Revision Requested"}
                    </h4>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                      {computed.latestRevisionNote}
                    </p>
                  </div>
                </div>
              )}

              {permissions.isBusinessUser && computed.pdfApproval && (
                <OfficialDocBanner
                  doc={computed.pdfApproval}
                  requestId={displayData.id}
                  variant="user"
                />
              )}
              {permissions.isITUser && computed.pdfForm && (
                <OfficialDocBanner
                  doc={computed.pdfForm}
                  requestId={displayData.id}
                  variant="dev"
                />
              )}

              {permissions.isBusinessUser &&
                !computed.pdfApproval &&
                displayData.status === "APPROVED" && (
                  <div className="col-span-full mb-6 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center gap-3 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">
                      Request approved. Generating official document...
                    </span>
                  </div>
                )}

              {/* Data Fields */}
              <div className="col-span-full pb-2 border-b mb-2">
                <h3 className="font-semibold text-gray-900">Key Information</h3>
              </div>
              <InfoField label="Requester" value={fd.requester1} icon={User} />
              <InfoField label="Manager" value={fd.requester2} icon={User} />
              <InfoField
                label="Unit"
                value={fd.businessArea}
                icon={Building2}
              />
              <InfoField
                label="Target Date"
                value={formatDateOnly(fd.targetDate)}
                icon={Clock}
              />

              <div className="col-span-full pb-2 border-b mt-4 mb-2">
                <h3 className="font-semibold text-gray-900">Classification</h3>
              </div>
              <InfoField
                label="Services Needed"
                value={fd.servicesNeeded}
                icon={Briefcase}
              />
              <InfoField
                label="Impact Category"
                value={fd.categoryImpact}
                icon={AlertTriangle}
              />

              <div className="col-span-full pb-2 border-b mt-4 mb-2">
                <h3 className="font-semibold text-gray-900">Request Details</h3>
              </div>
              {fd.impactDescription && (
                <TextBlock
                  label="Impact Description"
                  value={fd.impactDescription}
                />
              )}
              <TextBlock label="Background" value={fd.background} />
              <TextBlock label="Objective" value={fd.objective} />
              {fd.serviceExplanation && (
                <TextBlock
                  label="Service Explanation"
                  value={fd.serviceExplanation}
                />
              )}

              {/* Attachments */}
              <div className="col-span-full pb-2 border-b mt-6 mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> User Attachments
                </h3>
              </div>
              {computed.userAttachments.length > 0 ? (
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {computed.userAttachments.map((doc) => (
                    <AttachmentItem
                      key={doc.id}
                      doc={doc}
                      requestId={displayData.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full mt-2 text-sm text-gray-400 italic">
                  No supporting files attached.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: TIMELINE */}
          <div className="lg:w-[360px] bg-gray-50/50 border-t lg:border-t-0 lg:border-l p-6 lg:p-8 shrink-0">
            <h3 className="font-semibold mb-6 text-sm text-gray-900 uppercase tracking-wider">
              Tracking Progress
            </h3>
            {progressData?.steps ? (
              <div className="relative space-y-0 ml-2">
                <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-200" />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {progressData.steps.map((step: any, index: number) => (
                  <div
                    key={step.step}
                    className={`relative flex gap-4 pb-8 ${
                      index === progressData.steps.length - 1 ? "pb-0" : ""
                    }`}
                  >
                    <div
                      className={`z-10 relative flex items-center justify-center ${
                        step.status === "completed"
                          ? "text-green-600"
                          : step.status === "current"
                          ? "text-blue-600 animate-pulse"
                          : "text-gray-300"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 bg-white" />
                      ) : step.status === "current" ? (
                        <Loader2 className="w-6 h-6 bg-white" />
                      ) : (
                        <Circle className="w-6 h-6 bg-white" />
                      )}
                    </div>
                    <div className="flex flex-col pt-0.5">
                      <span className="text-sm font-semibold text-gray-800">
                        {step.name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize mt-0.5">
                        {step.status}
                      </span>
                      {step.timestamp && (
                        <span className="text-[10px] text-gray-400 mt-1">
                          {formatDateTime(step.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                No tracking info
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FOOTER & ACTIONS --- */}
      {showFooter && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            {/* REASON INPUT (For Reject/Revision) */}
            {permissions.canApprove && showReasonInput && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 animate-in slide-in-from-bottom-5">
                <p className="text-sm font-medium mb-2 text-gray-800">
                  Reason for {pendingAction}:
                </p>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isSubmitting}
                  placeholder={`Explain... (min ${MIN_NOTE_LENGTH} chars)`}
                  className={`bg-white ${
                    reason.length > 0
                      ? !validation.isLengthValid
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }`}
                />
                <div className="flex justify-between items-end mt-2">
                  <span
                    className={`text-xs ${
                      validation.isLengthValid
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {validation.isLengthValid
                      ? "Requirement met."
                      : `${validation.remainingChars} more chars needed.`}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetState}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={submitReason}
                      disabled={!validation.isLengthValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            {!showReasonInput && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3 w-full">
                <div className="order-last sm:order-0">
                  {permissions.canDelete && (
                    <DeleteRequestDialog
                      requestTitle={fd.title}
                      isDeleting={
                        mutations.deleteMutation.isPending || isSubmitting
                      }
                      onConfirm={handleConfirmDelete}
                    >
                      <Button
                        variant="destructive"
                        disabled={
                          mutations.deleteMutation.isPending || isSubmitting
                        }
                        className="w-full sm:w-auto gap-2"
                      >
                        {mutations.deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete Draft"
                        )}
                      </Button>
                    </DeleteRequestDialog>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {permissions.canEdit && (
                    <Button
                      variant="default"
                      disabled={isSubmitting}
                      onClick={() =>
                        navigate(`/requests/edit/${displayData.id}`)
                      }
                      className="gap-2 w-full sm:w-auto"
                    >
                      {displayData?.status === "DRAFT"
                        ? "Edit & Submit"
                        : "Revise & Resubmit"}
                    </Button>
                  )}
                  {permissions.canApprove && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => handleActionClick("reject")}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        Reject
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-block w-full sm:w-auto">
                              <Button
                                variant="outline"
                                onClick={() => handleActionClick("revision")}
                                disabled={
                                  isSubmitting ||
                                  permissions.isRevisionLimitReached
                                }
                                className={`w-full ${
                                  permissions.isRevisionLimitReached
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                Request Revision
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({revisionInfo.currentRevisionCount}/
                                  {revisionInfo.maxRevisions})
                                </span>
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {permissions.isRevisionLimitReached && (
                            <TooltipContent>
                              <p>Revision limit reached.</p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      <Button
                        variant="default"
                        className="w-full sm:w-auto"
                        onClick={() => handleActionClick("approve")}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}{" "}
                        Approve
                      </Button>
                    </>
                  )}
                  {permissions.canAssignDev && (
                    <Button
                      variant="default"
                      onClick={() => dialogs.setIsAssignModalOpen(true)}
                      className="w-full sm:w-auto gap-2"
                    >
                      Assign Developers
                    </Button>
                  )}
                  {permissions.canComplete && (
                    <Button
                      variant="default"
                      onClick={() => dialogs.setIsCompleteDialogOpen(true)}
                      disabled={mutations.completeMutation.isPending}
                      className="w-full sm:w-auto gap-2 text-white"
                    >
                      {mutations.completeMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- EXTERNAL DIALOGS --- */}
      <ApproveRequestDialog
        open={dialogs.isApproveDialogOpen}
        onOpenChange={dialogs.setIsApproveDialogOpen}
        reason={reason}
        setReason={setReason}
        onConfirm={handleConfirmApprove}
        isSubmitting={isSubmitting}
      />

      <AssignDevDialog
        open={dialogs.isAssignModalOpen}
        onOpenChange={dialogs.setIsAssignModalOpen}
        requestId={id!}
        onSuccess={handleBack}
      />

      <MarkCompleteDialog
        open={dialogs.isCompleteDialogOpen}
        onOpenChange={dialogs.setIsCompleteDialogOpen}
        requestId={id!}
        onSuccess={handleBack}
      />
    </div>
  );
}
