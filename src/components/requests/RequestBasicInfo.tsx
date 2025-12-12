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
import { useFormContext, type Control } from "react-hook-form";
import type { RequestFormSchema } from "../../schema/requestFormSchema";
import DayPickerWrapper from "../ui/DatePicker/DayPickerWrapper";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import { getManagerByUnit } from "@/api/auth"; // Import the helper

export const RequestBasicInfo = ({
  control,
}: {
  control: Control<RequestFormSchema>;
}) => {
  const { user } = useAuth();
  const { setValue } = useFormContext<RequestFormSchema>();

  // Fetch manager based on user's unit
  const { data: manager } = useQuery({
    queryKey: ["manager", user?.unit],
    queryFn: () => (user?.unit ? getManagerByUnit(user.unit) : null),
    enabled: !!user?.unit, // Only run if user has a unit
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  useEffect(() => {
    if (user) {
      // 1. Set Proposer 1 (Current User)
      setValue("proposers1", (user.name as string) || "");

      // 2. Set Business Area (User's Unit)
      if (user.unit) {
        setValue("businessArea", user.unit);
      }
    }

    // 3. Set Proposer 2 (Manager of the Unit)
    if (manager) {
      setValue("proposers2", manager.name);
    }
  }, [user, manager, setValue]);

  // Small inner component for the date input + calendar popover
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

    // parse existing value (assumes YYYY-MM-DD or Date)
    const initialDate =
      field.value instanceof Date
        ? field.value
        : typeof field.value === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(field.value)
        ? (() => {
            const [y, m, d] = field.value.split("-").map(Number);
            return new Date(y, m - 1, d); // local date
          })()
        : undefined;

    const handleSelect = (date?: Date) => {
      if (date) {
        // format using local date parts to avoid timezone shift
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const isoDate = `${yyyy}-${mm}-${dd}`; // local YYYY-MM-DD
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide the essential details of your change request
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="proposers1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposer 1 (you)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted caret-transparent focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="proposers2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposers 2 (your manager)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted caret-transparent focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="businessArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Business Area</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted caret-transparent focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="targetDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Date *</FormLabel>
                <FormControl>
                  <DateInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Title of the project" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
