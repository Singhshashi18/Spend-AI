// "use client";

// import { useState, useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { format, subDays, startOfDay, endOfDay } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const DATE_RANGES = {
//   "7D": { label: "Last 7 Days", days: 7 },
//   "1M": { label: "Last Month", days: 30 },
//   "3M": { label: "Last 3 Months", days: 90 },
//   "6M": { label: "Last 6 Months", days: 180 },
//   ALL: { label: "All Time", days: null },
// };

// export default function AccountChart({ transactions }) {
//   const [dateRange, setDateRange] = useState("1M");

//   const filteredData = useMemo(() => {
//     const range = DATE_RANGES[dateRange];
//     const now = new Date();
//     const startDate = range.days
//       ? startOfDay(subDays(now, range.days))
//       : startOfDay(new Date(0));

    
//     const filtered = transactions.filter(
//       (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
//     );

  
//     const grouped = filtered.reduce((acc, transaction) => {
//       const date = format(new Date(transaction.date), "MMM dd");
//       if (!acc[date]) {
//         acc[date] = { date, income: 0, expense: 0 };
//       }
//       if (transaction.type === "INCOME") {
//         acc[date].income += transaction.amount;
//       } else {
//         acc[date].expense += transaction.amount;
//       }
//       return acc;
//     }, {});

    
//     return Object.values(grouped).sort(
//       (a, b) => new Date(a.date) - new Date(b.date)
//     );
//   }, [transactions, dateRange]);

//   const totals = useMemo(() => {
//     return filteredData.reduce(
//       (acc, day) => ({
//         income: acc.income + day.income,
//         expense: acc.expense + day.expense,
//       }),
//       { income: 0, expense: 0 }
//     );
//   }, [filteredData]);

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
//         <CardTitle className="text-base font-normal">
//           Transaction Overview
//         </CardTitle>
//         <Select defaultValue={dateRange} onValueChange={setDateRange}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Select range" />
//           </SelectTrigger>
//           <SelectContent>
//             {Object.entries(DATE_RANGES).map(([key, { label }]) => (
//               <SelectItem key={key} value={key}>
//                 {label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent>
//         <div className="flex justify-around mb-6 text-sm">
//           <div className="text-center">
//             <p className="text-muted-foreground">Total Income</p>
//             <p className="text-lg font-bold text-green-500">
//               ${totals.income.toFixed(2)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-muted-foreground">Total Expenses</p>
//             <p className="text-lg font-bold text-red-500">
//               ${totals.expense.toFixed(2)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-muted-foreground">Net</p>
//             <p
//               className={`text-lg font-bold ${
//                 totals.income - totals.expense >= 0
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//             >
//               ${(totals.income - totals.expense).toFixed(2)}
//             </p>
//           </div>
//         </div>
//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={filteredData}
//               margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis
//                 dataKey="date"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `$${value}`}
//               />
//               <Tooltip
//                 formatter={(value) => [`$${value}`, undefined]}
//                 contentStyle={{
//                   backgroundColor: "hsl(var(--popover))",
//                   border: "1px solid hsl(var(--border))",
//                   borderRadius: "var(--radius)",
//                 }}
//               />
//               <Legend />
//               <Bar
//                 dataKey="income"
//                 name="Income"
//                 fill="#22c55e"
//                 radius={[4, 4, 0, 0]}
//               />
//               <Bar
//                 dataKey="expense"
//                 name="Expense"
//                 fill="#ef4444"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }




"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export default function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const [animatedTotals, setAnimatedTotals] = useState({
    income: 0,
    expense: 0,
    net: 0,
  });

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // Animate totals smoothly
  useEffect(() => {
    let start = { ...animatedTotals };
    let end = {
      income: totals.income,
      expense: totals.expense,
      net: totals.income - totals.expense,
    };
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 500, 1);

      setAnimatedTotals({
        income: start.income + (end.income - start.income) * progress,
        expense: start.expense + (end.expense - start.expense) * progress,
        net: start.net + (end.net - start.net) * progress,
      });

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [totals]);

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-2xl p-4 transition-all duration-500 hover:scale-[1.01]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px] bg-gray-800 text-white border-gray-600 hover:border-green-400 transition">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border-gray-700">
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem
                key={key}
                value={key}
                className="hover:bg-green-500/20 cursor-pointer"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {/* Totals */}
        <div className="flex justify-around mb-6 text-sm">
          {[
            { label: "Total Income", value: animatedTotals.income, color: "text-green-400" },
            { label: "Total Expenses", value: animatedTotals.expense, color: "text-red-400" },
            { label: "Net", value: animatedTotals.net, color: animatedTotals.net >= 0 ? "text-green-400" : "text-red-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center px-4 py-2 rounded-xl bg-gray-800/50 shadow-md hover:shadow-green-500/20 transition-all duration-300"
            >
              <p className="text-gray-400">{item.label}</p>
              <p className={`text-xl font-bold ${item.color}`}>
                ${item.value.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="#ccc"
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                stroke="#ccc"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  border: "1px solid #4ade80",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ color: "#ccc" }} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
