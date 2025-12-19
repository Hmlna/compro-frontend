/* eslint-disable @typescript-eslint/no-explicit-any */

export type RequestStatus =
  | "DRAFT"
  | "PENDING_MANAGER"
  | "REJECTED_MANAGER"
  | "REVISION_MANAGER"
  | "PENDING_VP"
  | "REJECTED_VP"
  | "REVISION_VP"
  | "APPROVED"
  | "ASSIGNED_DEV"
  | "COMPLETED";

export type ApprovalLog = {
  id: number;
  crId: string;
  approverId: string;
  action: "SUBMIT" | "APPROVE" | "REJECT" | "REQUEST_REVISION";
  notes: string | null;
  createdAt: string;
  approver: {
    id: string;
    name: string;
    role: "USER" | "MANAGER" | "VP";
  };
};

export type RequestListItem = {
  id: string;
  userId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  formData?: {
    targetDate: string;
    title: string;
    requester1: string;
    requester2: string;
    businessArea: string;
    categoryImpact: string;
    impactDescription: string;
    background: string;
    objective: string;
    serviceExplanation: string;
    servicesNeeded: string;
  };
};

export type RequestDetail = RequestListItem & {
  revisionCount: number;
  managerRevisionCount: number;
  vpRevisionCount: number;
  currentApproverRole: string | null;
  approvalLogs: ApprovalLog[];
  developerAssignments: any[];
  documents: any[];
};

export type GetRequestsResponse = {
  success: boolean;
  message: string;
  data: RequestListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetRequestByIdResponse = {
  success: boolean;
  message: string;
  data: RequestDetail;
};

export type GetRequestsParams = {
  page?: number;
  limit?: number;
  status?: RequestStatus | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export type CreateRequestPayload = {
  formData: RequestListItem["formData"];
};

export type CreateRequestResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
  };
};
