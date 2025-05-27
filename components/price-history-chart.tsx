"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PriceHistoryChartProps {
  priceHistory: Array<{
    price: number;
    date: string;
  }>;
}

export function PriceHistoryChart({ priceHistory }: PriceHistoryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !priceHistory.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort price history by date
    const sortedHistory = [...priceHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Find min and max prices
    const prices = sortedHistory.map((item) => item.price);
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;

    // Calculate dimensions
    const padding = 20;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#e2e8f0";
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;

    sortedHistory.forEach((item, index) => {
      const x = padding + (index / (sortedHistory.length - 1)) * chartWidth;
      const y =
        canvas.height -
        padding -
        ((item.price - minPrice) / (maxPrice - minPrice)) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    sortedHistory.forEach((item, index) => {
      const x = padding + (index / (sortedHistory.length - 1)) * chartWidth;
      const y =
        canvas.height -
        padding -
        ((item.price - minPrice) / (maxPrice - minPrice)) * chartHeight;

      ctx.beginPath();
      ctx.fillStyle = "#8b5cf6";
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [priceHistory]);

  return (
    <motion.div
      className="w-full h-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={300}
        height={100}
        className="w-full h-full"
      />
    </motion.div>
  );
}
