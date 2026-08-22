"use client";

import { use } from "react";
import { useTripByIdQuery } from "@/api/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowDown, DollarSign, Calendar, Edit3, Map } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  
  const { data: trip, isLoading, isError } = useTripByIdQuery(tripId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-1/3 rounded-xl" />
          <Skeleton className="h-6 w-1/4 rounded-md" />
          <div className="space-y-4 pt-10">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-white border border-rose-100 rounded-3xl shadow-sm">
          <p className="text-rose-500 font-medium mb-4">Failed to load itinerary.</p>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extract all activities and group by dayNumber
  const activitiesByDay = trip.stops?.reduce((acc, stop) => {
    stop.activities?.forEach((act: any) => {
      const dayStr = act.dayNumber?.toString() || "1";
      if (!acc[dayStr]) {
        acc[dayStr] = [];
      }
      acc[dayStr].push({ ...act, cityName: stop.cityName });
    });
    return acc;
  }, {} as Record<string, any[]>) || {};

  const sortedDays = Object.keys(activitiesByDay).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              <span className="font-semibold text-lg tracking-tight">Odoo</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/trips/${tripId}/build`}>
              <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-10">
        
        {/* Trip Summary Info */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-3">{trip.name}</h1>
          <p className="text-zinc-500 text-lg mb-6 max-w-2xl">{trip.description || "A wonderful journey awaits."}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600">
            <span className="flex items-center px-3 py-1.5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center px-3 py-1.5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <Map className="w-4 h-4 mr-2 text-emerald-500" />
              {trip.stops?.length || 0} Destinations
            </span>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-12 max-w-3xl">
          {sortedDays.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
              <p className="text-zinc-500 font-medium">No activities planned yet.</p>
              <Link href={`/trips/${tripId}/build`}>
                <Button className="mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                  Start Planning
                </Button>
              </Link>
            </div>
          ) : (
            sortedDays.map((dayNum) => (
              <motion.div 
                key={dayNum} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="sticky top-20 z-30 inline-block mb-6">
                  <Badge className="px-4 py-1.5 text-sm font-bold tracking-widest uppercase bg-zinc-900 hover:bg-zinc-900 text-white rounded-full shadow-md shadow-zinc-900/10 border-2 border-white">
                    Day {dayNum}
                  </Badge>
                </div>
                
                <div className="space-y-3 relative">
                  {/* Left timeline line */}
                  <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-zinc-200/60 -z-10" />

                  {activitiesByDay[dayNum].map((activity: any, idx: number) => {
                    const isLast = idx === activitiesByDay[dayNum].length - 1;
                    
                    return (
                      <div key={`${activity.id}-${idx}`} className="relative">
                        <div className="flex items-center gap-6 group">
                          {/* Timeline dot */}
                          <div className="w-12 flex justify-center flex-shrink-0 z-10">
                            <div className="w-3 h-3 rounded-full border-[3px] border-indigo-500 bg-white ring-4 ring-zinc-50 transition-transform group-hover:scale-125 duration-300" />
                          </div>
                          
                          {/* Content Row */}
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                            <div>
                              <h3 className="font-semibold text-zinc-900 text-base">{activity.name}</h3>
                              <p className="flex items-center text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">
                                <MapPin className="w-3 h-3 mr-1" />
                                {activity.cityName}
                              </p>
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100/50">
                              <span className="flex items-center font-bold text-emerald-700">
                                <DollarSign className="w-4 h-4 -mr-0.5" />
                                {activity.cost}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Downward arrow between rows */}
                        {!isLast && (
                          <div className="w-12 h-6 flex items-center justify-center -ml-0.5 py-1">
                            <ArrowDown className="w-4 h-4 text-zinc-300 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
