"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Users, MapPin, Activity, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!isLoading && user && user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || (user && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight text-zinc-900">Admin Dashboard</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-zinc-200/50 p-1 rounded-xl inline-flex overflow-x-auto max-w-full">
            <TabsTrigger value="users" className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </TabsTrigger>
            <TabsTrigger value="cities" className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Popular Cities
            </TabsTrigger>
            <TabsTrigger value="activities" className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4 mr-2" />
              Popular Activities
            </TabsTrigger>
            <TabsTrigger value="trends" className="rounded-lg px-6 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              User Trends & Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-8">
            {/* Manage Users Tab Content */}
            <div className="p-8 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <p className="text-zinc-500 font-medium">Manage Users (WIP)</p>
            </div>
          </TabsContent>

          <TabsContent value="cities" className="mt-8">
            {/* Popular Cities Tab Content */}
            <div className="p-8 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <p className="text-zinc-500 font-medium">Popular Cities (WIP)</p>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-8">
            {/* Popular Activities Tab Content */}
            <div className="p-8 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <p className="text-zinc-500 font-medium">Popular Activities (WIP)</p>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-8">
            {/* User Trends Tab Content */}
            <div className="p-8 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <p className="text-zinc-500 font-medium">User Trends & Analytics (WIP)</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
