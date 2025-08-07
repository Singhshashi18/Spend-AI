import { getUserAccounts } from "@/action/dashboard";
import { defaultCategories } from "@/data/category";
import { AddTransactionForm } from "../components/transaction-form";
import { getTransaction } from "@/action/transaction";
export default async function AddTransactionPage({searchParams}) {
  const accounts = await getUserAccounts();
  const editId = await searchParams?.e
  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-32 py-36">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{editId?"Edit":'Add'} Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}