// API utility for consistent API calls
import axios from 'axios';

const API_BASE_URL =
  typeof process !== "undefined" && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "https://ecommerce-backend-730a.onrender.com/api";

// Helper function to get auth headers
const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
};

export const api = {
  // Auth endpoints
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,

  // Product endpoints
  products: `${API_BASE_URL}/products`,
  productCategories: `${API_BASE_URL}/products/categories`,

  // Cart endpoints
  cart: `${API_BASE_URL}/cart`,

  // Order endpoints
  orders: `${API_BASE_URL}/orders`,
  myOrders: `${API_BASE_URL}/orders/my`,

  // Review endpoints
  reviews: `${API_BASE_URL}/reviews`,

  // Payment endpoints
  createPaymentOrder: `${API_BASE_URL}/payment/create-order`,

  // User endpoints
  users: `${API_BASE_URL}/users`,

  // Helper function to get full URL
  getUrl: (endpoint) => `${API_BASE_URL}${endpoint}`
};

// API call functions
export const authAPI = {
  login: (data) => axios.post(api.login, data),
  register: (data) => axios.post(api.register, data),
};

export const productAPI = {
  getAll: (params = {}) => axios.get(api.products, { params }),
  getCategories: () => axios.get(api.productCategories),
  getById: (id) => axios.get(`${api.products}/${id}`),
  create: (data) => axios.post(api.products, data, getAuthConfig()),
  update: (id, data) => axios.put(`${api.products}/${id}`, data, getAuthConfig()),
  delete: (id) => axios.delete(`${api.products}/${id}`, getAuthConfig()),
};

export const cartAPI = {
  getCart: () => axios.get(api.cart, getAuthConfig()),
  addToCart: (data) => axios.post(api.cart, data, getAuthConfig()),
  updateCart: (data) => axios.put(api.cart, data, getAuthConfig()),
  removeFromCart: (productId) => axios.delete(`${api.cart}/${productId}`, getAuthConfig()),
  clearCart: () => axios.delete(api.cart, getAuthConfig()),
};

export const orderAPI = {
  getAll: () => axios.get(api.orders, getAuthConfig()),
  getMyOrders: () => axios.get(api.myOrders, getAuthConfig()),
  getById: (id) => axios.get(`${api.orders}/${id}`, getAuthConfig()),
  create: (data) => axios.post(api.orders, data, getAuthConfig()),
  update: (id, data) => axios.put(`${api.orders}/${id}`, data, getAuthConfig()),
};

export const reviewAPI = {
  getAll: (productId) => axios.get(`${api.reviews}?product=${productId}`),
  create: (data) => axios.post(api.reviews, data, getAuthConfig()),
  update: (id, data) => axios.put(`${api.reviews}/${id}`, data, getAuthConfig()),
  delete: (id) => axios.delete(`${api.reviews}/${id}`, getAuthConfig()),
};

export const paymentAPI = {
  createOrder: (data) => axios.post(api.createPaymentOrder, data, getAuthConfig()),
};

export const userAPI = {
  getAll: () => axios.get(api.users, getAuthConfig()),
  getById: (id) => axios.get(`${api.users}/${id}`, getAuthConfig()),
  update: (id, data) => axios.put(`${api.users}/${id}`, data, getAuthConfig()),
  delete: (id) => axios.delete(`${api.users}/${id}`, getAuthConfig()),
};

export default api;