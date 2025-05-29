"use client"

import React from "react"
import { use, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Bookmark, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { apiClient } from "@/lib/api-client"
import { fallbackProducts } from "@/lib/product-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { useUser } from "@clerk/nextjs"
import { Product, ProductCategory, ProductLabel, ProductNutrition, ProductAllergen } from "@/types/api"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { bookmarkedProducts, toggleBookmark } = useBookmarks()
  const isBookmarked = bookmarkedProducts.includes(Number(id))
  const { isSignedIn } = useUser()

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)

        // Fetch product from the correct API endpoint
        const productData = await apiClient.getProduct(Number.parseInt(id))
        setProduct(productData)
      } catch (error) {
        console.error("Error loading product:", error)
        setError("Kunne ikke laste produkt fra API")

        // Fallback to mock data
        const fallbackProduct = fallbackProducts.find((p) => p.id === Number.parseInt(id))
        if (fallbackProduct) {
          setProduct({
            ...fallbackProduct,
            allergens: fallbackProduct.allergens?.map((a) => ({
              ...a,
              contains:
                a.contains === "YES"
                  ? "YES"
                  : a.contains === "NO"
                  ? "NO"
                  : "UNKNOWN",
            })) ?? [],
          })
        } else {
          setProduct(null)
        }
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Laster produktdetaljer...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Produkt ikke funnet</h2>
          <p className="mb-6">Produktet du leter etter eksisterer ikke eller har blitt fjernet.</p>
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}
          <Link href="/produkter">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til produkter
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 flex flex-col max-w-full lg:px-48">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/produkter" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake til produkter
        </Link>
      </motion.div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error} - Viser reservedata.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg p-8 flex items-center justify-center mb-6">
            <img
              src={product.image || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              className="max-h-[400px] object-contain"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg?height=100&width=100"}
                alt={product.name}
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Produktvisning"
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Produktvisning"
                className="h-16 w-16 object-contain"
              />
            </div>
            <div className="bg-white rounded-lg p-2 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Produktvisning"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (!isSignedIn) {
                    alert("Logg inn for å bokmerke produkter")
                    return
                  }
                  toggleBookmark(product.id)
                }}
                className={isBookmarked ? "text-primary" : ""}
              >
                <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
                <span className="sr-only">Bokmerke</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {product.category?.map((cat: ProductCategory) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
              <Badge variant="outline">{product.store?.name}</Badge>
            </div>

            <div className="flex items-end gap-2 mt-2">
              <span className="text-3xl font-bold">{product.current_price} kr</span>
              <span className="text-sm text-muted-foreground">
                ({product.current_unit_price} kr/{product.weight_unit})
              </span>
            </div>

            {product.price_history && product.price_history.length > 0 && (
              <div className="h-[200px] mt-4">
                <h3 className="text-lg font-semibold mb-2">Prishistorikk</h3>
                <PriceHistoryChart priceHistory={product.price_history} />
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Button className="flex-1">Finn beste pris</Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={product.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Besøk butikk
                </a>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="details" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detaljer</TabsTrigger>
              <TabsTrigger value="nutrition">Næringsinnhold</TabsTrigger>
              <TabsTrigger value="allergens">Allergener</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold">Beskrivelse</h3>
                    <p>{product.description}</p>
                  </div>
                )}

                {product.ingredients && (
                  <div>
                    <h3 className="text-lg font-semibold">Ingredienser</h3>
                    <p className="text-sm">{product.ingredients}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold">Produktinformasjon</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Merke</span>
                      <span>{product.brand}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Vekt</span>
                      <span>
                        {product.weight} {product.weight_unit}
                      </span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">EAN</span>
                      <span>{product.ean}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">Leverandør</span>
                      <span>{product.vendor}</span>
                    </div>
                  </div>
                </div>

                {product.labels && product.labels.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Merker og sertifiseringer</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.labels.map((label: ProductLabel) => (
                        <TooltipProvider key={label.name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                {label.display_name}
                                <Info className="ml-1 h-3 w-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{label.description || `${label.display_name} sertifisert produkt`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Næringsinnhold</h3>
                {product.nutrition && product.nutrition.length > 0 ? (
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-3 border-b p-3">
                      <span className="font-medium">Næringsstoff</span>
                      <span className="font-medium">Mengde</span>
                      <span className="font-medium">Enhet</span>
                    </div>
                    {product.nutrition.map((item: ProductNutrition) => (
                      <div key={item.code} className="grid grid-cols-3 border-b p-3">
                        <span>{item.display_name}</span>
                        <span>{item.amount}</span>
                        <span>{item.unit}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Ingen næringsinnhold tilgjengelig for dette produktet.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="allergens" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Allergeninformasjon</h3>
                {product.allergens && product.allergens.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {product.allergens.filter((a: ProductAllergen) => a.contains === "YES").length > 0 ? (
                        product.allergens
                          .filter((a: ProductAllergen) => a.contains === "YES")
                          .map((allergen: ProductAllergen) => (
                            <div
                              key={allergen.code}
                              className="flex items-center gap-2 p-2 border rounded-lg bg-red-50"
                            >
                              <span className="font-medium text-red-600">Inneholder: {allergen.display_name}</span>
                            </div>
                          ))
                      ) : (
                        <p>Ingen allergener oppført for dette produktet.</p>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Inneholder ikke:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.allergens
                          .filter((a: ProductAllergen) => a.contains === "NO")
                          .map((allergen: ProductAllergen) => (
                            <TooltipProvider key={allergen.code}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="cursor-help">
                                    {allergen.display_name}
                                    <Info className="ml-1 h-3 w-3" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Dette produktet inneholder ikke {allergen.display_name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Ingen allergeninformasjon tilgjengelig for dette produktet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
