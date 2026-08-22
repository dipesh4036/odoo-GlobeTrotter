"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, Camera } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden selection:bg-indigo-500/30 py-12">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1], // ease-out-expo
        }}
        className="w-full max-w-2xl px-6 py-10 sm:px-12 sm:py-12 bg-white/70 backdrop-blur-xl border border-zinc-200/50 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] relative z-10 my-8"
      >
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          {/* Circular Photo Placeholder */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-zinc-100 border border-dashed border-zinc-300 rounded-full flex items-center justify-center mb-4 text-zinc-400 relative overflow-hidden group cursor-pointer hover:bg-zinc-50 transition-colors"
          >
             <Camera className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
             <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">Upload</span>
             </div>
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Create an account</h1>
          <p className="text-sm text-zinc-500 max-w-[20rem]">
            Join GlobeTrotter and start organizing your next big adventure.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="Jane"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="Doe"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      Email
                    </FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider flex items-center justify-between">
                      <span>Phone Number</span>
                      <span className="text-zinc-400 normal-case tracking-normal text-[10px]">Optional</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="+1 (555) 000-0000"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      City
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="San Francisco"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      Country
                    </FormLabel>
                    <FormControl>
                      <input
                        placeholder="United States"
                        className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                    Password
                  </FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Additional Information</span>
                    <span className="text-zinc-400 normal-case tracking-normal text-[10px]">Optional</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Tell us a bit about your travel preferences..."
                      className="flex min-h-[80px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />

            <motion.button
              type="submit"
              disabled={form.formState.isSubmitting}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register User
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 hover:underline transition-all"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
