


'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Pencil, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import useFetch from '@/hooks/usefetch';
import { updateBudget } from '@/action/budget';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const {
    loading: isLoading,
    fn: updatedBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updatedBudgetFn(amount);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || '');
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="transition-transform duration-300"
    >
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col items-center justify-between pb-2">
          <div className="flex-1 w-full flex justify-between items-center">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Monthly Budget
            </CardTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-28 bg-slate-800 border border-slate-600 text-white"
                    placeholder="Enter amount"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={isLoading}>
                    <Check className="h-5 w-5 text-green-400" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isLoading}>
                    <X className="h-5 w-5 text-red-400" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription className="text-sm text-gray-300">
                    {initialBudget
                      ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent`
                      : 'No budget set'}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-slate-700 rounded-full"
                  >
                    <Pencil className="h-4 w-4 text-blue-400" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {initialBudget && (
            <div className="space-y-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentUsed}%` }}
                transition={{ duration: 0.8 }}
              >
                <Progress
                  value={percentUsed}
                  extraStyles={`${
                    percentUsed >= 90
                      ? 'bg-red-500'
                      : percentUsed >= 75
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  className="h-3 rounded-full"
                />
              </motion.div>
              <p className="text-xs text-gray-400 text-right">
                {percentUsed.toFixed(1)}% used
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BudgetProgress;
