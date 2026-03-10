import { createContext, useState, useEffect } from 'react'
import type { Cart, Product } from '../types'
import { cartAPI } from '../services/api'

interface CartContextType {
  cart: Cart
  addToCart: (product: Product, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  loading: boolean
}

export const CartContext = createContext<CartContextType | null>(null)

const emptyCart: Cart = { items: [], totalPrice: 0 }

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart)
  const [loading, setLoading] = useState(false)

  // Load cart from backend on mount
 useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchCart()
    }
  }, [])

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart()
      const data = res.data as { cart: Cart }
      setCart(data.cart || emptyCart)
    } catch (error) {
      console.error('Failed to fetch cart', error)
    }
  }

  const addToCart = async (product: Product, quantity: number) => {
    setLoading(true)
    try {
      const res = await cartAPI.addToCart(product._id, quantity)
      const data = res.data as { cart: Cart }
      setCart(data.cart)
    } catch (error) {
      console.error('Failed to add to cart', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    setLoading(true)
    try {
      const res = await cartAPI.removeItem(productId)
      const data = res.data as { cart: Cart }
      setCart(data.cart)
    } catch (error) {
      console.error('Failed to remove from cart', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    setLoading(true)
    try {
      const res = await cartAPI.updateItem(productId, quantity)
      const data = res.data as { cart: Cart }
      setCart(data.cart)
    } catch (error) {
      console.error('Failed to update cart', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    setLoading(true)
    try {
      await cartAPI.clearCart()
      setCart(emptyCart)
    } catch (error) {
      console.error('Failed to clear cart', error)
    } finally {
      setLoading(false)
    }
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}