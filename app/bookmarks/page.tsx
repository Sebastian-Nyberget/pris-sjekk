"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bookmark, Trash2, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { apiClient } from "@/lib/api-client"
import { fallbackProducts } from "@/lib/product-data"
import { SignInButton, useUser } from "@clerk/nextjs"
import type { Product } from "@/types/api"

export default function BookmarksPage() {
  const [bookmarkedProductsData, setBookmarkedProductsData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { bookmarkedProducts, removeBookmark, clearBookmarks, isSignedIn } = useBookmarks()
  const { user } = useUser()

  // Load product data for bookmarked items
  useEffect(() => {
    async function loadBookmarkedProducts() {
      if (!isSignedIn || bookmarkedProducts.length === 0) {
        setBookmarkedProductsData([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Try to fetch each bookmarked product
        const productPromises = bookmarkedProducts.map(async (productId) => {
          try {
            return await apiClient.getProduct(productId)
          } catch (error) {
            console.error(`Failed to load product ${productId}:`, error)
            // Fallback to mock data if available
            return fallbackProducts.find((p) => p.id === productId) || null
          }
        })

        const products = await Promise.all(productPromises)
        const validProducts = products.filter((product): product is Product => product !== null)
        setBookmarkedProductsData(validProducts)
      } catch (err) {
        console.error("Error loading bookmarked products:", err)
        setError("Kunne ikke laste bokmerkede produkter")
      } finally {
        setLoading(false)
      }
    }

    loadBookmarkedProducts()
  }, [bookmarkedProducts, isSignedIn])

  if (!isSignedIn) {
    return (
      <div className="container py-8 flex flex-col items-center w-full max-w-full">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Logg inn for å se bokmerker</h2>
            <p className="text-muted-foreground mb-6">
              Du må være logget inn for å lagre og se dine bokmerkede produkter.
            </p>
            <SignInButton mode="modal">
              <Button size="lg">Logg inn</Button>
            </SignInButton>
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="container py-8 flex flex-col items-center w-full max-w-full">
      <motion.div
        className="flex flex-col space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Link href="/produkter" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til produkter
            </Link>
            <h1 className="text-3xl font-bold">Mine bokmerker</h1>
            <p className="text-muted-foreground">
              Hei {user?.firstName || user?.username}! Her er dine bokmerkede produkter.
            </p>
          </div>
          {bookmarkedProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={clearBookmarks}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Fjern alle
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Laster bokmerkede produkter...</p>
            </div>
          </div>
        ) : bookmarkedProductsData.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">Ingen bokmerker ennå</h2>
            <p className="text-muted-foreground mb-6">
              Start med å bokmerke produkter du er interessert i for å se dem her.
            </p>
            <Link href="/produkter">
              <Button>Utforsk produkter</Button>
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {bookmarkedProductsData.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="p-0 relative">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-destructive hover:text-destructive"
                      onClick={() => removeBookmark(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Fjern bokmerke</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{product.store?.name}</Badge>
                        {(product.category || []).slice(0, 1).map((cat) => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold">{product.current_price} kr</p>
                        <p className="text-sm text-muted-foreground">
                          {product.current_unit_price} kr/{product.weight_unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          Se detaljer
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" asChild>
                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Besøk butikk</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {bookmarkedProductsData.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Du har {bookmarkedProducts.length} bokmerkede produkter
          </div>
        )}
      </motion.div>
    </div>
  )
}
