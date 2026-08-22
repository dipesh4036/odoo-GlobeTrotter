"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, Map as MapIcon, CalendarIcon, ChevronLeft } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useCreateTripMutation, createTripSchema } from "@/api/useTrips";

export default function CreateTripPage() {
  const router = useRouter();
  const { mutateAsync: createTrip } = useCreateTripMutation();

  const form = useForm<z.infer<typeof createTripSchema>>({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createTripSchema>) {
    try {
      const response = await createTrip(values);
      toast.success("Trip created successfully!");
      // Assuming backend returns { id: "clx..." } as per API contract
      if (response && response.id) {
        router.push(`/trips/${response.id}/build`);
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
      </main>
    </div>
  );
}
