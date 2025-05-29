import type { Product, PriceHistoryEntry } from "./api"

export interface LoadingState {
  isLoading: boolean
  error: string | null
  data: unknown | null
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export interface SearchProps {
  query: string
  onQueryChange: (query: string) => void
  placeholder?: string
  isLoading?: boolean
  onSubmit?: (query: string) => void
}

export interface FilterProps {
  selectedCategory: string
  selectedStore: string
  onCategoryChange: (category: string) => void
  onStoreChange: (store: string) => void
  categories: string[]
  stores: string[]
}

export interface ProductCardProps {
  product: Product
  isBookmarked: boolean
  onToggleBookmark: () => void
  variant?: "grid" | "list"
  showPriceHistory?: boolean
}

export interface ProductListProps {
  products: Product[]
  bookmarkedProducts: number[]
  onToggleBookmark: (productId: number) => void
  viewMode: "grid" | "list"
  isLoading?: boolean
}

export interface ChartDataPoint {
  x: number | string | Date
  y: number
  label?: string
}

export interface PriceChartProps {
  priceHistory: PriceHistoryEntry[]
  height?: number
  width?: number
  showTooltip?: boolean
  animate?: boolean
}

// Form types
export interface BookmarkState {
  productIds: number[]
  isLoading: boolean
  error: string | null
}

export interface UserPreferences {
  defaultStore?: string
  defaultCategory?: string
  priceAlerts: boolean
  emailNotifications: boolean
  currency: "NOK" | "EUR" | "USD"
  language: "no" | "en"
}
