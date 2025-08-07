
import { getAccountWithTransactions } from '@/action/account';
import { notFound } from 'next/navigation';
import React from 'react'
import TransactionTable from '../_component/transaction-table';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_component/account-chart';
export default async function AccountsPage ({params})  {
  
  
  const accountData= await getAccountWithTransactions(params.id);
  

  if(!accountData){
    return notFound();
  }
  const {transactions,...account}=accountData;

  return (
    <div className='py-40 space-y-8 '>

      
      <div className='flex gap-4 item-end justify-between'>


      <div>
        <h1 className='text-5xl sm:text-6xl font-bold  gradient-title capitalize'>{account.name}</h1>
        <p className='text-muted-foreground'>
          {account.type.charAt(0)+account.type.slice(1).toLowerCase()}Account
        </p>
      </div>
      

      <div className='text-right pb-2'>
        <div className='text-xl sm:text-2xl font-bold'>${parseFloat(account.balance).toFixed(2)}</div>
        <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions</p>
      </div>
      </div>
       
             <Suspense
      fallback={<BarLoader className='mt-4' width={'100%'} color='#933ea '/>}
      >
    <AccountChart transactions={transactions}/>
      </Suspense>

      <Suspense
      fallback={<BarLoader className='mt-4' width={'100%'} color='#933ea '/>}
      >
        <TransactionTable transactions={transactions}/>
      </Suspense>
    </div>

  )
}


