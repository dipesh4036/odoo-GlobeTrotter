import { Trip } from "@/api/useTrips";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Edit3, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function TripCard({ 
  trip, 
  onCancel, 
  onDelete 
}: { 
  trip: Trip; 
  onCancel?: (trip: Trip) => void; 
  onDelete?: (trip: Trip) => void;
}) {
  return (
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
          {(trip.status === "ONGOING" || trip.status === "UPCOMING") && onCancel && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              onClick={() => onCancel(trip)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
              onClick={() => onDelete(trip)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
