"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ArrowRight, Loader2, KeyRound, Copy, CheckCircle2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPasswordMutation, forgotPasswordSchema } from "@/api/useAuth";

export default function ForgotPasswordPage() {
  const { mutateAsync: forgotPassword } = useForgotPasswordMutation();
  const [devToken, setDevToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setDevToken(null);
      const response = await forgotPassword(values);
      
      // Generic success message as per security best practices
      toast.success("If that email exists, a reset link has been sent");

      // For hackathon demo: display token if backend provides it
      if (response?.token) {
        setDevToken(response.token);
      }
    } catch (error) {
      toast.success("If that email exists, a reset link has been sent");
    }
  }

  const copyToClipboard = () => {
    if (devToken) {
      navigator.clipboard.writeText(devToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Token copied to clipboard");
    }
  };

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
          ease: [0.23, 1, 0.32, 1],
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
            <KeyRound className="text-white w-6 h-6" />
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Reset password</h1>
          <p className="text-sm text-zinc-500 max-w-[16rem]">
            Enter your email and we'll send you a link to reset your password.
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
                  Sending link...
                </>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </Form>

        {devToken && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 p-4 bg-zinc-100 rounded-xl border border-zinc-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Dev only</span>
              <span className="text-[10px] text-zinc-500">This would be emailed in production</span>
            </div>
            
            <div className="relative">
              <pre className="bg-zinc-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto pr-10">
                {devToken}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute right-2 top-2 p-1 text-zinc-400 hover:text-white transition-colors bg-zinc-800 rounded-md"
                title="Copy token"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href={`/reset-password?token=${devToken}`}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
              >
                Continue to reset password
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center text-sm text-zinc-500">
          Remember your password?{" "}
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
