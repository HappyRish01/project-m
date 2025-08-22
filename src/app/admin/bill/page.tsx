"use client"

import { useState, useEffect } from "react"
import { AdminProductGrid } from "@/components/admin-product-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
// import { getProducts } from "@/app/actions/product-actions"
import { useCart } from "@/components/CartProvider"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BillPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { getTotalItems  } = useCart()
  
  const router = useRouter()
  const totalCartItems = getTotalItems()
    // const totalAmount = getTotalAmount()

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const fetchedProducts = await fetch("/api/products").then((res) => res.json())
      setProducts(fetchedProducts)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery) ||
      // product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||

      product.hsnCode.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Bill</h1>
            <p className="text-gray-600 mt-2">Select products to add to your bill</p>
          </div>

          {/* Cart Button */}
          {/* <Link href="/admin/bill/cart"> */}
            <Button className="relative flex items-center gap-2" onClick={() => router.push("/admin/bill/cart")}>
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">View Cart</span>
              <span className="sm:hidden">Cart</span>
              {totalCartItems > 0 && (
                <>
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                  {totalCartItems}
                </Badge>
                {/* <span className="hidden md:inline text-sm">- ₹{totalAmount.toFixed(2)}</span> */}
                  </>
              )
              }
            </Button>
          {/* </Link> */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      ) : (
        <AdminProductGrid products={filteredProducts} />
      )}

      {/* Fixed Cart Summary for Mobile */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-50">
          <Link href="/admin/bill/cart">
            <Button className="w-full flex items-center justify-center gap-2 shadow-lg">
              <ShoppingCart className="h-4 w-4" />
              View Cart ({totalCartItems} items)
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
