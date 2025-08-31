
// 'use client';

// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { useRouter, useSearchParams } from 'next/navigation';
// import useFetch from '@/hooks/usefetch';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import CreateAccountDrawer from '@/components/create-account-drawer';
// import { cn } from '@/lib/utils';
// import { createTransaction } from '@/action/transaction';
// import { updateTransaction } from '@/action/transaction';
// import { transactionSchema } from '@/app/lib/schema';
// import { ReceiptScanner } from './reciptscanner';
// import { motion } from 'framer-motion';
// import ReceiptAssistant from './receipt-search';
// import dynamic from 'next/dynamic';
// export function AddTransactionForm({
//   accounts,
//   categories,
//   editMode = false,
//   initialData = null,
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const editId = searchParams?.get('edit');

//   const [showScannerNotice, setShowScannerNotice] = useState(true);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     setValue,
//     getValues,
//     reset,
//   } = useForm({
//     resolver: zodResolver(transactionSchema),
//     defaultValues:
//       editMode && initialData
//         ? {
//             type: initialData.type,
//             amount: initialData.amount.toString(),
//             description: initialData.description,
//             accountId: initialData.accountId,
//             category: initialData.category,
//             date: new Date(initialData.date),
//             isRecurring: !!initialData.isRecurring,
//             ...(initialData.recurringInterval && {
//               recurringInterval: initialData.recurringInterval,
//             }),
//           }
//         : {
//             type: 'EXPENSE',
//             amount: '',
//             description: '',
//             accountId: accounts.find((ac) => ac.isDefault)?.id,
//             date: new Date(),
//             isRecurring: false,
//           },
//   });

//   const {
//     loading: transactionLoading,
//     fn: transactionFn,
//     data: transactionResult,
//     error,
//   } = useFetch(editMode ? updateTransaction : createTransaction);

//   const type = watch('type');
//   const isRecurring = watch('isRecurring');
//   const date = watch('date');

//   const onSubmit = (data) => {
//     const formData = {
//       ...data,
//       amount: parseFloat(data.amount),
//     };

//     if (editMode) {
//       transactionFn(editId, formData);
//     } else {
//       transactionFn(formData);
//     }
//   };

//   const handleScanComplete = (scannedData) => {
//     if (!scannedData) return;
//     if (scannedData.amount != null) setValue('amount', scannedData.amount.toString());
//     if (scannedData.date) setValue('date', new Date(scannedData.date));
//     if (scannedData.description) setValue('description', scannedData.description);
//     if (scannedData.category) setValue('category', scannedData.category);
//     toast.success('Receipt scanned successfully');
//     setShowScannerNotice(false);
//   };

//   useEffect(() => {
//     if (transactionResult?.success && !transactionLoading) {
//       toast.success(editMode ? 'Transaction updated successfully' : 'Transaction created successfully');
//       reset();
//       // navigate to the account page
//       router.push(`/account/${transactionResult.data.accountId}`);
//     }
//   }, [transactionResult, transactionLoading, editMode, reset, router]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || 'Failed to submit transaction');
//     }
//   }, [error]);

//   const filteredCategories = categories.filter((category) => category.type === type);

//   // Format date for button display
//   const formattedDate =
//     date instanceof Date ? format(date, 'PPP') : date ? format(new Date(date), 'PPP') : '';

//     const ReceiptAssistant=dynamic(()=>import('./receipt-search'),{
//       ssr:false
//     })

//   return (
//     <motion.form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-6"
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//     >
//       {/* Receipt Scanner */}
//       {!editMode && (
//         <div className="bg-gradient-to-r from-sky-50 to-white border border-slate-200 rounded-xl p-4">
//           <div className="flex items-start gap-4">
//             <div className="flex-1">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-semibold">Scan receipt to autofill</h3>
//                 <small className="text-xs text-muted-foreground">Fast & convenient</small>
//               </div>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Use the receipt scanner to automatically fill amount, date, category and description.
//               </p>

//               {showScannerNotice && (
//                 <div className="mt-3 text-xs text-muted-foreground">
//                   Tip: For best results, take a clear photo of the whole receipt.
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <ReceiptScanner onScanComplete={handleScanComplete} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Type */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Type</label>
//         <Select onValueChange={(value) => setValue('type', value)} defaultValue={getValues('type')}>
//           <SelectTrigger className="w-full md:w-48 bg-white/60 backdrop-blur-sm border border-slate-200">
//             <SelectValue placeholder="Select type" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             <SelectItem value="EXPENSE">Expense</SelectItem>
//             <SelectItem value="INCOME">Income</SelectItem>
//           </SelectContent>
//         </Select>
//         {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
//       </div>

//       {/* Amount + Account */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Amount</label>
//           <Input
//             {...register('amount')}
//             className={cn(
//               'bg-white/80 border border-slate-200',
//               errors.amount ? 'ring-1 ring-red-400' : 'focus:ring-2 focus:ring-sky-300'
//             )}
//             type="number"
//             step="0.01"
//             placeholder="0.00"
//           />
//           {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">Account</label>
//           <Select onValueChange={(value) => setValue('accountId', value)} defaultValue={getValues('accountId')}>
//             <SelectTrigger className="w-full md:w-auto bg-white/60 backdrop-blur-sm border border-slate-200">
//               <SelectValue placeholder="Select account" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {accounts.map((account) => (
//                 <SelectItem key={account.id} value={account.id}>
//                   {account.name} (${parseFloat(account.balance).toFixed(2)})
//                 </SelectItem>
//               ))}
//               <div className="px-2 pt-2">
//                 <CreateAccountDrawer>
//                   <Button variant="ghost" className="w-full">
//                     Create Account
//                   </Button>
//                 </CreateAccountDrawer>
//               </div>
//             </SelectContent>
//           </Select>
//           {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
//         </div>
//       </div>

