import { z } from "zod";

export const requestFormSchema = z.object({
  targetDate: z
    .string()
    .nonempty("Please select a target completion date")
    .refine(
      (val) => new Date(val) > new Date(),
      "Target date must be in the future (tomorrow or later)"
    ),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  requester1: z.string().min(2, "Name must be at least 2 characters long"),
  requester2: z.string().min(2, "Please select a manager"),
  businessArea: z.string().min(2, "Business area is required"),
  categoryImpact: z.string().min(2, "Please select a category"),
  impactDescription: z
    .string()
    .min(10, "Impact description must be at least 10 characters"),
  background: z
    .string()
    .min(20, "Background must be at least 20 characters long"),
  objective: z.string().min(10, "Objective must be at least 10 characters"),
  serviceExplanation: z
    .string()
    .min(10, "Service explanation must be at least 10 characters"),
  servicesNeeded: z
    .string()
    .min(5, "Required service description must be at least 5 characters"),
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;
