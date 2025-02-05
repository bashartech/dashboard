"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { client } from "@/sanity/lib/client"
import { BarChart3, Package, Menu, X, Users, Trash, Plus, Loader2 } from 'lucide-react'
import { Card } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  _id: string
  title: string
  price: number
  productImage: {
    asset: {
      _id: string
      url: string
    }
  }
}

interface Stats {
  totalProducts: number
  totalValue: number
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalValue: 0 })
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, '_id'>>({ title: '', price: 0, productImage: { asset: { _id: '', url: '' } } })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const query = `*[_type == "product"]{
        _id,
        title,
        price,
        productImage{
          asset->{_id,url} 
        }
      }`
      const response = await client.fetch(query)
      setProducts(response)
      const totalProducts = response.length
      const totalValue = response.reduce((acc: number, curr: Product) => acc + curr.price, 0)
      setStats({ totalProducts, totalValue })
    } catch (error) {
      setError("Failed to load products. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    setIsLoading(true)
    try {
      await client.delete(id)
      fetchProducts()
    } catch (error) {
      setError("Failed to delete product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await client.create({
        _type: 'product',
        ...newProduct,
        productImage: newProduct.productImage || { asset: { _id: '', url: '' } }
      })
      setIsCreateModalOpen(false)
      setNewProduct({ title: '', price: 0, productImage: { asset: { _id: '', url: '' } } })
      fetchProducts()
    } catch (error) {
      setError("Failed to create product. Please try again.")
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
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/productItems" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            <Link href="/user" className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
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
            <h1 className="text-3xl font-bold text-white">Product Management</h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              <Plus className="h-5 w-5 inline-block mr-2" />
              Add Product
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Total Products</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">{stats.totalProducts}</p>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-gray-400 text-sm font-medium">Total Value</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">${stats.totalValue.toFixed(2)}</p>
              </Card>
            </motion.div>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-colors">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={product.productImage?.asset?.url || "/placeholder.svg"}
                        alt={product.title || "Product image"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-bold">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                      >
                        <Trash className="h-4 w-4 inline-block mr-2" />
                        Delete
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Product</h2>
            <form onSubmit={handleCreateProduct}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300 mb-2">Product Title</label>
                <input
                  type="text"
                  id="title"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-300 mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-gray-300 mb-2">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  value={newProduct.productImage.asset.url}
                  onChange={(e) => setNewProduct({ ...newProduct, productImage: { asset: { _id: '', url: e.target.value } } })}
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