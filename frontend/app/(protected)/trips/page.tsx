"use client";

import { useState } from "react";
import { useTripsQuery, useCancelTripMutation, useDeleteTripMutation, Trip } from "@/api/useTrips";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Map, Trash2, Edit3, Eye, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function TripsListingPage() {
  const [activeTab, setActiveTab] = useState("ONGOING");
  const queryClient = useQueryClient();
  
  const { data: trips, isLoading, isError } = useTripsQuery(activeTab);
  
  const { mutateAsync: cancelTrip, isPending: isCancelling } = useCancelTripMutation();
  const { mutateAsync: deleteTrip, isPending: isDeleting } = useDeleteTripMutation();

  const [tripToCancel, setTripToCancel] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

  const handleCancelConfirm = async () => {
    if (!tripToCancel) return;
    try {
      await cancelTrip(tripToCancel.id);
      toast.success("Trip cancelled successfully.");
      queryClient.invalidateQueries({ queryKey: ["trips", activeTab] });
    } catch (err) {
      toast.error("Failed to cancel trip.");
    } finally {
      setTripToCancel(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;
    try {
      await deleteTrip(tripToDelete.id);
      toast.success("Trip deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["trips", activeTab] });
    } catch (err) {
      toast.error("Failed to delete trip.");
    } finally {
      setTripToDelete(null);
    }
  };

  const TABS = ["ONGOING", "UPCOMING", "COMPLETED", "CANCELLED"];

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-3xl tracking-tight text-zinc-900">My Trips</h1>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all bg-[#F97316] hover:bg-[#EA580C] text-white font-medium">
            + Plan a Trip
          </Button>
        </Link>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-zinc-200/50 p-1 rounded-xl inline-flex overflow-x-auto max-w-full">
            {TABS.map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm capitalize"
              >
                {tab.toLowerCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-8">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                  ))}
                </div>
              ) : isError ? (
                <div className="p-8 text-center border-2 border-dashed border-rose-200 bg-rose-50 rounded-2xl text-rose-500">
                  Failed to load trips.
                </div>
              ) : trips?.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-3xl">
                  <Map className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500 font-medium text-lg">No {tab.toLowerCase()} trips found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {trips?.map((trip, idx) => (
                      <motion.div
                        key={trip.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                      >
                        <Card className="overflow-hidden border-zinc-200 shadow-sm hover:shadow-md transition-all group bg-white h-full flex flex-col rounded-2xl">
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                              style={{ backgroundImage: `url(${trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'})` }}
                            />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-zinc-900 shadow-sm uppercase tracking-wider">
                              {trip.status}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="font-bold text-white text-xl line-clamp-1">
                                {trip.name}
                              </h3>
                              <p className="flex items-center text-white/80 text-xs font-medium mt-1">
                                <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <CardFooter className="p-3 bg-zinc-50/50 flex flex-wrap gap-2 justify-between items-center mt-auto border-t border-zinc-100">
                            <div className="flex gap-2">
                              <Link href={`/trips/${trip.id}`}>
                                <Button variant="secondary" size="sm" className="h-8 px-3 rounded-lg bg-white shadow-sm hover:bg-zinc-100">
                                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                                  View
                                </Button>
                              </Link>
                              <Link href={`/trips/${trip.id}/build`}>
                                <Button variant="secondary" size="sm" className="h-8 px-3 rounded-lg bg-white shadow-sm hover:bg-zinc-100">
                                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                  Edit
                                </Button>
                              </Link>
                            </div>
                            <div className="flex gap-2">
                              {(tab === "ONGOING" || tab === "UPCOMING") && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                  onClick={() => setTripToCancel(trip)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                onClick={() => setTripToDelete(trip)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Cancel Dialog */}
      <Dialog open={!!tripToCancel} onOpenChange={(open) => !open && setTripToCancel(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Cancel Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel &quot;{tripToCancel?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setTripToCancel(null)}>
              No, keep it
            </Button>
            <Button 
              variant="destructive" 
              className="rounded-xl" 
              onClick={handleCancelConfirm}
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Yes, cancel trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!tripToDelete} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-rose-600">Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete &quot;{tripToDelete?.name}&quot;? All associated itinerary data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setTripToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="rounded-xl bg-rose-600 hover:bg-rose-700" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
