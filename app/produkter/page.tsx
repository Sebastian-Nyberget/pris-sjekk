"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Bookmark, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { Pagination } from "@/components/pagination"
import { fetchProducts, searchProducts, type Product, type ApiResponse, fallbackProducts } from "@/lib/product-data"
import { useDebounce } from "@/hooks/use-debounce"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { useUser } from "@clerk/nextjs"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStore, setSelectedStore] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const { bookmarkedProducts, toggleBookmark } = useBookmarks()
  const { isSignedIn } = useUser()

  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Load products
  const loadProducts = useCallback(async (page = 1, search?: string) => {
    setLoading(true)
    setError(null)

    try {
      let response: ApiResponse

      if (search && search.trim()) {
        response = await searchProducts(search.trim(), page, 50)
      } else {
        response = await fetchProducts(page, 50)
      }

      setProducts(response.data || [])

      // Handle pagination metadata if available
      if (response.meta) {
        setTotalPages(response.meta.last_page || 1)
        setTotalProducts(response.meta.total || 0)
      } else {
        // Estimate pagination if no meta data
        setTotalPages(response.data.length === 50 ? page + 1 : page)
        setTotalProducts(response.data.length)
      }
    } catch (err) {
      console.error("Failed to load products:", err)
      setError("Kunne ikke laste produkter. Bruker reservedata.")
      setProducts(fallbackProducts)
      setTotalPages(1)
      setTotalProducts(fallbackProducts.length)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) return
    setCurrentPage(1)
    loadProducts(1, debouncedSearchQuery)
  }, [debouncedSearchQuery, loadProducts, searchQuery])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === currentPage || loading) return

    setCurrentPage(page)
    loadProducts(page, debouncedSearchQuery)

    // Scroll til toppen av produktlisten
    const productSection = document.querySelector("[data-products-section]")
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Get unique categories and stores from current products
  const categories = [
    "all",
    ...new Set((products || []).flatMap((product) => (product.category || []).map((cat) => cat.name))),
  ]
  const stores = ["all", ...new Set((products || []).map((product) => product.store?.name).filter(Boolean))]

  // Filter products based on category and store (client-side filtering)
  const filteredProducts = (products || []).filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || (product.category || []).some((cat) => cat.name === selectedCategory)
    const storeMatch = selectedStore === "all" || product.store?.name === selectedStore
    return categoryMatch && storeMatch
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading && products.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Laster produkter...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 flex flex-col items-center w-full max-w-full">
      <motion.div
        className="flex flex-col space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Produkter</h1>
            <p className="text-muted-foreground">
              Bla gjennom og sammenlign priser på tvers av butikker
              {totalProducts > 0 && ` • ${totalProducts.toLocaleString()} produkter tilgjengelig`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtre
            </Button>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Velg butikk" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store === "all" ? "Alle butikker" : store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Kategorier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "Alle kategorier" : category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6" data-products-section>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Søk etter produkter..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && searchQuery && (
                <div className="absolute right-2.5 top-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={loading || currentPage <= 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Forrige side
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">Side {currentPage}</div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                Neste side
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="grid">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Viser {(filteredProducts || []).length} produkter
                  {selectedCategory !== "all" || selectedStore !== "all" ? " (filtrert)" : ""}
                </p>
                <TabsList>
                  <TabsTrigger value="grid">Rutenett</TabsTrigger>
                  <TabsTrigger value="list">Liste</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-6 relative">
                {loading && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span>Laster produkter...</span>
                    </div>
                  </div>
                )}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {(filteredProducts || []).map((product) => (
                    <motion.div key={product.id} variants={item}>
                      <ProductCard
                        product={product}
                        isBookmarked={bookmarkedProducts.includes(product.id)}
                        onToggleBookmark={() => {
                          if (!isSignedIn) {
                            // Could show a sign-in modal or toast here
                            alert("Logg inn for å bokmerke produkter")
                            return
                          }
                          toggleBookmark(product.id)
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
                  {(filteredProducts || []).map((product) => (
                    <motion.div key={product.id} variants={item}>
                      <Card>
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 p-4 flex items-center justify-center">
                            <img
                              src={product.image || "/placeholder.svg?height=200&width=200"}
                              alt={product.name}
                              className="h-32 w-32 object-contain"
                            />
                          </div>
                          <CardContent className="flex-1 p-6">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <div className="flex items-center mt-2 space-x-2">
                                  <Badge variant="outline">{product.store?.name}</Badge>
                                  {(product.category || []).slice(0, 2).map((cat) => (
                                    <Badge key={cat.id} variant="secondary">
                                      {cat.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">{product.current_price} kr</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.current_unit_price} kr/{product.weight_unit}
                                </p>
                              </div>
                            </div>
                            {(product.price_history || []).length > 0 && (
                              <div className="mt-4">
                                <PriceHistoryChart priceHistory={product.price_history} />
                              </div>
                            )}
                          </CardContent>
                          <div className="p-4 flex md:flex-col justify-between items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (!isSignedIn) {
                                  // Could show a sign-in modal or toast here
                                  alert("Logg inn for å bokmerke produkter")
                                  return
                                }
                                toggleBookmark(product.id)
                              }}
                              className={bookmarkedProducts.includes(product.id) ? "text-primary" : ""}
                            >
                              <Bookmark
                                className="h-5 w-5"
                                fill={bookmarkedProducts.includes(product.id) ? "currentColor" : "none"}
                              />
                              <span className="sr-only">Bokmerke</span>
                            </Button>
                            <Button>Se detaljer</Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Paginering */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  disabled={loading}
                  showFirstLast={true}
                  maxVisiblePages={7}
                />

                {/* Sideinformasjon */}
                <div className="flex justify-center items-center mt-4 text-sm text-muted-foreground">
                  <span>
                    Side {currentPage}
                    {totalProducts > 0 && <> • Totalt {totalProducts.toLocaleString()} produkter</>}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
