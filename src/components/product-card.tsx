"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import type { Product } from "@/types/product"
import { useCart } from "@/components/CartProvider"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart()

  const cartItem = items.find((item) => item.id === product.id)

  const quantity = cartItem?.quantity || 0

  // console.log("Cart Item:", cartItem?.quantity)

  const handleAddToCart = () => {
    // console.log("24", product)
    addItem(product)
  }

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1)
    } else {
      addItem(product)
    }
  }

  const handleDecrement = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1)
    } else if (cartItem) {
      removeItem(product.id)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 aspect-square max-w-[180px] mx-auto  flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        {/* Product Image Placeholder */}
        {/* <div className="w-full h-32 sm:h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded"></div>
            Product Image
          </div>
        </div> */}

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-center gap-2">
            <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{product.name}</h3>
            
          </div>

        </div> 

        {/* Add to Cart / Quantity Controls */}
        <div className="mt-4">
          {quantity === 0 ? (
            <Button onClick={handleAddToCart} className="w-full h-9 text-sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {/* {product.stock === 0 ? "Out of Stock" : "Add to Cart"} */}
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
              <Button variant="ghost" size="sm" onClick={handleDecrement} className="h-7 w-7 p-0 hover:bg-gray-200 bg-red-100">
                <Minus className="h-3 w-3" />
              </Button>

              <span className="font-medium text-sm px-3">{quantity}</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleIncrement}
                className="h-7 w-7 p-0 hover:bg-gray-200 bg-green-100"
                // disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
