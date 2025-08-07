'use client'
import React, { useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { useForm } from 'react-hook-form';
import { accountSchema } from '@/app/lib/schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import {  Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createAccount } from '@/action/dashboard';
import useFetch from '@/hooks/usefetch';
import { useEffect } from 'react';

const CreateAccountDrawer = ({children}) => {
    const [open, setOpen]=useState(false);

    const {register,handleSubmit,formState:{errors},setValue,watch,reset}=useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:"",
            type:"CURRENT",
            balance:"",
            isDefault:false,   
        },
    });

    const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);
      
   
       return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger> {children}</DrawerTrigger>
            <DrawerContent  className='bg-white'>
                <DrawerHeader>
                    <DrawerTitle>Create New Account</DrawerTitle>
                </DrawerHeader>
                <div className='px-4 pb-4 '>
                            
                <form className='space-y-4 ' onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-2'>
                        <label htmlFor='name' className='text-sm font-medium'>
                         Account Name
                        </label>
                        <Input className='bg-white border-black '
                        id='name'
                        placehoder='e.g.,Main Checking'
                        {...register('name')}
                        />
                        {errors.name && (
                            <p className='text-sm text-red-600'>{errors.name.message}</p>
                        )}
                    </div>

                    <div className='space-y-2 '>
                        <label htmlFor='type' className='text-sm font-medium'>
                         Account Type
                        </label>

                        <div className='bg-white border-black'>
                           <Select  className='border-black ' onValueChange={(value)=>setValue('type',value)}
                            defaultValue={watch('type')}>
                            <SelectTrigger id='type' className='border-black'>
                                <SelectValue placehoder='select type' />
                            </SelectTrigger>
                            <SelectContent className='bg-white '>
                                <SelectItem value='CURRENT'>CURRENT</SelectItem>
                              <SelectItem   value='SAVING'>SAVINGS</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        

                        {errors.name && (
                            <p className='text-sm text-red-600'>{errors.name.message}</p>
                        )}
                    </div>

                                        <div className='space-y-2'>
                        <label htmlFor='balance' className='text-sm font-medium'>
                         Initial Value 
                        </label>
                        <Input className='bg-white border-black '
                        id='balance'
                        type='number'
                        step='0.01'
                        placehoder='0.00'
                        {...register('balance')}
                        />
                        {errors.balance && (
                            <p className='text-sm text-red-600'>{errors.balance.message}</p>
                        )}
                    </div>
                  
                  <div className='bg-white border-black space-y-2 flex items-center justify-between rounded-lg border p-3'>
                        <div className='space-y-0.5'>
                            <label htmlFor='isDefault' className='text-sm font-medium cursor-pointer'>
                         Set as Default 
                        </label>
                        <p className='text-sm text-muted-foreground'>This account will be selected by default for transactions</p>
                        </div>
                        <Switch 
                        id='isDefault'
                        onCheckedChange={(checked)=>setValue('isDefault',checked)}
                        checked={watch('isDefault')}
                        
                        />
                        
                    </div>

                    <div className='flex justify-between text-center '>
                        <DrawerClose asChild>
                         <Button type='button' variant='outline' className='flex-1 border-gray-500 border-b-4 rounded-md'>
                            Cancel
                         </Button>
                        </DrawerClose>

                        <Button
                type="submit"
                className="flex-1 bg-black text-white rounded-md"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
                    </div>


                </form>
                </div>

            </DrawerContent>
        
    </Drawer>
    
  )
}

export default CreateAccountDrawer 
