"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductList } from "@/components/product-list"
import { AddProductForm } from "@/components/add-product-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Product } from "@/types/product"
import { toast } from "sonner"

// Mock data - replace with actual database fetch

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast("Error fetching products: " + error.message);
      }
    };

    fetchProducts();
  },[]);

  const handleAddProduct = async (newProduct: Product) => {
    // api called here 
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
    if (!res.ok) {
      const errorData = await res.json();
      toast("Error creating product:", errorData);
      return;
    }
    const createdProduct = await res.json();
    // console.log("Created product:", createdProduct);
    const product = {
      ...newProduct,
      id: createdProduct.id,
    }
    setProducts([...products, product])
    toast("Product created successfully!");
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setShowEditModal(true)
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    const res = await fetch(`/api/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
    if (!res.ok) {
      const errorData = await res.json();
      toast("Error updating product: " + errorData.message);
      return;
    }
    const updatedProductData = await res.json();

    setProducts(products.map(p => 
      p.id === updatedProductData.id ? updatedProductData : p
    ))
    setProductToEdit(null)
    setShowEditModal(false)
  }

  const handleDeleteProduct = async(productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      const errorData = await res.json();
      toast("Error deleting product: " + errorData.message);
      return;
    }
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
      String(product.price).toLowerCase().includes(lowerCaseQuery)
      
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
            placeholder="Search products by name, HSN..."
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
