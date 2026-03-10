export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export interface ProductImage {
  url: string
  alt: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  images: ProductImage[]
  stock: number
  rating: number
  numReviews: number
  discount: number
  salePrice: number
  isFeatured: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
}

export interface OrderItem {
  product: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  _id: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: 'card' | 'paypal' | 'cod'
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  isPaid: boolean
  isDelivered: boolean
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  token: string
  user: User
}