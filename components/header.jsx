
'use client'

import React, { useEffect, useState } from 'react'
import { SignInButton, SignedOut, SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      className="w-full backdrop-blur-lg bg-white/30 dark:bg-black/30 shadow-md fixed top-0 z-50 border-b border-gray-200 dark:border-gray-700"
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="SpendAI"
              height={90}
              width={100}
              className="h-28 w-auto object-contain"
              priority
            />
          </motion.div>
        </Link>

        
        <div className="flex items-center space-x-3">
          <SignedIn>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="bg-black text-white dark:bg-white dark:text-black hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/transaction/create">
                <Button
                  variant="outline"
                  className="bg-black text-white dark:bg-white dark:text-black hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </motion.div>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="bg-black text-white shadow-lg dark:bg-white dark:text-black hover:shadow-xl transition duration-300">
                  Login
                </Button>
              </motion.div>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-12 h-12 transition-transform hover:scale-110',
                },
              }}
            />
          </SignedIn>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  )
}

export default Header
