import { z } from "zod";

const reviewProjectValidationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    error: "Status must be either APPROVED or REJECTED",
  }),
  reviewComment: z
    .string({
      error: "Review comment must be a string",
    })
    .trim()
    .optional(),
});

export const MentorValidation = {
  reviewProjectValidationSchema,
};
