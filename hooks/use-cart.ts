"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { apiClient } from "@/lib/api-client";

export interface CartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    handle: string;
    image?: string;
  };
  variant: {
    title: string;
    size?: string;
    color?: string;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export function useCart() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => apiClient<Cart>("/cart"),
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (data: {
      productVariantId: string;
      quantity: number;
      price: number;
    }) =>
      apiClient("/cart/add", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (data: { itemId: string; quantity: number }) =>
      apiClient("/cart/update", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: (itemId: string) =>
      apiClient(`/cart/remove/${itemId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });
    },
  });
}
