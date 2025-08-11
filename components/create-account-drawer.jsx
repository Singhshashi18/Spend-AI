

'use client'
import React, { useState, useEffect } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'
import { useForm } from 'react-hook-form'
import { accountSchema } from '@/app/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createAccount } from '@/action/dashboard'
import useFetch from '@/hooks/usefetch'
import { motion, AnimatePresence } from 'framer-motion'

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'CURRENT',
      balance: '',
      isDefault: false,
    },
  })

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount)

  const onSubmit = async (data) => {
    await createAccountFn(data)
  }

  useEffect(() => {
    if (newAccount) {
      toast.success('🎉 Account created successfully!')
      reset()
      setOpen(false)
    }
  }, [newAccount, reset])

  useEffect(() => {
    if (error) {
      toast.error(error.message || '❌ Failed to create account')
    }
  }, [error])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="bg-gradient-to-br from-white/80 to-gray-100/80 backdrop-blur-xl shadow-2xl border border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-2xl font-bold text-gray-800">
              ✨ Create New Account
            </DrawerTitle>
            <p className="text-gray-500 text-sm">
              Fill in the details below to get started.
            </p>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Account Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Account Name
                </label>
                <Input
                  className="bg-white/60 border-gray-300 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 hover:border-indigo-300 transition-all"
                  id="name"
                  placeholder="e.g., Main Checking"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Account Type
                </label>
                <Select
                  onValueChange={(value) => setValue('type', value)}
                  defaultValue={watch('type')}
                >
                  <SelectTrigger className="bg-white/60 border-gray-300 rounded-lg hover:border-indigo-300 transition-all">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg rounded-xl border">
                    <SelectItem value="CURRENT">CURRENT</SelectItem>
                    <SelectItem value="SAVING">SAVINGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Balance */}
              <div className="space-y-2">
                <label htmlFor="balance" className="text-sm font-medium">
                  Initial Value
                </label>
                <Input
                  className="bg-white/60 border-gray-300 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 hover:border-indigo-300 transition-all"
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('balance')}
                />
                {errors.balance && (
                  <p className="text-sm text-red-600">
                    {errors.balance.message}
                  </p>
                )}
              </div>

              {/* Default Account */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="space-y-2 flex items-center justify-between rounded-lg border border-gray-200 bg-white/50 p-3 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-0.5">
                  <label
                    htmlFor="isDefault"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Set as Default
                  </label>
                  <p className="text-sm text-gray-500">
                    This account will be selected by default for transactions
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  onCheckedChange={(checked) =>
                    setValue('isDefault', checked)
                  }
                  checked={watch('isDefault')}
                />
              </motion.div>

              {/* Buttons */}
              <div className="flex justify-between gap-3 pt-2">
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-lg border-gray-300 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    Cancel
                  </Button>
                </DrawerClose>

                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all"
                  disabled={createAccountLoading}
                >
                  {createAccountLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateAccountDrawer
