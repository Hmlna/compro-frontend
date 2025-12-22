import { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useRequestDetail,
  useRequestProgress,
} from "@/hooks/useRequestQueries";
import {
  useDeleteRequest,
  useProcessApproval,
  useMarkComplete,
} from "@/hooks/useRequestMutations";

export const MIN_NOTE_LENGTH = 50;

export const useRequestDetailLogic = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "reject" | "revision" | null
  >(null);

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const {
    data: displayData,
    isLoading: isQueryLoading,
    isFetching,
  } = useRequestDetail(id);

  const { data: progressData, isLoading: isProgressLoading } =
    useRequestProgress(id);

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
      return;
    }
    if (window.history.length > 2) {
      navigate(-1);
      return;
    }
    switch (user?.role) {
      case "USER":
        navigate("/requests");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const resetState = () => {
    setReason("");
    setShowReasonInput(false);
    setPendingAction(null);
  };

  const deleteMutation = useDeleteRequest(() => handleBack());

  const approvalMutation = useProcessApproval(id!, () => {
    resetState();
    handleBack();
  });

  const completeMutation = useMarkComplete(id!, () => {
    setIsCompleteDialogOpen(false);
    handleBack();
  });

  const isITUser = user?.role === "MANAGER_IT" || user?.role === "DEV";
  const isBusinessUser = !isITUser;
  const isManager = user?.role === "MANAGER";
  const isVP = user?.role === "VP";
  const isManagerIT = user?.role === "MANAGER_IT";
  const isDev = user?.role === "DEV";
  const isRequester = user?.id === displayData?.userId;

  const canApprove =
    (isManager && displayData?.status === "PENDING_MANAGER") ||
    (isVP && displayData?.status === "PENDING_VP");
  const canAssignDev = isManagerIT && displayData?.status === "APPROVED";
  const canComplete = isDev && displayData?.status === "ASSIGNED_DEV";
  const canDelete = isRequester && displayData?.status === "DRAFT";
  const canEdit =
    isRequester &&
    ["DRAFT", "REVISION_MANAGER", "REVISION_VP"].includes(
      displayData?.status || ""
    );

  const reasonLength = reason.trim().length;
  const isLengthValid = reasonLength >= MIN_NOTE_LENGTH;
  const remainingChars = Math.max(0, MIN_NOTE_LENGTH - reasonLength);

  const MAX_MANAGER_REVISIONS = 3;
  const MAX_VP_REVISIONS = 2;
  const currentRevisionCount = isManager
    ? displayData?.managerRevisionCount
    : isVP
    ? displayData?.vpRevisionCount
    : 0;
  const maxRevisions = isManager ? MAX_MANAGER_REVISIONS : MAX_VP_REVISIONS;
  const isRevisionLimitReached = (currentRevisionCount || 0) >= maxRevisions;

  const latestRevisionNote = useMemo(() => {
    if (!displayData?.approvalLogs?.length) return null;
    const isRevisionOrReject =
      displayData.status.includes("REVISION") ||
      displayData.status.includes("REJECTED");
    if (!isRevisionOrReject) return null;

    const sortedLogs = [...displayData.approvalLogs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
      sortedLogs.find(
        (log) => log.action.includes("REVISION") || log.action === "REJECT"
      )?.notes || null
    );
  }, [displayData]);

  const pdfApproval = useMemo(
    () => displayData?.documents?.find((d) => d.fileType === "PDF_APPROVAL"),
    [displayData]
  );
  const pdfForm = useMemo(
    () => displayData?.documents?.find((d) => d.fileType === "PDF_FORM"),
    [displayData]
  );
  const userAttachments = useMemo(
    () =>
      displayData?.documents?.filter(
        (d) => !["PDF_APPROVAL", "PDF_FORM"].includes(d.fileType)
      ) || [],
    [displayData]
  );

  const handleActionClick = (action: "approve" | "reject" | "revision") => {
    if (action === "approve") setIsApproveDialogOpen(true);
    else {
      setPendingAction(action);
      setShowReasonInput(true);
    }
  };

  const submitReason = () => {
    if (!isLengthValid)
      return toast.error(
        `Reason must be at least ${MIN_NOTE_LENGTH} characters.`
      );
    const role = isManager ? "manager" : "vp";
    approvalMutation.mutate({
      action: pendingAction!,
      reasonText: reason,
      role,
    });
  };

  return {
    id,
    navigate,
    handleBack,
    displayData,
    progressData,
    isQueryLoading,
    isSyncing: isFetching || isProgressLoading,
    reason,
    setReason,
    showReasonInput,
    setShowReasonInput,
    pendingAction,
    resetState,
    dialogs: {
      isApproveDialogOpen,
      setIsApproveDialogOpen,
      isAssignModalOpen,
      setIsAssignModalOpen,
      isCompleteDialogOpen,
      setIsCompleteDialogOpen,
    },

    permissions: {
      isITUser,
      isBusinessUser,
      isManager,
      canApprove,
      canAssignDev,
      canComplete,
      canDelete,
      canEdit,
      isRevisionLimitReached,
    },
    validation: { isLengthValid, remainingChars },
    revisionInfo: { currentRevisionCount, maxRevisions },

    computed: { latestRevisionNote, pdfApproval, pdfForm, userAttachments },

    mutations: { deleteMutation, approvalMutation, completeMutation },

    handleActionClick,
    submitReason,
  };
};
