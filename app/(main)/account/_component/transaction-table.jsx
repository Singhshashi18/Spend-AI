'use client'
import { bulkDeleteTransactions } from '@/action/account'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/category'
import useFetch from '@/hooks/usefetch'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const RecurringInterval={
     DAILY:'Daily',
     WEEKLY:"Weekly",
     MONTHLY:"Monthly",
     YEARLY:"Yearly",
};

const TransactionTable= ({transactions}) => {
  const router=useRouter();

  const [selectIds,setSelectIds]=useState([]);
  
  const [sortedConfig,setSortedConfig]=useState({
    field:'date',
    direction:"desc"
  });

  const [searchTerm,setSearchTerm]=useState("");
 const [typeFilter,setTypeFilter]=useState("");
const [recurringFilter,setRecurringFilter]=useState("");

    const filteredAndSortedTransaction=useMemo(()=>{
      let result=[...transactions];

      if(searchTerm){
        const searchLower=searchTerm.toLowerCase();
        result=result.filter((transaction)=>
        transaction.description?.toLowerCase().includes(searchLower)
      );
      }

      if(recurringFilter){
       result=result.filter((transaction)=>{
        if(recurringFilter === 'recurring') return transaction.isRecurring;
        return !transaction.isRecurring;
       })
      }

      if(typeFilter){
        result=result.filter((transaction)=>transaction.type === typeFilter);
      }

      result.sort((a,b)=>{
        let comparison=0;

        switch(sortedConfig.field){
          case 'date':
            comparison=new Date(a.date) - new Date(b.date);
            break;

              case 'amount':
            comparison=a.amount-b.amount;
            break;

            case 'category':
              comparison=a.category.localCompare(b.category);

            default:
              comparison=0;

        }
        return sortedConfig.direction === 'asc'?comparison: -comparison;
      })



      return result;
    },[transactions,searchTerm,typeFilter,recurringFilter,sortedConfig]);


    const handleSort=({field})=>{
      setSortedConfig((current)=>({
        field,
        direction:
        current.field == field && current.direction === 'asc' ?'desc':'asc',
      }));

    };
    const handleSelect=(id)=>{
      setSelectIds((current)=>current.includes(id)?
      current.filter((item)=>item!=id):
      [...current,id])

    };
      const handleSelectAll=()=>{
        setSelectIds((current)=>
          current.length === filteredAndSortedTransaction.length
        ?
     []
      :
      filteredAndSortedTransaction.map((transaction)=>transaction.id));
      }


      const {
        loading:deleteLoading,
        fn:deleteFn,
        data:deleted,
      }=useFetch(bulkDeleteTransactions);

     const handleBulkDelete=async()=>{
       if(!window.confirm(
        `Are you sure to  delete ${selectIds.length} transactions?`
       )

      ) {
        return;
      }
      deleteFn(selectIds);
     }
      
     useEffect(()=>{
      if(deleted && !deleteLoading){
        toast.error('transaction deleted successfully')
      }
     },[deleted,deleteLoading]);





     const handleClearFilters=()=>{
      setSearchTerm("");
      setTypeFilter("");
      setRecurringFilter("");
      setSelectIds([]);
     }
  return (
    <div className='space-y-4'>
      {deleteLoading && (
        <BarLoader className='mt-4' width={'100'} color='#933ea'/>)}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2 top-3 h-4 w-4 text-muted-foreground'/>
          <Input 
          placeholder='search transactions...'
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          className='pl-8'/>
        </div>

        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder='All Types'/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='INCOME'>Income</SelectItem>
              <SelectItem value='EXPENSE'>Expense</SelectItem>
            </SelectContent>
          </Select>

                    <Select value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='All Transactions'/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='recurring'>Recurring Only</SelectItem>
              <SelectItem value='non-recurring'>Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectIds.length > 0 && (
            <div className='flex items-center gap-2'>
              <Button variant='outline' className='bg-red-600 text-white' size='sm' onClick={handleBulkDelete}>
                <Trash className='h-4 w-4 mr-2'/>
                Delete Selected 
                ({selectIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant='outline' 
            size='icon' 
            onClick={handleClearFilters} 
            title='clear filters'>
              <X className='h-4 w-5'/>
            </Button>
          )}

        </div>
      </div>
      
      <div className='rounded-md border'>
      <Table>

        <TableHeader>
            <TableRow>
                <TableHead className='w[50px]'>
                    <Checkbox 
                    onCheckedChange={handleSelectAll}
                    checked={
                      selectIds.length === 
                      filteredAndSortedTransaction.length && 
                      filteredAndSortedTransaction.length>0
                    }
                    />
                </TableHead>

                <TableHead className='cursor-pointer' onClick={()=>handleSort('date')}>
                  <div className='flex items-center'>Date{''}

                    {sortedConfig.field === 'date' &&
                    (sortedConfig.direction === 'asc'? (
                      <ChevronUp className='ml-1 h-4 w-4 '/>
                    ) :
                    (
                      <ChevronDown className='ml-1 h-4 w-4 '/>
                    )
                  )}
                    </div> 
                </TableHead>

                <TableHead>Description</TableHead>
                <TableHead className='cursor-pointer' onClick={()=>handleSort('category')}>
                   <div className='flex items-center'>Category 

                    {sortedConfig.field === 'category' &&
                    (sortedConfig.direction === 'asc'? (
                      <ChevronUp className='ml-1 h-6 w-6'/>
                    ) :
                    (
                      <ChevronDown className='ml-1 h-4 w-4'/>
                    )
                  )}
                   </div>
                </TableHead>

                <TableHead className='cursor-pointer' onClick={()=>handleSort('amount')}>
                  <div className='flex items-center justify-end'> Amount{''}
                    {sortedConfig.field === 'amount' &&
                    (sortedConfig.direction === 'asc'? (
                      <ChevronUp className='ml-1 h-4 w-4 bg-black'/>
                    ) :
                    (
                      <ChevronDown className='ml-1 h-4 w-4'/>
                    )
                  )}
                  </div>
                </TableHead>

                <TableHead>Recurring</TableHead>
                <TableHead className='w-[50px]'/>




            </TableRow>
        </TableHeader>
        <TableBody>
        
            {filteredAndSortedTransaction?.length === 0?(
                <TableRow>
                    <TableCell colSpan={7} className='text-center text-muted-foreground'>
                        No Transaction found
                    </TableCell>
                </TableRow>

            ):(
                filteredAndSortedTransaction?.map((transaction)=>(
                <TableRow key={transaction.id}>
            <TableCell >
                <Checkbox onCheckedChange={()=>handleSelect(transaction.id)}
                checked={selectIds.includes(transaction.id)}
                />
            </TableCell>
            <TableCell>{format(new Date(transaction.date),'pp')}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell className='capitalize'>
              <span 
              style={{
                background:categoryColors[transaction.category]
              }}
              className='px-2 py-1 rounded text-white text-sm'
              >
              {transaction.category}
              </span>
</TableCell>
          
          <TableCell className='text-right font-medium' 
          style={{
            color:transaction.type === 'EXPENSE'?'red':"green",
          }}
          >
            {transaction.type === 'EXPENSE' ? '-':"+"}
            ${transaction.amount.toFixed(2)}</TableCell>

            <TableCell>{transaction.isRecurring?(
              <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge className='gap-1 bg-purple-100  text-purple-700 hover:bg-purple-200' variant='outline'>
                <RefreshCw className='h-3 w-3'/>
                {RecurringInterval[transaction.recurringInterval]}</Badge>
                </TooltipTrigger>
                <TooltipContent className='bg-black text-white'>
                  <div >
                    <div>Next Date:</div>
                    <div>{format(new Date(transaction.nextRecurringDate),'pp')}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
              </TooltipProvider>
            ) : ( 
              <Badge className='gap-1 bg-black text-white' variant='outline'>
                <Clock className='h-3 w-3'/>
                one-time</Badge>
            )}
            </TableCell>

            <TableCell >
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='H-4 W-4'/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-white text-black'>
                  <DropdownMenuItem className='border rounded-md border-black' 
                  onClick={()=>(
                    router.push(
                      `/transaction/create?edit=${transaction.id}`
                    )
                  )}
                  >Edit</DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem className='text-red-600'
                  onClick={()=>deleteFn([transaction.id])}
                  >Delete</DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
        </TableRow>
                ))

            )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

export default TransactionTable
