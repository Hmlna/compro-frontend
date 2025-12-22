import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsersbyRole } from "@/api/users";
import { assignDevelopers } from "@/api/approval";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AssignDevDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  onSuccess?: () => void;
}

export function AssignDevDialog({
  open,
  onOpenChange,
  requestId,
  onSuccess,
}: AssignDevDialogProps) {
  const queryClient = useQueryClient();
  const [selectedDevs, setSelectedDevs] = useState<
    { id: string; name: string }[]
  >([]);
  const [notes, setNotes] = useState("");
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const { data: developers, isLoading: isLoadingDevs } = useQuery({
    queryKey: ["users", "DEV"],
    queryFn: () => getUsersbyRole({ role: "DEV", division: "" }),
    enabled: open,
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        developerIds: selectedDevs.map((d) => d.id),
        notes: notes,
      };
      return await assignDevelopers(requestId, payload);
    },
    onSuccess: () => {
      toast.success("Developers assigned successfully");
      queryClient.invalidateQueries({
        queryKey: ["request-detail", requestId],
      });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onOpenChange(false);
      setSelectedDevs([]);
      setNotes("");

      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast.error("Failed to assign developers");
    },
  });

  const toggleDev = (dev: { id: string; name: string }) => {
    setSelectedDevs((current) => {
      const exists = current.find((d) => d.id === dev.id);
      if (exists) {
        return current.filter((d) => d.id !== dev.id);
      }
      return [...current, dev];
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Developers</DialogTitle>
          <DialogDescription>
            Select developers to work on this request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Developer Multi-Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Developers</label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between"
                  disabled={isLoadingDevs}
                >
                  {selectedDevs.length > 0
                    ? `${selectedDevs.length} developer(s) selected`
                    : "Assign one or more developers"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0">
                <Command>
                  <CommandInput placeholder="Search developers..." />
                  <CommandEmpty>No developer found.</CommandEmpty>
                  <CommandGroup className="max-h-[200px] overflow-auto">
                    {developers?.map((dev) => (
                      <CommandItem
                        key={dev.id}
                        value={dev.name}
                        onSelect={() =>
                          toggleDev({ id: dev.id, name: dev.name })
                        }
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDevs.find((d) => d.id === dev.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {dev.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({dev.email})
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDevs.map((dev) => (
                <Badge
                  key={dev.id}
                  variant="secondary"
                  className="pl-2 pr-1 py-1"
                >
                  {dev.name}
                  <button
                    onClick={() => toggleDev(dev)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Assignment Notes (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Priority high, deadline 2 weeks..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => assignMutation.mutate()}
            disabled={selectedDevs.length === 0 || assignMutation.isPending}
          >
            {assignMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
