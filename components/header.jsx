
"use client";

import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  PenBox,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 12 }}
      className="fixed top-0 z-50 w-full backdrop-blur-lg bg-gradient-to-r from-white/20 via-white/10 to-white/20 
      dark:from-black/20 dark:via-black/10 dark:to-black/20 shadow-lg border-b border-white/20 dark:border-white/10"
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="SpendAI"
              height={80}
              width={90}
              className="h-20 w-auto object-contain drop-shadow-lg"
              priority
            />
          </motion.div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/dashboard">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                  hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 
                  flex items-center gap-2 rounded-full shadow-lg hover:shadow-purple-500/50"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/transaction/create">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white 
                  hover:from-pink-400 hover:to-orange-400 transition-all duration-300 
                  flex items-center gap-2 rounded-full shadow-lg hover:shadow-pink-500/50"
                >
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </Link>
            </motion.div>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full
                  hover:from-blue-400 hover:to-cyan-400 shadow-lg hover:shadow-cyan-500/50 
                  transition-all duration-300"
                >
                  Login
                </Button>
              </motion.div>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-12 h-12 transition-transform hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 rounded-full",
                },
              }}
            />
          </SignedIn>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              whileHover={{ rotate: 20, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400 drop-shadow" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 drop-shadow" />
              )}
            </motion.button>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
