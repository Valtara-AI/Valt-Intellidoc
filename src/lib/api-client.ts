
class ApiClient {
  private baseURL: string

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${url}`, error)
      throw error
    }
  }

  // Document methods
  async getDocuments(params?: {
    q?: string
    type?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const query = searchParams.toString()
    return this.request(`/documents${query ? `?${query}` : ''}`)
  }

  async uploadDocument(data: FormData) {
    return this.request('/documents', {
      method: 'POST',
      body: data,
      headers: {}, // Don't set Content-Type for FormData
    })
  }

  // Chat methods
  async sendMessage(message: string, conversationId?: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    })
  }

  // User methods
  async getCurrentUser() {
    return this.request('/user/me')
  }

  async updateUserProfile(data: Partial<any>) {
    return this.request('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Admin methods
  async getUsers() {
    return this.request('/admin/users')
  }

  async createUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(userId: string) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    })
  }

  // Audit methods
  async getAuditLogs(params?: {
    userId?: string
    action?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const query = searchParams.toString()
    return this.request(`/admin/audit-logs${query ? `?${query}` : ''}`)
  }
}

export const apiClient = new ApiClient()
export default apiClient