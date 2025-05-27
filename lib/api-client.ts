// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE_URL = "https://kassal.app/api/v1";
const BEARER_TOKEN = "TKdbtmJD9ENaWY60jp4b7qLZBXyztugzKENQUIQJ";

export class ApiClient {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string = API_BASE_URL, token: string = BEARER_TOKEN) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getProducts(page = 1, size = 50): Promise<any> {
    return this.request(`/products?size=${size}&page=${page}`);
  }

  async searchProducts(query: string, page = 1, size = 50): Promise<any> {
    return this.request(
      `/products?search=${encodeURIComponent(query)}&size=${size}&page=${page}`
    );
  }

  async getProduct(id: number): Promise<any> {
    return this.request(`/products/${id}`);
  }

  async getCategories(): Promise<any> {
    return this.request("/categories");
  }

  async getStores(): Promise<any> {
    return this.request("/stores");
  }
}

export const apiClient = new ApiClient();
