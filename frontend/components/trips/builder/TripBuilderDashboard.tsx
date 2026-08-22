"use client";

import { useTripByIdQuery } from "@/api/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStopDialog from "./AddStopDialog";
import AddActivityDialog from "./AddActivityDialog";

export default function TripBuilderDashboard({ tripId }: { tripId: string }) {
  const { data: trip, isLoading, isError } = useTripByIdQuery(tripId);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex gap-6">
        <Skeleton className="flex-1 h-full rounded-2xl" />
        <Skeleton className="w-80 h-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">Failed to load trip builder.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="h-16 border-b bg-white flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-display font-semibold">{trip.name} - Itinerary Builder</h1>
        </div>
        <Link href={`/trips/${tripId}`}>
          <Button variant="outline">Preview Public View</Button>
        </Link>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Main Itinerary Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-semibold">Your Itinerary</h2>
              <AddStopDialog tripId={tripId}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Add City Stop
                </Button>
              </AddStopDialog>
            </div>

            {trip.stops && trip.stops.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-zinc-300">
                <p className="text-zinc-500 mb-4">You haven't added any stops yet.</p>
                <AddStopDialog tripId={tripId}>
                  <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Add your first stop</Button>
                </AddStopDialog>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.stops?.map((stop: any) => (
                  <div key={stop.id} className="p-4 bg-white rounded-xl shadow-sm border border-zinc-100">
                    <h3 className="font-semibold text-lg">{stop.cityName}</h3>
                    <p className="text-sm text-zinc-500">
                      {new Date(stop.startDate).toLocaleDateString()} to {new Date(stop.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-4 pl-4 border-l-2 border-zinc-100 space-y-2">
                      {stop.activities?.length === 0 ? (
                        <p className="text-xs text-zinc-400">No activities added yet.</p>
                      ) : (
                        stop.activities?.map((act: any) => (
                          <div key={act.id} className="flex justify-between items-center bg-zinc-50 p-2 rounded-md">
                            <span className="text-sm">{act.activity?.name || "Activity"}</span>
                            <span className="text-xs font-medium text-emerald-600">${act.activity?.cost || 0}</span>
                          </div>
                        ))
                      )}
                      <AddActivityDialog tripId={tripId} stop={stop}>
                        <Button variant="ghost" size="sm" className="text-xs mt-2 w-full justify-start text-zinc-500 pointer-events-none">
                          <Plus className="w-3 h-3 mr-2" /> Add Activity
                        </Button>
                      </AddActivityDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
