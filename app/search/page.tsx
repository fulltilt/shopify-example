"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useProductSearch } from "@/hooks/use-product-search";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { setSearchQuery, searchResults, isLoading, totalResults } =
    useProductSearch();

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query, setSearchQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4">
              <Skeleton className="h-6 mb-2" />
              <Skeleton className="h-4 mb-3" />
              <Skeleton className="h-10" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No products found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find any products matching "{query}". Try adjusting your
          search terms.
        </p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {searchResults.map((product) => (
        <Card key={product.id} className="group cursor-pointer overflow-hidden">
          <Link href={`/products/${product.handle}`}>
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.images[0]?.src || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {product.compareAtPrice && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  Sale
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>
              <Button className="w-full" size="sm">
                View Details
              </Button>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query && (
          <p className="text-muted-foreground">Showing results for "{query}"</p>
        )}
      </div>

      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
