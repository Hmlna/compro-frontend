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
    .nonempty("Please enter a project title")
    .min(5, "Title must be at least 5 characters long"),

  proposers1: z
    .string()
    .nonempty("Please enter the first proposer's name")
    .min(2, "Name must be at least 2 characters long"),

  proposers2: z
    .string()
    .nonempty("Please enter the second proposer's name")
    .min(2, "Name must be at least 2 characters long"),

  businessArea: z
    .string()
    .nonempty("Please select or enter a business area")
    .min(2, "Business area must be at least 2 characters long"),

  impactCategory: z
    .string()
    .nonempty("Please select an impact category")
    .min(3, "Please select a valid impact category"),

  impactDescription: z
    .string()
    .nonempty("Please describe the expected impact")
    .min(5, "Impact description must be at least 5 characters long"),

  background: z
    .string()
    .nonempty("Please provide background information")
    .min(
      5,
      "Background must be at least 5 characters long to give proper context"
    ),

  objective: z
    .string()
    .nonempty("Please define the main objective")
    .min(5, "Objective must be at least 5 characters long"),

  service: z
    .string()
    .nonempty("Please specify the current service or system")
    .min(5, "Service name must be at least 5 characters long"),

  requiredService: z
    .string()
    .nonempty("Please describe the required service or solution")
    .min(5, "Required service description must be at least 5 characters long"),
});

export type RequestFormSchema = z.infer<typeof requestFormSchema>;
