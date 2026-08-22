"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Users, MapPin, Activity, TrendingUp } from "lucide-react";
import { useAdminUsersQuery, usePopularCitiesQuery, usePopularActivitiesQuery } from "@/api/useAdmin";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");

  const { data: usersList, isLoading: isUsersLoading } = useAdminUsersQuery();
  const { data: popularCities, isLoading: isCitiesLoading } = usePopularCitiesQuery();
  const { data: popularActivities, isLoading: isActivitiesLoading } = usePopularActivitiesQuery();

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

  const renderPopularList = (items: any[] | undefined, isLoading: boolean, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-zinc-200" />
              <div className="flex-1 h-5 bg-zinc-200 rounded" />
              <div className="w-16 h-5 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      );
    }
    if (!items || items.length === 0) {
      return (
        <div className="p-12 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
          <p className="text-zinc-500 font-medium">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-500'}`}>
              #{idx + 1}
            </div>
            <div className="flex-1 font-semibold text-zinc-900">{item.name}</div>
            <Badge variant="secondary" className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-100">
              Score: {item.popularityScore}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

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
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-lg text-zinc-900">All Users</h3>
                <Badge variant="secondary" className="rounded-full px-3 py-1 bg-white border-zinc-200 text-zinc-600">
                  {usersList?.length || 0} Total
                </Badge>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent border-zinc-100">
                      <TableHead className="font-semibold text-zinc-600 py-4 pl-6">Name</TableHead>
                      <TableHead className="font-semibold text-zinc-600 py-4">Email</TableHead>
                      <TableHead className="font-semibold text-zinc-600 py-4">Role</TableHead>
                      <TableHead className="font-semibold text-zinc-600 py-4 text-center">Trips</TableHead>
                      <TableHead className="font-semibold text-zinc-600 py-4 text-right pr-6">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isUsersLoading ? (
                      [1, 2, 3].map((i) => (
                        <TableRow key={i} className="animate-pulse">
                          <TableCell className="pl-6 py-4"><div className="h-4 bg-zinc-100 rounded w-32" /></TableCell>
                          <TableCell><div className="h-4 bg-zinc-100 rounded w-48" /></TableCell>
                          <TableCell><div className="h-5 bg-zinc-100 rounded-full w-16" /></TableCell>
                          <TableCell><div className="h-4 bg-zinc-100 rounded w-8 mx-auto" /></TableCell>
                          <TableCell className="pr-6 text-right"><div className="h-4 bg-zinc-100 rounded w-24 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : usersList?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      usersList?.map((u) => (
                        <TableRow key={u.id} className="hover:bg-zinc-50/80 transition-colors border-zinc-100">
                          <TableCell className="font-medium text-zinc-900 pl-6 py-4">
                            {u.firstName} {u.lastName}
                          </TableCell>
                          <TableCell className="text-zinc-600 py-4">{u.email}</TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-xs font-semibold ${u.role === 'ADMIN' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : 'border-zinc-200 text-zinc-600 bg-zinc-50'}`}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-zinc-700 font-medium py-4">
                            {u.tripCount}
                          </TableCell>
                          <TableCell className="text-right text-zinc-500 py-4 pr-6 whitespace-nowrap">
                            {format(new Date(u.joinedDate), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cities" className="mt-8">
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-zinc-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-indigo-500" />
                  Popular Cities
                </h3>
              </div>
              {renderPopularList(popularCities, isCitiesLoading, "No popular cities data available.")}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-8">
            <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-zinc-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-500" />
                  Popular Activities
                </h3>
              </div>
              {renderPopularList(popularActivities, isActivitiesLoading, "No popular activities data available.")}
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