//       {/* Category */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Category</label>
//         <Select onValueChange={(value) => setValue('category', value)} defaultValue={getValues('category')}>
//           <SelectTrigger className="w-full bg-white/60 backdrop-blur-sm border border-slate-200">
//             <SelectValue placeholder="Select category" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             {filteredCategories.length === 0 ? (
//               <div className="px-3 py-2 text-sm text-muted-foreground">No categories for this type</div>
//             ) : (
//               filteredCategories.map((category) => (
//                 <SelectItem key={category.id} value={category.id}>
//                   {category.name}
//                 </SelectItem>
//               ))
//             )}
//           </SelectContent>
//         </Select>
//         {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
//       </div>

//       {/* Date with popover + native date input for compatibility */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Date</label>

//         <Popover>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 'w-full pl-3 text-left font-normal flex items-center justify-between',
//                 !date && 'text-muted-foreground'
//               )}
//             >
//               <span>{formattedDate || 'Pick a date'}</span>
//               <CalendarIcon className="ml-3 h-4 w-4" />
//             </Button>
//           </PopoverTrigger>

//           <PopoverContent className="z-[9999] w-auto p-3 bg-white border rounded-md shadow-md">
//             <div className="flex flex-col gap-2">
//               <label className="text-xs text-muted-foreground">Select date</label>
//               <input
//                 type="date"
//                 className="px-3 py-2 border rounded-md"
//                 value={
//                   date
//                     ? typeof date === 'string'
//                       ? date
//                       : format(new Date(date), 'yyyy-MM-dd')
//                     : format(new Date(), 'yyyy-MM-dd')
//                 }
//                 onChange={(e) => setValue('date', new Date(e.target.value))}
//                 max={format(new Date(), 'yyyy-MM-dd')}
//                 min="1900-01-01"
//               />

        

              
//               <div className="flex justify-end">
//   <div
//     role="button"
//     tabIndex={0}
//     onClick={() => {
//       setValue('date', new Date());
//       toast('Reset to today');
//     }}
//     className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 cursor-pointer"
//   >
//     Reset
//   </div>
// </div>



//             </div>
//           </PopoverContent>
//         </Popover>

//         {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="text-sm font-medium">Description</label>
//         <Input
//           {...register('description')}
//           className="bg-white/80 border border-slate-200"
//           placeholder="Enter description"
//         />
//         {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
//       </div>

//       {/* Recurring */}
//       <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
//         <div>
//           <label className="text-base font-medium">Recurring Transaction</label>
//           <div className="text-sm text-muted-foreground">Set up a recurring schedule for this transaction</div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <Switch
//               id="isRecurring"
//               checked={!!isRecurring}
//               onCheckedChange={(checked) => setValue('isRecurring', checked)}
//             />
//             <span className="text-sm text-gray-700">Recurring</span>
//           </div>
//         </div>
//       </div>

//       {/* Recurring Interval */}
//       {isRecurring && (
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Recurring Interval</label>
//           <Select onValueChange={(value) => setValue('recurringInterval', value)} defaultValue={getValues('recurringInterval')}>
//             <SelectTrigger className="w-full bg-white/60 backdrop-blur-sm border border-slate-200">
//               <SelectValue placeholder="Select interval" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="DAILY">Daily</SelectItem>
//               <SelectItem value="WEEKLY">Weekly</SelectItem>
//               <SelectItem value="MONTHLY">Monthly</SelectItem>
//               <SelectItem value="YEARLY">Yearly</SelectItem>
//             </SelectContent>
//           </Select>
//           {errors.recurringInterval && <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>}
//         </div>
//       )}

//       {/* Actions */}
//       <div className="flex gap-4">
//         <Button
//           type="button"
//           variant="outline"
//           className="w-full bg-slate-900 text-white hover:bg-slate-800 transition"
//           onClick={() => router.back()}
//         >
//           Cancel
//         </Button>

//         <Button
//           type="submit"
//           className={cn(
//             'w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold',
//             transactionLoading && 'opacity-80 cursor-not-allowed'
//           )}
//           disabled={transactionLoading}
//         >
//           {transactionLoading ? (
//             <span className="inline-flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               {editMode ? 'Updating...' : 'Creating...'}
//             </span>
//           ) : editMode ? (
//             'Update Transaction'
//           ) : (
//             'Create Transaction'
//           )}
//         </Button>
//       </div>
//       <div>
//        <ReceiptAssistant/>
//       </div>
//     </motion.form>
//   );






// }






"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/usefetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/action/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./reciptscanner";
import { Calendar } from "lucide-react";
import ReceiptAssistant from "./receipt-search";
export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Receipt Scanner - Only show in create mode */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
      <div>
        <ReceiptAssistant/>
      </div>
    </form>

  );
}