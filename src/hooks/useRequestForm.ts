/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestFormSchema,
  type RequestFormSchema,
} from "@/schema/requestFormSchema";
import { useEffect } from "react";

const STORAGE_KEY = "requestForm:draft";

export const useRequestForm = () => {
  const initialDefaults: RequestFormSchema = {
    targetDate: "",
    title: "",
    proposers1: "",
    proposers2: "",
    businessArea: "",
    impactCategory: "",
    impactDescription: "",
    background: "",
    objective: "",
    service: "",
    requiredService: "",
  };

  // hydrate from localStorage if available
  let saved: Partial<RequestFormSchema> | null = null;
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      saved = raw ? (JSON.parse(raw) as Partial<RequestFormSchema>) : null;
    }
  } catch {
    saved = null;
  }

  const form = useForm<RequestFormSchema>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: { ...initialDefaults, ...(saved ?? {}) },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // autosave (debounced)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    const sub = form.watch((values) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
          /* ignore */
        }
      }, 300);
    });
    return () => {
      sub.unsubscribe();
      if (t) clearTimeout(t);
    };
  }, [form]);

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
