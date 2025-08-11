

"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const recentTransactions = accountTransactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">
              Recent Transactions
            </CardTitle>
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger className="w-[150px] bg-white/50 backdrop-blur-md">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent className="bg-white/80 backdrop-blur-lg">
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No recent transactions
                </p>
              ) : (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-white/40 p-3 rounded-lg hover:bg-white/60 transition-colors duration-300"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description || "Untitled Transaction"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "PP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center font-semibold",
                          transaction.type === "EXPENSE"
                            ? "text-red-500 animate-pulse"
                            : "text-green-500 animate-pulse"
                        )}
                      >
                        {transaction.type === "EXPENSE" ? (
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                        )}
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Expense Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Monthly Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-5">
            {pieChartData.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No expenses this month
              </p>
            ) : (
              <motion.div
                className="h-[300px]"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: $${value.toFixed(2)}`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
