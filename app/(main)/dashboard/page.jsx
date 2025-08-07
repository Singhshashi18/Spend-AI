import React, { Suspense } from 'react'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getDashboardData, getUserAccounts } from '@/action/dashboard'
import { AccountCard } from './_components/account-card'
import { getCurrentBudget } from '@/action/budget'
import BudgetProgress from './_components/budget-progress'
import { DashboardOverview } from './_components/dashboard-overview'
  async function  DashboardPage () {
  const  accounts=await getUserAccounts();

  const defaultAccount=accounts?.find((account)=>account.isDefault);

  let budgetData=null;
  if(defaultAccount){
    budgetData=await getCurrentBudget(defaultAccount.id);
  }

  const transactions=await getDashboardData();
  return (
    <div className='space-y-8'>

       {defaultAccount && (
        <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses|| 0}
        />
       )}

         <Suspense fallback={'loading overview'}>
         <DashboardOverview
         accounts={accounts}
         transactions={transactions || []}
         />
         </Suspense>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer>
         <Card className="hover:shadow-lg transition-shadow cursor-pointer border-b-4 border-gray-400">
          <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
           <Plus className='h-10 w-10 mb-2'/>
           <p className='text-sm font-bold' >Add New Account</p>
          </CardContent>
         </Card>
        </CreateAccountDrawer>

        {accounts.length > 0 && 
        accounts?.map((account)=>{
          return <AccountCard key={account.id} account={account}/>;
        })}
      </div>
    </div>
  )
}

export default DashboardPage
