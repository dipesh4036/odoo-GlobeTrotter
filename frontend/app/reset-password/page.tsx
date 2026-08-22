"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { Suspense, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useResetPasswordMutation, resetPasswordSchema } from "@/api/useAuth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { mutateAsync: resetPassword } = useResetPasswordMutation();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      await resetPassword({
        token: values.token,
        newPassword: values.newPassword,
      });
      
      toast.success("Password reset successfully. You can now log in.");
      router.push("/login");
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Invalid or expired token, request a new link.");
      } else {
        toast.error("An error occurred during password reset. Please try again.");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Hidden token field */}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                New Password
              </FormLabel>
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 font-medium text-xs uppercase tracking-wider">
                Confirm Password
              </FormLabel>
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
              Resetting...
            </>
          ) : (
            <>
              Reset password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
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
            <LockKeyhole className="text-white w-6 h-6" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Set new password</h1>
          <p className="text-sm text-zinc-500 max-w-[16rem]">
            Please enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Remembered your password?{" "}
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
