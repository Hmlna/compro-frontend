/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext, useWatch, type Control } from "react-hook-form";
import type { RequestFormSchema } from "../../schema/requestFormSchema";
import DayPickerWrapper from "../ui/DatePicker/DayPickerWrapper";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUsersbyRole } from "@/api/users";

export const RequestBasicInfo = ({
  control,
}: {
  control: Control<RequestFormSchema>;
}) => {
  const { user } = useAuth();
  const { setValue, getValues } = useFormContext<RequestFormSchema>();

  const businessArea = useWatch({ control, name: "businessArea" });

  const { data: managers, isLoading: isManagersLoading } = useQuery({
    queryKey: ["managers", businessArea],
    queryFn: () =>
      businessArea
        ? getUsersbyRole({ role: "MANAGER", division: businessArea })
        : [],
    enabled: !!businessArea,
  });

  useEffect(() => {
    if (user) {
      const currentRequester = getValues("requester1");
      if (!currentRequester) {
        setValue("requester1", (user.name as string) || "");
      }
      const currentArea = getValues("businessArea");
      if (!currentArea && user.division) {
        setValue("businessArea", user.division);
      }
    }
  }, [user, setValue, getValues]);

  const DateInput = ({ field }: { field: any }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initialDate =
      field.value instanceof Date
        ? field.value
        : typeof field.value === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(field.value)
        ? (() => {
            const [y, m, d] = field.value.split("-").map(Number);
            return new Date(y, m - 1, d);
          })()
        : undefined;

    const handleSelect = (date?: Date) => {
      if (date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const isoDate = `${yyyy}-${mm}-${dd}`;
        field.onChange(isoDate);
      } else {
        field.onChange(undefined);
      }
      setOpen(false);
    };

    return (
      <div className="relative" ref={ref}>
        <Input
          {...field}
          readOnly
          value={field.value ?? ""}
          onClick={() => setOpen((v) => !v)}
          placeholder="Select target date"
          className="cursor-pointer bg-white"
          aria-haspopup="dialog"
          aria-expanded={open}
        />
        {open && (
          <div className="absolute left-0 z-50 mt-2">
            <div className="bg-white rounded-md shadow-lg">
              <DayPickerWrapper
                initialDate={initialDate}
                onDateSelect={handleSelect}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const StaticField = ({ label, value }: { label: string; value: string }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted/20 px-3 py-2 text-sm text-foreground">
        {value}
      </div>
    </FormItem>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide the essential details of your change request
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ROW 1: Identity & Routing */}
        <div className="grid gap-4 md:grid-cols-3">
          <StaticField
            label="Requester 1 (You)"
            value={getValues("requester1") || user?.name || "-"}
          />

          <StaticField
            label="Unit"
            value={getValues("businessArea") || user?.division || "-"}
          />

          <FormField
            control={control}
            name="requester2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requester 2</FormLabel>

                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isManagersLoading && !managers}
                    key={`${field.value || "empty"}-${
                      managers?.length || "loading"
                    }`}
                  >
                    <SelectTrigger className="mt-2 w-full">
                      <SelectValue placeholder="Choose manager">
                        {field.value ? field.value : "Choose manager"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {managers?.map((m) => (
                        <SelectItem key={m.id} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))}
                      {field.value &&
                        managers &&
                        !managers.some((m) => m.name === field.value) && (
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
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ROW 2: Project Details */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Title of the project" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-1">
            <FormField
              control={control}
              name="targetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Date</FormLabel>
                  <FormControl>
                    <DateInput field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
