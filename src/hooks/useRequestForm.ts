/* eslint-disable @typescript-eslint/no-explicit-any */
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

  useEffect(() => {
    if (isEditMode) return;
    let t: any = null;
    const sub = form.watch((values) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
          /* ignore */
        }
      }, 500);
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
    form.reset(initialDefaults);
  };

  return { ...form, clearDraft };
};
