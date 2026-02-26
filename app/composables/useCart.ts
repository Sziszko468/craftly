// Shopping cart composable
import { ref, computed } from 'vue'
import type { Product, Cart, CartItem } from '~/types'

const cartItems = ref<CartItem[]>([])

export function useCart() {
  const cart = computed<Cart>(() => {
    const total = cartItems.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    )
    return {
      items: cartItems.value,
      total: Math.round(total * 100) / 100,
      itemCount: cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
    }
  })

  function addToCart(product: Product, quantity = 1): void {
    const existing = cartItems.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      cartItems.value.push({ product, quantity })
    }
  }

  function removeFromCart(productId: string): void {
    cartItems.value = cartItems.value.filter((i) => i.product.id !== productId)
  }

  function updateQuantity(productId: string, quantity: number): void {
    const item = cartItems.value.find((i) => i.product.id === productId)
    if (!item) return
    if (quantity <= 0) removeFromCart(productId)
    else item.quantity = Math.min(quantity, item.product.stock)
  }

  function clearCart(): void {
    cartItems.value = []
  }

  function isInCart(productId: string): boolean {
    return cartItems.value.some((i) => i.product.id === productId)
  }

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }
}