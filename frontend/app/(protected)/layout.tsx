"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NavBar } from "@/components/NavBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full p-8 gap-4">
        <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return null; // Don't flash content while redirecting
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
