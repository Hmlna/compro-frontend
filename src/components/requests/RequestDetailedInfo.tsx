import { useRef, type ChangeEvent } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { Control } from "react-hook-form";
import type { RequestFormSchema } from "@/schema/requestFormSchema";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Upload, X, FileText, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { downloadDocument } from "@/api/requests/downloadDocument";
import { useMutation } from "@tanstack/react-query";

const IMPACT_OPTIONS = ["High", "Medium", "Low"];

interface ExistingDocument {
  id: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
}

interface RequestDetailedInfoProps {
  control: Control<RequestFormSchema>;
  // Handling New Files
  onFilesChange?: (files: File[]) => void;
  filePreviews: File[]; // These are the NEW files (Draft)

  // Handling Existing Files
  existingFiles?: ExistingDocument[]; // Files from Server
  onRemoveExistingFile?: (docId: string) => void; // API Call trigger
  isDeleting?: boolean; // Loading state for delete
  requestId?: string | null;
}

export const RequestDetailedInfo = ({
  control,
  onFilesChange,
  filePreviews,
  existingFiles = [],
  onRemoveExistingFile,
  isDeleting = false,
  requestId,
}: RequestDetailedInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to calculate total current files
  const totalFilesCount = existingFiles.length + filePreviews.length;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 1. Validate Max 5 Files Total (Existing + New + Incoming)
    if (totalFilesCount + files.length > 5) {
      toast.error("You can only have a maximum of 5 files total.");
      return;
    }

    const validFiles: File[] = [];

    files.forEach((file) => {
      // 2. Validate Max 10MB Size
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Max 10MB allowed.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...filePreviews, ...validFiles];
      if (onFilesChange) onFilesChange(updatedFiles);
    }

    // Reset input value to allow selecting the same file again if needed
    e.target.value = "";
  };

  // Removes a NEW (Draft) file
  const removeNewFile = (indexToRemove: number) => {
    const updatedFiles = filePreviews.filter((_, idx) => idx !== indexToRemove);
    if (onFilesChange) onFilesChange(updatedFiles);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Helper to format bytes to MB
  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const downloadMutation = useMutation({
    mutationFn: async (docId: string) => {
      if (!requestId) throw new Error("No Request ID found");
      return await downloadDocument(requestId, docId);
    },
    onSuccess: (response) => {
      // 1. Validate response structure
      if (response && response.downloadUrl) {
        // 2. Open URL
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Description</CardTitle>
        <CardDescription>
          Provide comprehensive information about the change request
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* --- Form Fields (Unchanged) --- */}
        <FormField
          control={control}
          name="categoryImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                key={field.value || "initial"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact category">
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {IMPACT_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                  {field.value && !IMPACT_OPTIONS.includes(field.value) && (
                    <SelectItem
                      value={field.value}
                      className="hidden"
                      style={{ display: "none" }}
                    >
                      {field.value}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="impactDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the impact of this project"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Explain the current situation and why this change is needed"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="objective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objective</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Define the main objectives and goals of this project"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="serviceExplanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the service involved in this project"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="servicesNeeded"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Service</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the services required to implement this project"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- ATTACHMENT SECTION --- */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-sm">
              Attachments{" "}
              <span className="text-muted-foreground">(optional)</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Max 5 files total (10MB each). Supported: .pdf, .doc, .docx, .xls,
              .xlsx, .jpg, .png, .gif, .txt.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx, .xls, .xlsx, .jpg, .png, .gif, .txt"
              // Disable input if limit reached
              disabled={totalFilesCount >= 5}
            />

            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="flex gap-2"
              disabled={totalFilesCount >= 5}
            >
              <Upload className="h-4 w-4" />
              {totalFilesCount >= 5 ? "Limit Reached" : "Choose Files"}
            </Button>

            <span className="text-sm text-muted-foreground">
              {totalFilesCount}/5 files
            </span>
          </div>

          <div className="space-y-2">
            {/* 1. EXISTING FILES (From Server) */}
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3  border rounded-lg text-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <button
                      type="button"
                      onClick={() => downloadMutation.mutate(file.id)}
                      disabled={downloadMutation.isPending}
                      className="font-medium truncate hover:underline max-w-[200px] sm:max-w-xs text-left flex items-center gap-2"
                    >
                      {file.fileName}
                      {downloadMutation.isPending && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                    </button>
                    {file.fileSize && (
                      <span className="text-xs font-thin text-muted-foreground">
                        {formatSize(file.fileSize)} • Saved
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  onClick={() => onRemoveExistingFile?.(file.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}

            {/* 2. NEW FILES (Pending Upload) */}
            {filePreviews.map((file, idx) => (
              <div
                key={`new-${idx}`}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center shrink-0">
                    <Upload className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatSize(file.size)} • Ready to upload
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-slate-200"
                  onClick={() => removeNewFile(idx)}
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
