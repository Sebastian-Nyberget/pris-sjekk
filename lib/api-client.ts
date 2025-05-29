import type { ApiResponse, Product, ApiError, ProductStore } from "@/types/api"

// API configuration and client
const API_BASE_URL = "https://kassal.app/api/v1"
const BEARER_TOKEN = "TKdbtmJD9ENaWY60jp4b7qLZBXyztugzKENQUIQJ"

export class ApiClient {
  private baseURL: string
  private token: string

  constructor(baseURL: string = API_BASE_URL, token: string = BEARER_TOKEN) {
    this.baseURL = baseURL
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData: ApiError = {
          message: `HTTP error! status: ${response.status} - ${response.statusText}`,
          status: response.status,
        }

        try {
          const errorJson = await response.json()
          errorData.message = errorJson.message || errorData.message
          errorData.errors = errorJson.errors
        } catch {
          // If we can't parse the error response, use the default message
        }

        throw errorData
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  async getProducts(page = 1, size = 50): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products?size=${size}&page=${page}`)
  }

  async searchProducts(query: string, page = 1, size = 50): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products?search=${encodeURIComponent(query)}&size=${size}&page=${page}`)
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.request<{ data: Product }>(`/products/id/${id}`)
    return response.data
  }

  async getCategories(): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>("/categories")
  }

  async getStores(): Promise<ApiResponse<ProductStore>> {
    return this.request<ApiResponse<ProductStore>>("/stores")
  }
}

export const apiClient = new ApiClient()
