"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export default function Home() {
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

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-40 flex flex-col items-center w-full">
        <div className="container px-4 md:px-6 w-full flex flex-col items-center">
          <motion.div
            className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Finn de beste tilbudene på favorittproduktene dine
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Sammenlign priser på tvers av flere butikker og spar penger på
                  dine daglige kjøp.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col gap-2 min-[400px]:flex-row"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-800 to-blue-300 text-white"
                  >
                    Se Produkter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Image
                src="/shopping-cart.png"
                width={500}
                height={500}
                alt="Hero Image"
                className="rounded-lg object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Funksjoner
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Alt Du Trenger For å Spare Penger
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Plattformen vår hjelper deg med å finne de beste tilbudene og
                sammenligne priser på tvers av flere butikker.
              </p>
            </div>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="grid gap-1 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg h-40"
              variants={item}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Prissammenligning</h3>
              </div>
              <p className="text-muted-foreground">
                Sammenlign priser på tvers av flere butikker for å finne de
                beste tilbudene.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-1 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg h-45"
              variants={item}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Pris Historikk</h3>
              </div>
              <p className="text-muted-foreground">
                Spor prisendringer over tid for å foreta informerte kjøp
                beslutninger.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-1 bg-gray-200 dark:bg-gray-700 p-6 rounded-lg h-40"
              variants={item}
            >
              <div className="flex items-center gap-2">
                <Tag className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Tilbud Varsler</h3>
              </div>
              <p className="text-muted-foreground">
                Bli varslet når prisene synker på favorittproduktene dine.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Start Sparingen i Dag!
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Bli med tusenvis av smarte shoppere som sparer penger hver dag.
              </p>
            </div>
            <SignedIn>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-800 to-blue-400 text-white"
                >
                  Se Produkter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignUpButton>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-800 to-blue-400 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-300"
                >
                  Registrer
                </Button>
              </SignUpButton>
            </SignedOut>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
