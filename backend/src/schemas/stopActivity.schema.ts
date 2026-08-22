import { z } from 'zod';

export const createStopActivitySchema = z.object({
  activityId: z.string().min(1, 'Activity ID is required'),
  dayNumber: z.number().int().positive('Day number must be a positive integer'),
});

export const reorderStopActivitiesSchema = z.object({
  stopId: z.string().min(1, 'Stop ID is required'),
  dayNumber: z.number().int().positive('Day number must be positive'),
  activityIds: z.array(z.string()).min(1, 'At least one activityId must be provided'),
});

export type CreateStopActivityInput = z.infer<typeof createStopActivitySchema>;
export type ReorderStopActivitiesInput = z.infer<typeof reorderStopActivitiesSchema>;
