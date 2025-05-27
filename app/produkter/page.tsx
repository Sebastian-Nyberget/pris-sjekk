"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { PriceHistoryChart } from "@/components/price-history-chart";
import {
  fetchProducts,
  searchProducts,
  type Product,
  type ApiResponse,
  fallbackProducts,
} from "@/lib/product-data";
import { useDebounce } from "@/hooks/use-debounce";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alt");
  const [selectedStore, setSelectedStore] = useState("Alt");
  const [bookmarkedProducts, setBookmarkedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Load products
  const loadProducts = useCallback(async (page = 1, search?: string) => {
    setLoading(true);
    setError(null);

    try {
      let response: ApiResponse;

      if (search && search.trim()) {
        response = await searchProducts(search.trim(), page, 50);
      } else {
        response = await fetchProducts(page, 50);
      }

      setProducts(response.data || []);

      // Handle pagination metadata if available
      if (response.meta) {
        setTotalPages(response.meta.last_page || 1);
        setTotalProducts(response.meta.total || 0);
      } else {
        // Estimate pagination if no meta data
        setTotalPages(response.data.length === 50 ? page + 1 : page);
        setTotalProducts(response.data.length);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Failed to load products. Using fallback data.");
      setProducts(fallbackProducts);
      setTotalPages(1);
      setTotalProducts(fallbackProducts.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) return;
    setCurrentPage(1);
    loadProducts(1, debouncedSearchQuery);
  }, [debouncedSearchQuery, loadProducts]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadProducts(page, debouncedSearchQuery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get unique categories and stores from current products
  const categories = [
    "Alt",
    ...new Set(
      (products || []).flatMap((product) =>
        (product.category || []).map((cat) => cat.name)
      )
    ),
  ];
  const stores = [
    "Alt",
    ...new Set(
      (products || []).map((product) => product.store?.name).filter(Boolean)
    ),
  ];

  // Filter products based on category and store (client-side filtering)
  const filteredProducts = (products || []).filter((product) => {
    const categoryMatch =
      selectedCategory === "Alt" ||
      (product.category || []).some((cat) => cat.name === selectedCategory);
    const storeMatch =
      selectedStore === "Alt" || product.store?.name === selectedStore;
    return categoryMatch && storeMatch;
  });

  const toggleBookmark = (productId: number) => {
    setBookmarkedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading && products.length === 0) {
    return (
      <div className="container py-8 w-full flex flex-col items-center bg-red min-w-full">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-12 py-8 w-full max-w-full flex items-center">
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
              Bla gjennom og sammenlign priser på tvers av flere butikker
              {totalProducts > 0 &&
                ` • ${totalProducts.toLocaleString()} produkter tiljengelig`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store}
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
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Søk etter produkt..."
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

            <Tabs defaultValue="grid">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Viser {(filteredProducts || []).length} produkter
                  {selectedCategory !== "Alt" || selectedStore !== "Alt"
                    ? " (filtered)"
                    : ""}
                </p>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="grid" className="mt-6">
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
                        onToggleBookmark={() => toggleBookmark(product.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {(filteredProducts || []).map((product) => (
                    <motion.div key={product.id} variants={item}>
                      <Card>
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-48 p-4 flex items-center justify-center">
                            <img
                              src={
                                product.image ||
                                "/placeholder.svg?height=200&width=200"
                              }
                              alt={product.name}
                              className="h-32 w-32 object-contain"
                            />
                          </div>
                          <CardContent className="flex-1 p-6">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                  {product.brand}
                                </p>
                                <h3 className="text-lg font-semibold">
                                  {product.name}
                                </h3>
                                <div className="flex items-center mt-2 space-x-2">
                                  <Badge variant="outline">
                                    {product.store?.name}
                                  </Badge>
                                  {(product.category || [])
                                    .slice(0, 2)
                                    .map((cat) => (
                                      <Badge key={cat.id} variant="secondary">
                                        {cat.name}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold">
                                  {product.current_price} kr
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {product.current_unit_price} kr/
                                  {product.weight_unit}
                                </p>
                              </div>
                            </div>
                            {(product.price_history || []).length > 0 && (
                              <div className="mt-4">
                                <PriceHistoryChart
                                  priceHistory={product.price_history}
                                />
                              </div>
                            )}
                          </CardContent>
                          <div className="p-4 flex md:flex-col justify-between items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBookmark(product.id)}
                              className={
                                bookmarkedProducts.includes(product.id)
                                  ? "text-primary"
                                  : ""
                              }
                            >
                              <Bookmark
                                className="h-5 w-5"
                                fill={
                                  bookmarkedProducts.includes(product.id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                              <span className="sr-only">Bookmark</span>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
