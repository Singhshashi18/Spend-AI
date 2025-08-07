"use client";

import { ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

//   const {
//     loading: updateDefaultLoading,
//     fn: updateDefaultFn,
//     data: updatedAccount,
//     error,
//   } = useFetch(updateDefaultAccount);

//   const handleDefaultChange = async (event) => {
//     event.preventDefault(); // Prevent navigation

//     if (isDefault) {
//       toast.warning("You need atleast 1 default account");
//       return; // Don't allow toggling off the default account
//     }

//     await updateDefaultFn(id);
//   };

//   useEffect(() => {
//     if (updatedAccount?.success) {
//       toast.success("Default account updated successfully");
//     }
//   }, [updatedAccount]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to update default account");
//     }
//   }, [error]);

  return (
    <Card className="hover:shadow-lg transition-shadow group relative border-b-4 border-gray-400">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold capitalize">
            {name}
          </CardTitle>

        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-s text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center mt-3">
            <ArrowUpRight className="mr-1 h-6 w-6 text-green-700" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-6 w-6 text-red-700" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}