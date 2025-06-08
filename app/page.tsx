"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";

export default function HomePage() {
  const { data, isLoading, error } = useProducts();

  const featuredProducts = data?.products?.slice(0, 3) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center text-white space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate Your Style
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Discover premium clothing that combines comfort, quality, and
            contemporary design for the modern lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/collections">View Collections</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked favorites that showcase our commitment to quality and
              style
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Unable to load featured products
              </p>
              <Button variant="outline" asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No products available yet
              </p>
              <Button variant="outline" asChild>
                <Link href="/products">Check Back Soon</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer overflow-hidden"
                >
                  <Link href={`/products/${product.handle}`}>
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={
                          product.images[0]?.src ||
                          "/placeholder.svg?height=400&width=400"
                        }
                        alt={product.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {product.compareAtPrice && (
                        <Badge
                          className="absolute top-4 left-4"
                          variant="destructive"
                        >
                          Sale
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {product.description || "Premium quality clothing"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            ${product.price}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.compareAtPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Curated collections for every occasion and style preference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/products?category=casual"
              className="relative h-[300px] rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Casual Collection"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Casual Collection</h3>
                  <p className="mb-4">Everyday comfort meets style</p>
                  <Button variant="secondary">Shop Casual</Button>
                </div>
              </div>
            </Link>

            <Link
              href="/products?category=formal"
              className="relative h-[300px] rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src="/placeholder.svg?height=300&width=600"
                alt="Formal Collection"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Formal Collection</h3>
                  <p className="mb-4">
                    Sophisticated pieces for special occasions
                  </p>
                  <Button variant="secondary">Shop Formal</Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, style tips, and
            early access to new collections
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
