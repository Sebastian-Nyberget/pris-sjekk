"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showFirstLast = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Beregn hvilke sidetall som skal vises
  const getVisiblePageNumbers = () => {
    const pages = []
    let startPage: number
    let endPage: number
    let showStartEllipsis = false
    let showEndEllipsis = false

    if (totalPages <= maxVisiblePages) {
      // Vis alle sider hvis det er færre enn maxVisiblePages
      startPage = 1
      endPage = totalPages
    } else {
      const middlePage = Math.floor(maxVisiblePages / 2)

      if (currentPage <= middlePage + 1) {
        // Nær starten
        startPage = 1
        endPage = maxVisiblePages - 1
        showEndEllipsis = endPage < totalPages - 1
      } else if (currentPage >= totalPages - middlePage) {
        // Nær slutten
        startPage = totalPages - maxVisiblePages + 2
        endPage = totalPages
        showStartEllipsis = startPage > 2
      } else {
        // I midten
        startPage = currentPage - Math.floor((maxVisiblePages - 3) / 2)
        endPage = currentPage + Math.floor((maxVisiblePages - 3) / 2)
        showStartEllipsis = startPage > 2
        showEndEllipsis = endPage < totalPages - 1
      }
    }

    // Legg til første side hvis nødvendig
    if (showStartEllipsis) {
      pages.push(1)
      if (startPage > 2) {
        pages.push("ellipsis-start")
      }
    }

    // Legg til hovedsidene
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Legg til siste side hvis nødvendig
    if (showEndEllipsis) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end")
      }
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePageNumbers()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-1">
        {/* Første side knapp */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || disabled}
            title="Første side"
            className="h-9 w-9"
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Første side</span>
          </Button>
        )}

        {/* Forrige side knapp */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          className="h-9 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Forrige
        </Button>

        {/* Sidetall */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <div key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                disabled={disabled}
                className="h-9 w-9"
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Neste side knapp */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          className="h-9 px-3"
        >
          Neste
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        {/* Siste side knapp */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || disabled}
            title="Siste side"
            className="h-9 w-9"
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Siste side</span>
          </Button>
        )}
      </div>

      {/* Hurtignavigasjon for mobile */}
      <div className="flex md:hidden items-center space-x-2">
        <span className="text-sm text-muted-foreground">Gå til side:</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={disabled}
          className="px-2 py-1 border rounded text-sm"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
