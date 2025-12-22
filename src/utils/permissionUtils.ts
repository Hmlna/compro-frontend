import type { RequestStatus } from "@/types/request";

const EDITABLE_STATUSES: RequestStatus[] = [
  "DRAFT",
  "REVISION_MANAGER",
  "REVISION_VP",
];

export const canEditRequest = (
  requestStatus: RequestStatus,
  requestOwnerId: string | undefined,
  currentUserId: string
): boolean => {
  if (requestOwnerId !== currentUserId) return false;

  return EDITABLE_STATUSES.includes(requestStatus);
};
