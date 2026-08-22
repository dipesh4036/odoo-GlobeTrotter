"use client";

import { use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useActivitiesQuery } from "@/api/useActivities";
import { useAddActivityToStopMutation } from "@/api/useStops";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronDown, Activity, DollarSign, ArrowLeft, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";

export default function SearchPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const cityId = searchParams.get("cityId") || undefined;
  const stopId = searchParams.get("stopId");
  
  const { data: activities, isLoading, isError } = useActivitiesQuery({ cityId });
  const { mutateAsync: addActivityToStop } = useAddActivityToStopMutation();
  const [addingActivityId, setAddingActivityId] = useState<string | null>(null);

  const handleAddActivity = async (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation(); // Prevent card click
    
    if (!stopId) {
      toast.error("No section selected to add activity to.");
      return;
    }

    setAddingActivityId(activityId);
    try {
      // Default to day 1 as requested in previous steps
      await addActivityToStop({ stopId, data: { activityId, dayNumber: 1 } });
      toast.success("Activity added to trip!");
      router.push(`/trips/${tripId}/build`);
    } catch (err) {
      toast.error("Failed to add activity to trip.");
    } finally {
      setAddingActivityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
          <div className="flex items-center">
            <Link href={`/trips/${tripId}/build`} className="mr-4 p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              Search Activities
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        
        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400 pointer-events-none" />
            <Input 
              placeholder="Search for activities, places to visit..." 
              className="pl-12 h-12 rounded-2xl border-zinc-200 shadow-sm text-base bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                Group by <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem>Category</DropdownMenuItem>
                <DropdownMenuItem>City</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                Filter <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem>Under $50</DropdownMenuItem>
                <DropdownMenuItem>$50 - $100</DropdownMenuItem>
                <DropdownMenuItem>Over $100</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                Sort by <ChevronDown className="ml-2 h-4 w-4 text-zinc-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl">
                <DropdownMenuItem>Popularity</DropdownMenuItem>
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 mb-6">Results</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
              ))
            ) : isError ? (
              <div className="col-span-full p-8 text-center border-2 border-dashed border-rose-200 bg-rose-50 rounded-2xl text-rose-500">
                Failed to load activities.
              </div>
            ) : activities?.length === 0 ? (
              <div className="col-span-full p-12 text-center border-2 border-dashed border-zinc-200 bg-zinc-50/50 rounded-3xl">
                <Activity className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No activities found.</p>
              </div>
            ) : (
              <AnimatePresence>
                {activities?.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-all group cursor-pointer bg-white h-full flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${activity.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'})` }}
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-zinc-900 shadow-sm">
                          {activity.category}
                        </div>
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-zinc-900 line-clamp-1 mb-2 text-base">
                          {activity.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between text-zinc-500 font-medium text-sm">
                          <span className="flex items-center text-indigo-600 font-semibold">
                            <DollarSign className="w-4 h-4 mr-0.5" />
                            {activity.cost}
                          </span>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="rounded-full shadow-sm"
                            onClick={(e) => handleAddActivity(e, activity.id)}
                            disabled={addingActivityId === activity.id}
                          >
                            {addingActivityId === activity.id ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-1" />
                            )}
                            Add to Trip
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
