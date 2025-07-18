// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/v1'

// API Client class
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    
    return this.request(url, {
      method: 'GET'
    })
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }
}

// Create API client instance
const apiClient = new APIClient()

// API endpoints for each service
export const userAPI = {
  // User Management (API 1)
  getUsers: (params) => apiClient.get('/users', params),
  getUser: (id) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post('/users', data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
}

export const postAPI = {
  // Content Management (API 2)
  getPosts: (params) => apiClient.get('/posts', params),
  getPost: (id) => apiClient.get(`/posts/${id}`),
  createPost: (data) => apiClient.post('/posts', data),
  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data),
  deletePost: (id) => apiClient.delete(`/posts/${id}`),
  togglePublish: (id) => apiClient.patch(`/posts/${id}/publish`),
  getPostsByCategory: (category) => apiClient.get(`/posts/category/${category}`),
}

export const analyticsAPI = {
  // Analytics (API 3)
  trackEvent: (data) => apiClient.post('/analytics/track', data),
  getEvents: (params) => apiClient.get('/analytics/events', params),
  getSummary: () => apiClient.get('/analytics/summary'),
  getEventsByType: (type) => apiClient.get(`/analytics/events/${type}`),
  getUserAnalytics: (userId) => apiClient.get(`/analytics/users/${userId}`),
}

export const productAPI = {
  // E-commerce Products (API 4)
  getProducts: (params) => apiClient.get('/products', params),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
  getProductsByCategory: (category) => apiClient.get(`/products/category/${category}`),
}

export const orderAPI = {
  // E-commerce Orders (API 4)
  getOrders: (params) => apiClient.get('/orders', params),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (data) => apiClient.post('/orders', data),
  updateOrderStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }),
  getOrdersByUser: (userId) => apiClient.get(`/orders/user/${userId}`),
}

export const commentAPI = {
  // Communication (API 5)
  getComments: (params) => apiClient.get('/comments', params),
  getComment: (id) => apiClient.get(`/comments/${id}`),
  createComment: (data) => apiClient.post('/comments', data),
  updateComment: (id, data) => apiClient.put(`/comments/${id}`, data),
  deleteComment: (id) => apiClient.delete(`/comments/${id}`),
  getCommentsByPost: (postId) => apiClient.get(`/comments/post/${postId}`),
  getCommentsByUser: (userId) => apiClient.get(`/comments/user/${userId}`),
}

// Export the main API client
export default apiClient
