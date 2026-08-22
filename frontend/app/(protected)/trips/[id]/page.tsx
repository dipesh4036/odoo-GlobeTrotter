"use client";

import { useState, use } from "react";
import { useTripByIdQuery, useTripBudgetQuery, usePublishTripMutation } from "@/api/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowDown, DollarSign, Calendar, Edit3, Map, PieChart as PieChartIcon, BarChart2, AlertTriangle, Share2, Copy, Check, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  
  const { data: trip, isLoading, isError } = useTripByIdQuery(tripId);
  const { data: budget } = useTripBudgetQuery(tripId);
  const { mutateAsync: publishTrip, isPending: isPublishing } = usePublishTripMutation();
  
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const handleShare = async () => {
    try {
      const data = await publishTrip(tripId);
      setPublicSlug(data.publicSlug);
      setIsShareOpen(true);
    } catch (err) {
      toast.error("Failed to publish trip. Please try again.");
    }
  };

  const handleCopyLink = () => {
    if (!publicSlug) return;
    const link = `${window.location.origin}/share/${publicSlug}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

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

  const activitiesByDay = trip.stops?.reduce((acc: any, stop: any) => {
    stop.activities?.forEach((stopAct: any) => {
      const dayStr = stopAct.dayNumber?.toString() || "1";
      if (!acc[dayStr]) {
        acc[dayStr] = [];
      }
      acc[dayStr].push({ 
        id: stopAct.id,
        name: stopAct.activity?.name || "Unknown Activity",
        cost: stopAct.activity?.cost || 0,
        cityName: stop.cityName 
      });
    });
    return acc;
  }, {} as Record<string, any[]>) || {};

  const sortedDays = Object.keys(activitiesByDay).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/trips" className="text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-2 text-sm font-medium">
              <ChevronLeft className="w-4 h-4" /> Back to Trips
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/trips/${tripId}/calendar`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-lg h-9 shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-lg h-9 shadow-sm"
              onClick={handleShare}
              disabled={isPublishing}
            >
              {isPublishing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
              Share
            </Button>
            <Link href={`/trips/${tripId}/build`}>
              <Button size="sm" className="rounded-lg h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                Edit Itinerary
              </Button>
            </Link>
          </div>
        </div>

        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Share your itinerary</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-zinc-500">
              Anyone with this link will be able to view your trip itinerary.
            </p>
            <div className="flex items-center space-x-2">
              <Input 
                readOnly 
                value={publicSlug ? `${window.location.origin}/share/${publicSlug}` : ""} 
                className="flex-1 bg-zinc-50 rounded-xl"
              />
              <Button size="icon" onClick={handleCopyLink} className="rounded-xl flex-shrink-0">
                {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="pt-2">
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

        {/* Budget Summary Info */}
        {budget && (
          <div className="mb-12 max-w-3xl">
            <Card className="rounded-3xl border-zinc-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">Budget Summary</CardTitle>
                  <div className="flex items-center gap-2 p-1 bg-zinc-200/50 rounded-lg">
                    <button 
                      onClick={() => setChartType("pie")}
                      className={`p-1.5 rounded-md transition-all ${chartType === "pie" ? "bg-white shadow-sm text-indigo-600" : "text-zinc-500 hover:text-zinc-900"}`}
                    >
                      <PieChartIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setChartType("bar")}
                      className={`p-1.5 rounded-md transition-all ${chartType === "bar" ? "bg-white shadow-sm text-indigo-600" : "text-zinc-500 hover:text-zinc-900"}`}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
                  <div className="flex flex-col gap-1 items-center sm:items-start w-full">
                    <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Spent</span>
                    <span className="text-3xl font-black text-zinc-900 flex items-center tracking-tight">
                      <DollarSign className="w-7 h-7 -mr-1 text-zinc-400" />
                      {budget.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-12 w-px bg-zinc-200 hidden sm:block" />
                  <div className="flex flex-col gap-1 items-center sm:items-start w-full">
                    <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Avg / Day</span>
                    <span className="text-3xl font-black text-zinc-900 flex items-center tracking-tight">
                      <DollarSign className="w-7 h-7 -mr-1 text-zinc-400" />
                      {budget.averageCostPerDay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "pie" ? (
                      <PieChart>
                        <Pie
                          data={budget.byCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="total"
                          nameKey="category"
                        >
                          {budget.byCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                      </PieChart>
                    ) : (
                      <BarChart data={budget.byDay}>
                        <XAxis dataKey="dayNumber" tickFormatter={(val) => `Day ${val}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(val) => `$${val}`} />
                        <Tooltip 
                          formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
                          labelFormatter={(label: any) => `Day ${label}`}
                          cursor={{ fill: '#f4f4f5', radius: 4 }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={32} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {budget.overbudgetStops?.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {budget.overbudgetStops.map((stop) => (
                      <div key={stop.stopId} className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <span className="font-semibold text-rose-900">{stop.cityName} is over budget</span>
                        </div>
                        <div className="text-xs font-medium text-rose-700 bg-rose-100/50 px-2.5 py-1 rounded-md">
                          Spent ${stop.spent} / ${stop.budget}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </CardContent>
            </Card>
          </div>
        )}

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
        </div>
      </main>
    </div>
  );
}
