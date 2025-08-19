import type { CartItem } from "@/types/billing";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    getGSTBreakdown: () => { [key: number]: number };
    getTotalGST: () => number;
    getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("admin-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("admin-cart", JSON.stringify(items))
  }, [items])

    const addItem = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity+1 } : item,
        )
      } else {
        return [
          ...currentItems,
          {
            id: String(product.id),
            name: product.name,
            price: product.price,
            quantity: 1,
            hsnCode: product.hsnCode,
            gst: product.gst,
            kgpunit: product.kgpunit,
            unit: product.unit
          },
        ]
      }
    })
  }
  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    // if (items.length === 0) return 0
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    // if (items.length === 0) return 0
    console.log("item subtotal" , items)
    return items.reduce((total, item) => total + ((item.price * item.quantity)/100) * item.kgpunit , 0)
  }

  const getGSTBreakdown = () => {
    const gstBreakdown: { [key: number]: number } = {}

    items.forEach((item) => {
      const itemSubtotal = ((item.price * item.quantity ) / 100 ) * item.kgpunit
      const gstAmount = (itemSubtotal * item.gst) / 100

      if (gstBreakdown[item.gst]) {
        gstBreakdown[item.gst] += gstAmount
      } else {
        gstBreakdown[item.gst] = gstAmount
      }
    })

    return gstBreakdown
  }

  const getTotalGST = () => {
    const gstBreakdown = getGSTBreakdown()
    return Object.values(gstBreakdown).reduce((total, gst) => total + gst, 0)
  }

  const getTotalAmount = () => {
    return getSubtotal() + getTotalGST()
  }

    return (
        <CartContext.Provider
        value={{
            items,
            addItem,
            removeItem,
            clearCart,
            updateQuantity,
            getTotalItems,
            getSubtotal,
            getGSTBreakdown,
            getTotalGST,
            getTotalAmount,
        }}
        >
        {children}
        </CartContext.Provider>
    )

}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
