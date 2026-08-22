"use client";

import { useAuth } from "@/context/AuthContext";
import { useUpdateUserMutation, useSavedDestinationsQuery, useRemoveSavedDestinationMutation, updateUserSchema, UpdateUserCredentials, SavedDestination } from "@/api/useAuth";
import { useTripsQuery } from "@/api/useTrips";
import { TripCard } from "@/components/trips/TripCard";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Camera, UserCircle, Trash2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
  const { user, isLoading: isUserLoading, refetch } = useAuth();
  const queryClient = useQueryClient();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  
  const { data: upcomingTrips, isLoading: isUpcomingLoading } = useTripsQuery("UPCOMING");
  const { data: completedTrips, isLoading: isCompletedLoading } = useTripsQuery("COMPLETED");

  const { data: savedDestinations, isLoading: isSavedDestinationsLoading } = useSavedDestinationsQuery();
  const { mutateAsync: removeSavedDestination, isPending: isRemovingDestination } = useRemoveSavedDestinationMutation();

  const handleRemoveSavedDestination = async (cityId: string) => {
    try {
      await removeSavedDestination(cityId);
      toast.success("Destination removed successfully.");
      queryClient.invalidateQueries({ queryKey: ["savedDestinations"] });
    } catch (error) {
      toast.error("Failed to remove destination.");
    }
  };

  const form = useForm<UpdateUserCredentials>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      country: "",
      additionalInfo: "",
      languageId: "en",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        city: user.city || "",
        country: user.country || "",
        additionalInfo: user.additionalInfo || "",
        languageId: user.languageId || "en",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserCredentials) => {
    try {
      await updateUser(data);
      toast.success("Profile updated successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight text-zinc-900">My Profile</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-10">
        {/* Profile Edit Section */}
        <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-12 mb-16">
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl bg-zinc-100 flex items-center justify-center text-zinc-300">
                <UserCircle className="w-full h-full p-2" />
              </div>
              <button className="absolute bottom-2 right-2 p-3 bg-zinc-900 text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zinc-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-zinc-500 font-medium">{user?.email}</p>
          </div>

          <div className="md:w-2/3">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 border-b border-zinc-100 pb-4">Personal Details</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...form.register("firstName")} className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white" />
                  {form.formState.errors.firstName && <span className="text-sm text-rose-500">{form.formState.errors.firstName.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...form.register("lastName")} className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white" />
                  {form.formState.errors.lastName && <span className="text-sm text-rose-500">{form.formState.errors.lastName.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...form.register("phone")} className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languageId">Language Preference</Label>
                  <Select 
                    value={form.watch("languageId") || undefined} 
                    onValueChange={(val) => form.setValue("languageId", val || undefined)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")} className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white" />
                  {form.formState.errors.city && <span className="text-sm text-rose-500">{form.formState.errors.city.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register("country")} className="h-12 rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white" />
                  {form.formState.errors.country && <span className="text-sm text-rose-500">{form.formState.errors.country.message}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Info (Bio)</Label>
                <Textarea 
                  id="additionalInfo" 
                  {...form.register("additionalInfo")} 
                  className="rounded-xl bg-zinc-50 border-transparent focus:border-indigo-500 focus:bg-white min-h-[100px] resize-none" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Trips Sections */}
        <div className="space-y-16">
          <section>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6">Preplanned Trips</h3>
            {isUpcomingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-zinc-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : upcomingTrips?.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
                <p className="text-zinc-500 font-medium">No upcoming trips.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips?.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6">Saved Destinations</h3>
            {isSavedDestinationsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-zinc-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : savedDestinations?.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
                <MapPin className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No saved destinations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {savedDestinations?.map((dest: SavedDestination, idx: number) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${dest.imageUrl || 'https://images.unsplash.com/photo-1517713982677-4b66332f98de?q=80&w=400&auto=format&fit=crop'})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="font-bold text-white text-lg line-clamp-1">{dest.cityName}</h4>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveSavedDestination(dest.cityId)}
                        disabled={isRemovingDestination}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6">Previous Trips</h3>
            {isCompletedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-zinc-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : completedTrips?.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
                <p className="text-zinc-500 font-medium">No completed trips.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips?.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>

      </main>
    </div>
  );
}
