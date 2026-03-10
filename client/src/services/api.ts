import axios from 'axios'
import type { User } from '../types'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export interface AuthResponseData {
  success: boolean
  token: string
  user: User
}

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponseData>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponseData>('/auth/login', data),
  getMe: () => api.get<AuthResponseData>('/auth/me'),
}

export const productsAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
}

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number) =>
    api.post('/cart', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
}

export const ordersAPI = {
  placeOrder: (data: Record<string, unknown>) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
}

export default api