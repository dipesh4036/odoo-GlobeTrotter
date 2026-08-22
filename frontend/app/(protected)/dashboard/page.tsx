"use client";

import { motion } from "motion/react";
import { 
  Search, 
  ListFilter, 
  ArrowUpDown, 
  Layers,
  MapPin,
  Compass,
  Bell,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCitiesQuery } from "@/api/useCities";
import { useTripsQuery } from "@/api/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

function PreviousTrips() {
  const { data: trips, isLoading } = useTripsQuery("COMPLETED");
  
  // Filter out any accidentally returned CANCELLED trips just to be safe,
  // and take up to 3 trips.
  const displayTrips = (trips || [])
    .filter((trip) => trip.status !== "CANCELLED")
    .slice(0, 3);

  return (
    <section className="mt-12 relative pb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Previous Trips
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : displayTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="h-16 w-full bg-zinc-100 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${trip.coverPhotoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <h3 className="font-semibold text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">
                    {trip.name}
                  </h3>
                  <div className="mt-2 text-xs text-zinc-500 font-medium">
                    {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-zinc-200 rounded-2xl text-center">
          <p className="text-sm text-zinc-500">No previous trips found.</p>
        </div>
      )}

    </section>
  );
}

function FloatingAddButton() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link href="/trips/new">
        <Button className="h-14 px-6 rounded-full shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-1 transition-all bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-base border border-orange-400/30">
          <span className="text-xl font-normal mr-1">+</span> Plan a Trip
        </Button>
      </Link>
    </motion.div>
  );
}

function TopRegionalSelections() {
  const { data: cities, isLoading } = useCitiesQuery();
  const displayCities = cities?.slice(0, 5) || [];

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
          Top Regional Selections
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {displayCities.map((city) => (
            <motion.div
              key={city.id}
              whileHover={{ y: -4 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-zinc-200/50 bg-zinc-100"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${city.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop'})` 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <p className="text-white font-medium truncate">{city.name}</p>
                <p className="text-zinc-300 text-xs truncate">{city.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-sm group bg-zinc-900 border border-zinc-200"
        >
          {/* Abstract Placeholder Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-zinc-900 to-rose-500/20 mix-blend-overlay" />
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
            >
              Where to next, {user?.firstName || 'Explorer'}?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-zinc-300 max-w-lg text-sm sm:text-base font-medium"
            >
              Discover new horizons, plan your itineraries, and keep track of your worldly adventures.
            </motion.p>
          </div>
        </motion.div>

        {/* Search & Controls Row */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-8"
        >
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              type="text" 
              placeholder="Search destinations, trips, or activities..." 
              className="w-full pl-10 pr-4 h-11 bg-white border-zinc-200 shadow-sm rounded-xl focus-visible:ring-indigo-500/30 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-sm gap-2 px-4 text-sm font-medium hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                <Layers className="h-4 w-4 text-zinc-400" />
                Group by
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem>Status</DropdownMenuItem>
                <DropdownMenuItem>Region</DropdownMenuItem>
                <DropdownMenuItem>Year</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-sm gap-2 px-4 text-sm font-medium hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                <ListFilter className="h-4 w-4 text-zinc-400" />
                Filter
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem>Upcoming</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Starred</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-white border border-zinc-200 text-zinc-700 shadow-sm gap-2 px-4 text-sm font-medium hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">
                <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                Sort by
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
        </motion.div>

        {/* Top Regional Selections */}
        <TopRegionalSelections />

        {/* Previous Trips Section */}
        <PreviousTrips />

        {/* Content Placeholders for future sections */}
        <div className="mt-10 mb-8 border-t border-zinc-100 pt-8" />
        
      </main>

      <FloatingAddButton />
    </div>
  );
}
