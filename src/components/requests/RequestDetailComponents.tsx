/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, FileText, Download, FileCode, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadDocument } from "@/hooks/useRequestMutations";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const InfoField = ({ label, value, icon: Icon }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    <div className="text-sm font-medium text-gray-800 wrap-break-word">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </div>
  </div>
);

export const TextBlock = ({ label, value }: any) => (
  <div className="col-span-full space-y-1.5 mt-2">
    <label className="text-xs font-semibold text-muted-foreground uppercase">
      {label}
    </label>
    <div className="text-sm text-gray-700 bg-muted/30 p-3 rounded-md border border-muted/50 whitespace-pre-wrap leading-relaxed">
      {value || (
        <span className="text-gray-400 italic">No description provided.</span>
      )}
    </div>
  </div>
);

export const AttachmentItem = ({
  doc,
  requestId,
}: {
  doc: any;
  requestId: string;
}) => {
  const downloadMutation = useDownloadDocument(requestId);
  const isDownloading = downloadMutation.isPending;

  return (
    <button
      type="button"
      onClick={() => downloadMutation.mutate(doc.id)}
      disabled={isDownloading}
      className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-black-400 hover:shadow-sm transition-all text-left w-full relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
    >
      <div className="bg-gray-50 p-2 rounded-md shrink-0 z-10">
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <FileText className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden z-10">
        <p className="text-sm font-medium text-gray-700 truncate group-hover:text-black transition-colors">
          {doc.fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(doc.fileSize)}
        </p>
      </div>

      {!isDownloading && (
        <Download className="w-4 h-4 text-gray-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-10" />
      )}
    </button>
  );
};

export const OfficialDocBanner = ({
  doc,
  requestId,
  variant = "user",
}: {
  doc: any;
  requestId: string;
  variant?: "user" | "dev";
}) => {
  const downloadMutation = useDownloadDocument(requestId);
  const isDownloading = downloadMutation.isPending;
  const isDev = variant === "dev";

  const styles = isDev
    ? {
        bg: "bg-black-50",
        border: "border-black-200",
        iconBg: "bg-black-100",
        iconColor: "text-black-600",
        title: "Technical Specification Form",
        desc: "Authorized technical requirements for development.",
        Icon: FileCode,
      }
    : {
        bg: "bg-black-50",
        border: "border-black-200",
        iconBg: "bg-black-100",
        iconColor: "text-black-600",
        title: "Official Approval Document",
        desc: "This request has been fully approved.",
        Icon: FileCheck,
      };

  return (
    <div
      className={`col-span-full mb-6 p-4 rounded-lg border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm ${styles.bg} ${styles.border}`}
    >
      <div className="flex gap-4">
        <div
          className={`h-12 w-12 flex items-center justify-center rounded-full shrink-0 ${styles.iconBg}`}
        >
          <styles.Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <div>
          <h4 className={`font-bold text-base ${styles.iconColor}`}>
            {styles.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{styles.desc}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span className="font-mono bg-white/50 px-1.5 rounded border">
              {doc.fileName}
            </span>
            <span>• {formatFileSize(doc.fileSize)}</span>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        onClick={() => downloadMutation.mutate(doc.id)}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        Download PDF
      </Button>
    </div>
  );
};
