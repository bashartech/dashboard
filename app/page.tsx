
"use client"

import { SignInButton, SignOutButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { LogIn, LogOut } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const {user} = useUser()
 const router = useRouter()

  if(user && user.primaryEmailAddress?.emailAddress === "bashartc13@gmail.com"){
     router.push("/dashboard")
  }
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h1>
          <SignedOut>
            <div className="space-y-4">
              <p className="text-gray-400 text-center">Please sign in to access the admin dashboard.</p>
              <SignInButton mode="modal">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login with Clerk
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="space-y-4">
              <p className="text-gray-400 text-center">You are currently signed in.</p>
              <SignOutButton>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </SignOutButton>
            </div>
          </SignedIn>
        </Card>
      </motion.div>
    </div>
  )
}