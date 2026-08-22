"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, PlaneTakeoff, Camera } from "lucide-react";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation, registerSchema } from "@/api/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { mutateAsync: register } = useRegisterMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      additionalInfo: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await register(values);
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Email already registered");
      } else {
        toast.error("An error occurred during registration. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/auth-bg.jpg"
          alt="Abstract Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-10 bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl relative z-10 mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-md shrink-0"
            >
              <PlaneTakeoff className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create account</h1>
              <p className="text-sm text-zinc-500">Join GlobeTrotter today.</p>
            </div>
          </div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="w-14 h-14 bg-zinc-100 border border-dashed border-zinc-300 rounded-full flex items-center justify-center text-zinc-400 relative overflow-hidden group cursor-pointer hover:bg-zinc-50 transition-colors shrink-0"
          >
             <Camera className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
             <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-medium uppercase tracking-wider text-zinc-600 bg-white/80 px-1.5 py-0.5 rounded-full backdrop-blur-sm">Add</span>
             </div>
          </motion.div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">First Name</FormLabel>
                    <FormControl>
                      <input placeholder="Jane" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">Last Name</FormLabel>
                    <FormControl>
                      <input placeholder="Doe" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">Email</FormLabel>
                    <FormControl>
                      <input type="email" placeholder="jane@example.com" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">Password</FormLabel>
                    <FormControl>
                      <input type="password" placeholder="••••••••" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">City</FormLabel>
                    <FormControl>
                      <input placeholder="San Francisco" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-[11px] uppercase tracking-wider">Country</FormLabel>
                    <FormControl>
                      <input placeholder="United States" className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500" {...field} />
                    </FormControl>
                    <FormMessage className="text-[10px] text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <motion.button
              type="submit"
              disabled={form.formState.isSubmitting}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-11 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </Form>

        <div className="mt-6 text-center text-[13px] text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 hover:underline transition-all">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
