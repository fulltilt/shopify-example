import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  price: number;
  compareAtPrice?: number;
  images: Array<{
    id: string;
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    size?: string;
    color?: string;
    available: boolean;
    inventoryQuantity: number;
    sku?: string;
  }>;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  reviews?: Array<{
    id: string;
    rating: number;
    title?: string;
    content?: string;
    createdAt: Date;
    user: {
      name: string;
    };
  }>;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient<{ products: Product[] }>("/products"),
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: () => apiClient<{ product: Product }>(`/products/${handle}`),
    enabled: !!handle,
  });
}

export function useSyncProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient("/sync-products", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
