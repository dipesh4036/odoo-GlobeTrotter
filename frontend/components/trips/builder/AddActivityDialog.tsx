"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActivitiesQuery } from "@/api/useActivities";
import { useAddActivityMutation } from "@/hooks/useTripBuilder";

export default function AddActivityDialog({ tripId, stop, children }: { tripId: string, stop: any, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: activities } = useActivitiesQuery({ cityId: stop.cityId });
  const { mutateAsync: addActivity, isPending } = useAddActivityMutation(tripId);
  
  const [activityId, setActivityId] = useState("");
  const [dayNumber, setDayNumber] = useState("1");

  const start = new Date(stop.startDate);
  const end = new Date(stop.endDate);
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityId || !dayNumber) return;
    
    try {
      await addActivity({ 
        stopId: stop.id,
        activityId,
        dayNumber: parseInt(dayNumber)
      });
      setOpen(false);
      setActivityId("");
      setDayNumber("1");
    } catch (err) {
      // Error handled by mutation
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="w-full inline-block cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity in {stop.cityName}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Activity</label>
              <select 
                value={activityId} 
                onChange={(e) => setActivityId(e.target.value)}
                className="w-full p-2 border rounded-md bg-white"
                required
              >
                <option value="" disabled>Choose an activity...</option>
                {activities?.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.name} (${act.cost})
                  </option>
                ))}
                {activities?.length === 0 && (
                  <option value="" disabled>No activities available in this city</option>
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Day of Stop</label>
              <select 
                value={dayNumber} 
                onChange={(e) => setDayNumber(e.target.value)}
                className="w-full p-2 border rounded-md bg-white"
                required
              >
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>Day {day}</option>
                ))}
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending || !activityId}>
                {isPending ? "Adding..." : "Add Activity"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
