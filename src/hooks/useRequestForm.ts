/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestFormSchema,
  type RequestFormSchema,
} from "@/schema/requestFormSchema";
import { useEffect } from "react";

const STORAGE_KEY = "requestForm:draft";

export const useRequestForm = (isEditMode = false) => {
  const initialDefaults: RequestFormSchema = {
    targetDate: "",
    title: "",
    requester1: "",
    requester2: "",
    businessArea: "",
    categoryImpact: "",
    impactDescription: "",
    background: "",
    objective: "",
    serviceExplanation: "",
    servicesNeeded: "",
  };

  // hydrate from localStorage if available
  let saved: Partial<RequestFormSchema> | null = null;
  if (!isEditMode) {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        saved = raw ? (JSON.parse(raw) as Partial<RequestFormSchema>) : null;
      }
    } catch {
      saved = null;
    }
  }

  const form = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: { ...initialDefaults, ...(saved ?? {}) },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // autosave (debounced)
  useEffect(() => {
    if (isEditMode) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let t: any = null;
    const sub = form.watch((values) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        try {
          // We intentionally don't do complex transformation here,
          // we handle the "read" side in the hydration step above.
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
          /* ignore */
        }
      }, 500); // Increased debounce to prevent rapid-fire saves
    });
    return () => {
      sub.unsubscribe();
      if (t) clearTimeout(t);
    };
  }, [form, isEditMode]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* empty */
    }
    // Hard reset the form to initial defaults
    form.reset(initialDefaults);
  };

  return { ...form, clearDraft };
};
