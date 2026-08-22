import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startDate: z.string().datetime({ message: 'Invalid ISO date string for startDate' }),
  endDate: z.string().datetime({ message: 'Invalid ISO date string for endDate' }),
  coverPhotoUrl: z.string().url().optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "endDate must be after startDate",
  path: ["endDate"]
});

export type CreateTripInput = z.infer<typeof createTripSchema>;

export const updateTripSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  coverPhotoUrl: z.string().url().optional(),
  status: z.enum(['ONGOING', 'UPCOMING', 'COMPLETED', 'CANCELLED']).optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: "endDate must be after startDate",
  path: ["endDate"]
});

export type UpdateTripInput = z.infer<typeof updateTripSchema>;
