"use client"

import { useState, useMemo } from "react"
import { ProductList } from "@/components/product-list"
import { AddProductForm } from "@/components/add-product-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/product"

// Mock data - replace with actual database fetch
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    hsnCode: "85183000",
    gst: 18,
    category: "Electronics",
    stock: 45
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    hsnCode: "61091000",
    gst: 12,
    category: "Clothing",
    stock: 120
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    hsnCode: "73239300",
    gst: 18,
    category: "Home & Kitchen",
    stock: 78
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 89.99,
    hsnCode: "85183000",
    gst: 18,
    category: "Electronics",
    stock: 32
  },
  {
    id: 5,
    name: "Yoga Mat",
    price: 39.99,
    hsnCode: "95069990",
    gst: 18,
    category: "Sports",
    stock: 67
  }
]

export default function CatalogPage() {
  const [products, setProducts] = useState(mockProducts)
  const [showEditModal, setShowEditModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddProduct = (newProduct: Product) => {
    const product = {
      ...newProduct,
      id: Date.now(), // In real app, this would be handled by database
    }
    setProducts([...products, product])
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setShowEditModal(true)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ))
    setProductToEdit(null)
    setShowEditModal(false)
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId))
  }

  // Filtered products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.hsnCode.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    )
  }, [products, searchQuery])

  return (
    <div className="p-4 sm:p-6 md:p-8"> {/* Adjusted padding for smaller screens */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Catalog</h1> {/* Responsive heading size */}
        <p className="text-gray-600 mt-2">Manage your product inventory</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Product List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Existing Products</h2>
          <Input
            type="text"
            placeholder="Search products by name, HSN, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <ProductList 
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>

        {/* Right Section - Add/Edit Product Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Product
          </h2>
          <AddProductForm 
            onSubmit={handleAddProduct}
          />
        </div>
      </div>

      {/* Dialog for editing */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <AddProductForm
              product={productToEdit}
              onSubmit={handleUpdateProduct}
              onCancel={() => {
                setProductToEdit(null)
                setShowEditModal(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
