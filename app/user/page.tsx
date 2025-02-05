
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { client } from "@/sanity/lib/client"
import { BarChart3, Package, Menu, X, Users, Trash, Plus, Loader2 } from 'lucide-react'
import { Card } from "@/components/ui/card"
import Link from 'next/link'

interface User {
  _id: string
  email: string
  username: string
  password: string
}

interface Stats {
  totalUsers: number
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0 })
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newUser, setNewUser] = useState<Omit<User, '_id'>>({ email: '', username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const query = `*[_type == "user"]{
        _id,
        email,
        username,
        password
      }`
      const response = await client.fetch(query)
      setUsers(response)
      setStats({ totalUsers: response.length })
    } catch (error) {
      setError("Failed to load users. Please try again later.")
    }
  }

  const handleDeleteUser = async (id: string) => {
    setIsLoading(true)
    try {
      await client.delete(id)
      fetchUsers()
    } catch (error) {
      setError("Failed to delete user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await client.create({
        _type: 'user',
        ...newUser
      })
      setIsCreateModalOpen(false)
      setNewUser({ email: '', username: '', password: '' })
      fetchUsers()
    } catch (error) {
      setError("Failed to create user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="flex">
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: isSidebarOpen ? 0 : -250 }}
          className="fixed h-screen w-64 bg-gray-800 text-white p-6 shadow-lg z-20"
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-blue-400">Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-4">
            <Link href="/dashboard" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <Package className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/user" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            <a href="/productItems" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Products</span>
            </a>
            {/* <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <TrendingUp className="h-5 w-5" />
              <span>Sales</span>
            </a> */}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} p-8 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden ${isSidebarOpen ? 'hidden' : 'block'}`}>
              <Menu className="h-6 w-6 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Plus className="h-5 w-5 inline-block mr-2" />
              Add User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalUsers}</p>
              </Card>
            </motion.div>
          </div>

          {/* Users Grid */}
          {error ? (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-colors">
                    <h3 className="text-xl font-semibold text-white mb-2">{user.username}</h3>
                    <div className="text-gray-400 mb-2">{user.email}</div>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      <Trash className="h-4 w-4 inline-block mr-2" />
                      Delete
                    </button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
    </div>
  )
}