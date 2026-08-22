import { notFound } from "next/navigation";
import { MapPin, ArrowDown, DollarSign, Calendar, Map, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShareActions } from "./ShareActions";
import { format } from "date-fns";

async function getSharedTrip(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiUrl}/public/trips/${slug}`, {
      next: { revalidate: 60 } // optional ISR
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching shared trip:", error);
    return null;
  }
}

export default async function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = await params;
  const data = await getSharedTrip(unwrappedParams.slug);

  if (!data || !data.trip) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="text-center p-12 bg-white border border-zinc-200 rounded-3xl shadow-sm max-w-md">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Map className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Trip Not Available</h2>
          <p className="text-zinc-500 font-medium">
            This trip might be private, deleted, or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const { trip, shareUrls } = data;

  // Extract all activities and group by dayNumber
  const activitiesByDay = trip.stops?.reduce((acc: any, stop: any) => {
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
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 truncate">
              {trip.name}
            </span>
          </div>
          
          <ShareActions shareUrls={shareUrls} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-24">
        {/* Read-Only Trip Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            {trip.name}
          </h1>
          {trip.description && (
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto mb-6">
              {trip.description}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1.5 text-sm rounded-full bg-white border-zinc-200 text-zinc-700 shadow-sm">
              <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
              {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
            </Badge>
          </div>
        </div>

        {/* Read-Only Day Grouped Activities */}
        <div className="space-y-12">
          {sortedDays.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-3xl border border-zinc-200 border-dashed">
              <p className="text-zinc-500 font-medium">No activities planned yet.</p>
            </div>
          ) : (
            sortedDays.map((dayNum, index) => (
              <div key={dayNum} className="relative">
                <div className="sticky top-20 z-30 inline-flex mb-6">
                  <Badge className="px-4 py-1.5 text-sm font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                    Day {dayNum}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {activitiesByDay[dayNum].map((act: any, idx: number) => (
                    <div key={act.id}>
                      <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-zinc-900 text-lg">{act.name}</h4>
                            <Badge variant="outline" className="text-xs bg-zinc-50 text-zinc-500 border-zinc-200">
                              <MapPin className="w-3 h-3 mr-1" />
                              {act.cityName}
                            </Badge>
                          </div>
                          {act.notes && (
                            <p className="text-zinc-600 text-sm mt-1 whitespace-pre-wrap">{act.notes}</p>
                          )}
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end shrink-0">
                          <div className="flex items-center text-zinc-700 font-semibold bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
                            <DollarSign className="w-4 h-4 mr-0.5 text-zinc-400" />
                            {act.cost || 0}
                          </div>
                        </div>
                      </div>

                      {/* Visual Connector */}
                      {idx < activitiesByDay[dayNum].length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowDown className="w-5 h-5 text-zinc-300" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Visual Connector between days */}
                {index < sortedDays.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="h-16 w-px bg-gradient-to-b from-zinc-300 to-transparent" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
