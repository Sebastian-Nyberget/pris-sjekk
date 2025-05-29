"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/product-data";
import { PriceHistoryChart } from "@/components/price-history-chart";

interface ProductCardProps {
  product: Product;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function ProductCard({
  product,
  isBookmarked,
  onToggleBookmark,
}: ProductCardProps) {
  const [showChart, setShowChart] = useState(false);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
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
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark();
            }}
          >
            <Bookmark
              className="h-5 w-5"
              fill={isBookmarked ? "currentColor" : "none"}
            />
            <span className="sr-only">Bookmark</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">
              {product.brand}
            </p>
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
        <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-2xl font-bold">{product.current_price} kr</p>
              <p className="text-sm text-muted-foreground">
                {product.current_unit_price} kr/l
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
            >
              {showChart ? "Hide History" : "Price History"}
            </Button>
          </div>

          {showChart && (product.price_history || []).length > 0 && (
            <div className="w-full mt-2">
              <PriceHistoryChart priceHistory={product.price_history} />
            </div>
          )}

          <Link href={`/produkter/${product.id}`} className="w-full">
            <Button className="w-full mt-2">Se detaljer</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
