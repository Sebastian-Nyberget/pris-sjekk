"use client"

import { useState, useEffect } from "react"

export function useBookmarks() {
  const [bookmarkedProducts, setBookmarkedProducts] = useState<number[]>([])

// Load bookmarks from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookmarked-products")
      if (saved) {
        setBookmarkedProducts(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error)
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("bookmarked-products", JSON.stringify(bookmarkedProducts))
    } catch (error) {
      console.error("Failed to save bookmarks:", error)
    }
  }, [bookmarkedProducts])

  const isBookmarked = (productId: number): boolean => {
    return bookmarkedProducts.includes(productId)
  }

  const toggleBookmark = (productId: number): void => {
    setBookmarkedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const addBookmark = (productId: number): void => {
    setBookmarkedProducts((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }

  const removeBookmark = (productId: number): void => {
    setBookmarkedProducts((prev) => prev.filter((id) => id !== productId))
  }

  const clearBookmarks = (): void => {
    setBookmarkedProducts([])
  }

  return {
    bookmarkedProducts,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    clearBookmarks,
  }
}
