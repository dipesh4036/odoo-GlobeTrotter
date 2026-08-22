"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, PlaneTakeoff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid email or password");
        } else {
          toast.error("An error occurred during login");
        }
        return;
      }

      toast.success("Welcome back to GlobeTrotter");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Network error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
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
        className="w-full max-w-md px-6 py-10 sm:px-12 sm:py-12 bg-white/70 backdrop-blur-xl border border-zinc-200/50 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-2 shadow-md"
          >
            <PlaneTakeoff className="text-white w-6 h-6" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Welcome back</h1>
          <p className="text-sm text-zinc-500 max-w-[16rem]">
            Enter your credentials to continue your journey.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      placeholder="name@example.com"
                      className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="w-full h-12 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-zinc-900/10 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 hover:underline transition-all"
          >
            Create one now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
