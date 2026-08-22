"use client";

import { motion } from "motion/react";
import { DollarSign } from "lucide-react";

export default function BudgetPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 mb-8 shadow-sm"
          >
            <DollarSign className="h-10 w-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-zinc-900 mb-4"
          >
            Budget Planner
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-zinc-500 max-w-md mx-auto"
          >
            Keep track of your travel expenses and manage your budget effortlessly. This feature is coming soon!
          </motion.p>
        </div>
      </main>
    </div>
  );
}
