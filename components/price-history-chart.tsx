"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { PriceChartProps } from "@/types/ui"
import { formatNOKCompact } from "@/lib/utils"

export function PriceHistoryChart({
  priceHistory,
  height = 200,
  width = 400,
  showTooltip = true,
  animate = true,
}: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    price: number
    date: string
  }>({
    visible: false,
    x: 0,
    y: 0,
    price: 0,
    date: "",
  })

  useEffect(() => {
    if (!canvasRef.current || !priceHistory.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Sort price history by date
    const sortedHistory = [...priceHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Find min and max prices with some padding
    const prices = sortedHistory.map((item) => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const paddedMin = minPrice - priceRange * 0.1
    const paddedMax = maxPrice + priceRange * 0.1

    // Calculate dimensions
    const padding = { top: 20, right: 40, bottom: 40, left: 60 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Draw grid lines and Y-axis labels
    ctx.strokeStyle = "#f1f5f9"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"
    ctx.lineWidth = 1

    const ySteps = 5
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (i / ySteps) * chartHeight
      const price = paddedMax - (i / ySteps) * (paddedMax - paddedMin)

      // Draw grid line
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Draw Y-axis label with NOK formatting
      const priceText = formatNOKCompact(price)
      const textWidth = ctx.measureText(priceText).width
      ctx.fillText(priceText, padding.left - textWidth - 10, y + 4)
    }

    // Draw X-axis
    ctx.strokeStyle = "#e2e8f0"
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + chartHeight)
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.stroke()

    // Draw Y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.stroke()

    // Draw price line
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    sortedHistory.forEach((item, index) => {
      const x = padding.left + (index / (sortedHistory.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((item.price - paddedMin) / (paddedMax - paddedMin)) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    ctx.fillStyle = "#8b5cf6"
    sortedHistory.forEach((item, index) => {
      const x = padding.left + (index / (sortedHistory.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((item.price - paddedMin) / (paddedMax - paddedMin)) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Add white border to points
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
    })

    // Add X-axis date labels (show first, middle, and last)
    ctx.fillStyle = "#64748b"
    ctx.font = "11px Inter, sans-serif"
    const labelIndices = [0, Math.floor(sortedHistory.length / 2), sortedHistory.length - 1]

    labelIndices.forEach((index) => {
      if (index < sortedHistory.length) {
        const item = sortedHistory[index]
        const x = padding.left + (index / (sortedHistory.length - 1)) * chartWidth
        const date = new Date(item.date).toLocaleDateString("nb-NO", {
          month: "short",
          day: "numeric",
        })
        const textWidth = ctx.measureText(date).width
        ctx.fillText(date, x - textWidth / 2, padding.top + chartHeight + 20)
      }
    })
  }, [priceHistory, height, width])

  // Handle mouse events for tooltip
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTooltip || !canvasRef.current || !priceHistory.length) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left

    const padding = { top: 20, right: 40, bottom: 40, left: 60 }
    const chartWidth = rect.width - padding.left - padding.right

    // Check if mouse is within chart area
    if (x >= padding.left && x <= padding.left + chartWidth) {
      const sortedHistory = [...priceHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const relativeX = (x - padding.left) / chartWidth
      const dataIndex = Math.round(relativeX * (sortedHistory.length - 1))

      if (dataIndex >= 0 && dataIndex < sortedHistory.length) {
        const dataPoint = sortedHistory[dataIndex]
        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          price: dataPoint.price,
          date: new Date(dataPoint.date).toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        })
      }
    } else {
      setTooltip((prev) => ({ ...prev, visible: false }))
    }
  }

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  const MotionWrapper = animate ? motion.div : "div"

  return (
    <MotionWrapper
      ref={containerRef}
      className="relative w-full"
      style={{ height }}
      {...(animate && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      })}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip */}
      {tooltip.visible && showTooltip && (
        <div
          className="absolute z-10 bg-background border border-border rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: tooltip.x - (containerRef.current?.getBoundingClientRect().left || 0) - 80,
            top: tooltip.y - (containerRef.current?.getBoundingClientRect().top || 0) - 60,
          }}
        >
          <div className="text-sm font-semibold">{formatNOKCompact(tooltip.price)}</div>
          <div className="text-xs text-muted-foreground">{tooltip.date}</div>
        </div>
      )}
    </MotionWrapper>
  )
}
