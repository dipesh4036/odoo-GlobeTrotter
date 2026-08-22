import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  additionalInfo: z.string().optional(),
  photoUrl: z.string().url('Invalid URL').optional(),
  languagePreference: z.string().optional()
}).strict();

export const saveDestinationSchema = z.object({
  cityId: z.string().min(1, 'cityId is required')
});
