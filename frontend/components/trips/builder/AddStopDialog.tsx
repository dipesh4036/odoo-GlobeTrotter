"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCitiesQuery } from "@/api/useCities";
import { useTripByIdQuery } from "@/api/useTrips";
import { useAddStopMutation } from "@/hooks/useTripBuilder";
import { Plus } from "lucide-react";

export default function AddStopDialog({ tripId, children }: { tripId: string, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: cities } = useCitiesQuery();
  const { data: trip } = useTripByIdQuery(tripId);
  const { mutateAsync: addStop, isPending } = useAddStopMutation(tripId);
  
  const [cityId, setCityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId || !startDate || !endDate) return;
    
    try {
      await addStop({ 
        cityId, 
        startDate: new Date(startDate), 
        endDate: new Date(endDate) 
      });
      setOpen(false);
      setCityId("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      // toast is handled in the mutation
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a City Stop</DialogTitle>
          {trip && (
            <p className="text-sm text-zinc-500">
              Trip dates: {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
            </p>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select City</label>
            <select 
              value={cityId} 
              onChange={(e) => setCityId(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
              required
            >
              <option value="" disabled>Choose a destination...</option>
              {cities?.map(city => (
                <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input 
                type="date" 
                value={startDate} 
                min={trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : undefined}
                max={trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : undefined}
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Input 
                type="date" 
                value={endDate} 
                min={startDate || (trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : undefined)}
                max={trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : undefined}
                onChange={(e) => setEndDate(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isPending || !cityId || !startDate || !endDate}>
              {isPending ? "Adding..." : "Add Stop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
