"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Loader2, Map as MapIcon, CalendarIcon, ChevronLeft, ImagePlus, X } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCreateTripMutation, useUploadCoverPhotoMutation, createTripSchema } from "@/api/useTrips";
import { useActivitiesQuery } from "@/api/useActivities";

function ActivitySuggestions() {
  const { data: activities, isLoading } = useActivitiesQuery();
  const displayActivities = activities?.slice(0, 6) || [];

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-1">
          Suggestions for Places to Visit / Activities to perform
        </h2>
        <p className="text-sm text-zinc-500">
          Get inspired by popular destinations and things to do.
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : displayActivities.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-all group cursor-pointer bg-white">
              <CardContent className="p-0 h-full flex flex-col relative aspect-[4/3]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${activity.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="font-semibold text-white truncate text-base mb-1">
                    {activity.name}
                  </h3>
                  <div className="flex items-center text-xs font-medium text-zinc-300">
                    <MapIcon className="w-3 h-3 mr-1" />
                    <span className="truncate">{activity.cityName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center">
          <p className="text-sm text-zinc-500">No suggestions available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default function CreateTripPage() {
  const router = useRouter();
  const { mutateAsync: createTrip } = useCreateTripMutation();
  const { mutateAsync: uploadCoverPhoto } = useUploadCoverPhotoMutation();

  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type (jpeg, png, webp)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }
    
    // Validate file size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setCoverPhoto(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPhotoPreview(objectUrl);
  };

  const removeCoverPhoto = () => {
    setCoverPhoto(null);
    if (coverPhotoPreview) URL.revokeObjectURL(coverPhotoPreview);
    setCoverPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onSubmit(values: z.infer<typeof createTripSchema>) {
    try {
      const response = await createTrip(values);
      toast.success("Trip created successfully!");
      
      const tripId = response?.id;
      
      if (tripId && coverPhoto) {
        setIsUploadingPhoto(true);
        try {
          await uploadCoverPhoto({ id: tripId, file: coverPhoto });
        } catch (uploadError) {
          toast.error("Trip created, but cover photo failed to upload.");
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      if (tripId) {
        router.push(`/trips/${tripId}/build`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred while creating your trip. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl">
        <div className="flex h-16 items-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          <Link href="/dashboard" className="mr-4 p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <MapIcon className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              Plan a New Trip
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-10"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">Trip Details</h1>
            <p className="text-sm text-zinc-500">
              Start by giving your trip a name and setting the dates.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Cover Photo Upload */}
              <div className="space-y-3">
                <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider flex justify-between">
                  <span>Cover Photo</span>
                  <span className="text-[10px] text-zinc-400 tracking-normal normal-case">Optional (max 5MB)</span>
                </FormLabel>
                
                <div className="relative w-full rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 transition-all hover:bg-zinc-50 overflow-hidden group min-h-[160px] flex items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Upload cover photo"
                  />
                  
                  <AnimatePresence>
                    {coverPhotoPreview ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0"
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${coverPhotoPreview})` }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeCoverPhoto();
                          }}
                          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-rose-500 text-white rounded-full backdrop-blur-sm transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 px-4 text-center z-0 pointer-events-none">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <ImagePlus className="w-5 h-5 text-indigo-500" />
                        </div>
                        <p className="text-sm font-medium text-zinc-700">Click or drag an image here</p>
                        <p className="text-xs text-zinc-400 mt-1">JPEG, PNG or WebP</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                        Trip Name <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder="e.g. European Summer Tour"
                          className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider flex justify-between">
                        <span>Description</span>
                        <span className="text-[10px] text-zinc-400 tracking-normal normal-case">Optional</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="What's this trip about?"
                          className="flex min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider mb-2">
                        Start Date <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger className={cn(
                            "flex h-12 w-full items-center justify-start text-left font-normal rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30",
                            !field.value && "text-zinc-400"
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider mb-2">
                        End Date <span className="text-rose-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger className={cn(
                            "flex h-12 w-full items-center justify-start text-left font-normal rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30",
                            !field.value && "text-zinc-400"
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-rose-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2">
                <div className="space-y-2">
                  <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider flex justify-between">
                    <span>Select a Place</span>
                    <span className="text-[10px] text-zinc-400 tracking-normal normal-case">Initial destination</span>
                  </FormLabel>
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400"
                  />
                  <p className="text-[11px] text-zinc-500">You can add more places later.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex justify-end">
                <motion.button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-11 px-8 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Trip
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </Form>
        </motion.div>

        {/* Suggestions Section */}
        <ActivitySuggestions />

      </main>
    </div>
  );
}
