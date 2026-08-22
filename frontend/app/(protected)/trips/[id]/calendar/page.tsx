"use client";

import { use } from "react";
import { useTripCalendarQuery } from "@/api/useTrips";
import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";

export default function CalendarViewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;

  const { data: events, isLoading, isError } = useTripCalendarQuery(tripId);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);

  const daysInGrid = useMemo(() => {
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [monthStart]);

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  // Determine if a day has a specific event and its position in the span
  const getEventData = (day: Date) => {
    if (!events) return null;
    
    // Find the first event that covers this day
    const event = events.find((e) => {
      // Set hours to 0 to compare dates accurately
      const start = new Date(e.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(e.endDate);
      end.setHours(23, 59, 59, 999);
      
      return day >= start && day <= end;
    });

    if (!event) return null;

    const start = new Date(event.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(event.endDate);
    end.setHours(23, 59, 59, 999);

    const isStart = isSameDay(day, start);
    const isEnd = isSameDay(day, end);
    const isStartOfWeekDay = day.getDay() === 0; // Sunday
    
    // Determine if we should show the label (on the start day, or start of a new week if the event spans multiple weeks)
    const showLabel = isStart || isStartOfWeekDay;

    return { event, isStart, isEnd, showLabel };
  };

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const EVENT_COLORS = [
    "bg-indigo-500", "bg-emerald-500", "bg-amber-500", 
    "bg-rose-500", "bg-purple-500", "bg-sky-500"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${tripId}`}>
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <span className="font-semibold text-lg tracking-tight text-zinc-900">Calendar View</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-lg h-9 shadow-sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
          
          {/* Calendar Header */}
          <div className="p-6 flex items-center justify-between border-b border-zinc-100">
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-indigo-500" />
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shadow-sm" onClick={handlePrevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shadow-sm" onClick={handleNextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 bg-zinc-100 gap-px">
            {/* Weekday Headers */}
            {WEEKDAYS.map((day) => (
              <div key={day} className="bg-zinc-50/80 py-3 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {day}
              </div>
            ))}

            {/* Days */}
            {daysInGrid.map((day, dayIdx) => {
              const evtData = getEventData(day);
              
              // Map an event to a consistent color based on its ID
              let colorClass = "bg-indigo-500";
              if (evtData && events) {
                const idx = events.findIndex(e => e.id === evtData.event.id);
                colorClass = EVENT_COLORS[idx % EVENT_COLORS.length];
              }

              return (
                <div 
                  key={day.toISOString()} 
                  className={`bg-white min-h-[120px] p-2 flex flex-col transition-colors ${!isSameMonth(day, monthStart) ? 'bg-zinc-50/50' : ''}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isSameDay(day, new Date()) ? 'bg-indigo-600 text-white' : 'text-zinc-700'}`}>
                      {format(day, "d")}
                    </span>
                  </div>
                  
                  {evtData && (
                    <div className="mt-1 flex-1">
                      <div 
                        className={`h-8 flex items-center px-3 ${colorClass} text-white text-xs font-bold shadow-sm z-10 relative
                          ${evtData.isStart ? 'rounded-l-lg ml-1' : '-ml-2'}
                          ${evtData.isEnd ? 'rounded-r-lg mr-1' : '-mr-2'}
                          ${!evtData.isStart && !evtData.isEnd ? 'border-y border-transparent' : ''}
                        `}
                      >
                        {evtData.showLabel && (
                          <span className="truncate drop-shadow-sm uppercase tracking-wide">
                            {evtData.event.cityName}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
