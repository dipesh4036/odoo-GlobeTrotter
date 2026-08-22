"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Compass, 
  Bell, 
  User as UserIcon,
  Home,
  MapPin,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "My Trips", href: "/trips", icon: MapPin },
  { name: "Explore", href: "/community", icon: Compass },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

export function NavBar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316] text-white shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-900 hidden sm:inline-block">
            GlobeTrotter
          </span>
        </Link>

        {/* Central Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-1 sm:space-x-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-colors hover:text-zinc-900",
                  isActive ? "text-zinc-900" : "text-zinc-500"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-[#F97316]" : "text-zinc-400")} />
                <span className="hidden lg:inline-block">{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-[-16px] left-0 w-full h-0.5 bg-[#F97316]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-lg border-zinc-200 mt-2 p-0">
              <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900">Notifications</h3>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">2 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-4 py-3 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <p className="text-sm text-zinc-800 font-medium">Trip to Paris</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Your itinerary is ready to review.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">2 hours ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors">
                  <p className="text-sm text-zinc-800 font-medium">Price Drop Alert</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Flights to Tokyo have dropped by 15%.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">1 day ago</p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-zinc-100 text-center">
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Mark all as read</button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 cursor-pointer hover:bg-zinc-200 transition-colors">
                {user?.firstName ? (
                  <span className="text-xs font-semibold text-zinc-700">
                    {user.firstName[0].toUpperCase()}{user.lastName ? user.lastName[0].toUpperCase() : ''}
                  </span>
                ) : (
                  <UserIcon className="h-4 w-4 text-zinc-700" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-zinc-200 mt-2">
              <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                <p className="text-sm font-medium text-zinc-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = "/profile";
                }}
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                onClick={async () => {
                  try {
                    await fetch("http://localhost:5001/api/auth/logout", { method: "POST", credentials: "include" });
                    window.location.href = "/login";
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
      </div>
    </header>
  );
}
