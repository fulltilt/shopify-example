"use client";

import { useState, useEffect, useMemo } from "react";
import { useProducts, type Product } from "./use-products";

export function useProductSearch() {
  const { data, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const allProducts = data?.products || [];

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return allProducts;
    }

    const query = searchQuery.toLowerCase().trim();

    return allProducts.filter((product: Product) => {
      // Search in title
      if (product.title.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (product.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in tags
      if (product.tags.some((tag) => tag.toLowerCase().includes(query))) {
        return true;
      }

      // Search in product type
      if (product.productType?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in vendor
      if (product.vendor?.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [allProducts, searchQuery]);

  useEffect(() => {
    setSearchResults(filteredProducts);
  }, [filteredProducts]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length,
  };
}
