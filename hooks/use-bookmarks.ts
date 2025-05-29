"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

export function useBookmarks() {
  const [bookmarkedProducts, setBookmarkedProducts] = useState<number[]>([])
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (!isSignedIn || !user) {
      setBookmarkedProducts([])
      return
    }

    try {
      const storageKey = `bookmarked-products-${user.id}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setBookmarkedProducts(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error)
    }
  }, [isSignedIn, user])

  useEffect(() => {
    if (!isSignedIn || !user) return

    try {
      const storageKey = `bookmarked-products-${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(bookmarkedProducts))
    } catch (error) {
      console.error("Failed to save bookmarks:", error)
    }
  }, [bookmarkedProducts, isSignedIn, user])

  const isBookmarked = (productId: number): boolean => {
    return bookmarkedProducts.includes(productId)
  }

  const toggleBookmark = (productId: number): void => {
    if (!isSignedIn) {
      return
    }

    setBookmarkedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const addBookmark = (productId: number): void => {
    if (!isSignedIn) return
    setBookmarkedProducts((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }

  const removeBookmark = (productId: number): void => {
    if (!isSignedIn) return
    setBookmarkedProducts((prev) => prev.filter((id) => id !== productId))
  }

  const clearBookmarks = (): void => {
    if (!isSignedIn) return
    setBookmarkedProducts([])
  }

  return {
    bookmarkedProducts,
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    clearBookmarks,
    isSignedIn,
  }
}
