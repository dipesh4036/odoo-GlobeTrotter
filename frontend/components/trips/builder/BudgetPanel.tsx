"use client";

import { useTripBudgetQuery } from "@/api/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function BudgetPanel({ tripId }: { tripId: string }) {
  const { data: budget, isLoading } = useTripBudgetQuery(tripId);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (!budget) return null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-1">Budget Overview</h3>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-sm text-emerald-800 font-medium">Total Projected Cost</p>
          <p className="text-3xl font-display font-bold text-emerald-900 mt-1">
            ${budget.total.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-zinc-500 mb-4">Spend by Category</h4>
        {budget.byCategory.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budget.byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="total"
                  nameKey="category"
                >
                  {budget.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 text-center py-8">Add activities with costs to see the breakdown.</p>
        )}
      </div>
    </div>
  );
}
