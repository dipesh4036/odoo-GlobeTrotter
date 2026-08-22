import { z } from 'zod';

export const createStopSchema = z.object({
  cityId: z.string().min(1, 'City ID is required'),
  startDate: z.string().datetime({ message: 'Invalid ISO date string for startDate' }),
  endDate: z.string().datetime({ message: 'Invalid ISO date string for endDate' }),
  budget: z.number().positive('Budget must be positive').optional(),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "endDate must be at or after startDate",
  path: ["endDate"]
});

export const updateStopSchema = z.object({
  cityId: z.string().min(1, 'City ID is required').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "endDate must be at or after startDate",
  path: ["endDate"]
});

export const reorderStopsSchema = z.object({
  stopIds: z.array(z.string()).min(1, 'At least one stopId must be provided'),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;
