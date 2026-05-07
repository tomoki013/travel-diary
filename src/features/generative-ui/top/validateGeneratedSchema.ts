import { GeneratedTopPageSchema, type GeneratedTopPage } from "./schema";

export type ValidationResult =
  | { success: true; data: GeneratedTopPage }
  | { success: false; error: string };

export function validateGeneratedSchema(raw: unknown): ValidationResult {
  const result = GeneratedTopPageSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessage = result.error.issues
    .slice(0, 3)
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("; ");
  return { success: false, error: errorMessage };
}
