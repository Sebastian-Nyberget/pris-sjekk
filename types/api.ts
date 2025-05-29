export interface ApiMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
    path?: string
    first_page_url?: string
    last_page_url?: string
    next_page_url?: string | null
    prev_page_url?: string | null
  }
  
  export interface ApiResponse<T> {
    data: T[]
    meta?: ApiMeta
    links?: {
      first: string
      last: string
      prev: string | null
      next: string | null
    }
  }
  
  export interface ApiError {
    message: string
    errors?: Record<string, string[]>
    status?: number
  }
  
  // Product related types
  export interface ProductCategory {
    id: number
    depth: number
    name: string
    parent_id?: number | null
    slug?: string
  }
  
  export interface ProductStore {
    name: string
    code: string
    url: string
    logo: string
    description?: string
    website?: string
  }
  
  export interface PriceHistoryEntry {
    price: number
    date: string
    store_code?: string
  }
  
  export interface ProductAllergen {
    code: string
    display_name: string
    contains: "YES" | "NO" | "UNKNOWN"
    description?: string
  }
  
  export interface ProductNutrition {
    code: string
    display_name: string
    amount: number
    unit: string
    per_100g?: number
    per_serving?: number
  }
  
  export interface ProductLabel {
    name: string
    display_name: string
    description?: string
    organization?: string | null
    alternative_names?: string[] | null
    type?: string | null
    year_established?: number | null
    about?: string | null
    note?: string | null
    icon?: {
      svg: string
      png: string
    }
  }
  
  export interface Product {
    id: number
    name: string
    brand: string
    vendor: string
    ean: string
    url: string
    image: string | null
    category: ProductCategory[]
    description: string | null
    ingredients: string | null
    current_price: number
    current_unit_price: number
    weight: number
    weight_unit: string
    store: ProductStore
    price_history: PriceHistoryEntry[]
    allergens: ProductAllergen[]
    nutrition: ProductNutrition[]
    labels: ProductLabel[]
    created_at: string
    updated_at: string
    availability?: "IN_STOCK" | "OUT_OF_STOCK" | "LIMITED" | "UNKNOWN"
    rating?: number
    review_count?: number
  }
  
  // Search and filter types
  export interface SearchFilters {
    query?: string
    category_id?: number
    store_code?: string
    min_price?: number
    max_price?: number
    brand?: string
    has_discount?: boolean
    in_stock?: boolean
  }
  
  export interface SortOptions {
    field: "name" | "price" | "brand" | "updated_at" | "rating"
    direction: "asc" | "desc"
  }
  
  // API request types
  export interface ProductsRequest {
    page?: number
    size?: number
    search?: string
    filters?: SearchFilters
    sort?: SortOptions
  }
  
  export interface ProductDetailRequest {
    id: number
    include_related?: boolean
    include_reviews?: boolean
  }
  