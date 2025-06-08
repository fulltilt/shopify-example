"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getCart,
} from "@/lib/shopify";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    title: string;
    handle: string;
    image?: string;
  };
  variant: {
    id: string;
    title: string;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  checkoutUrl: string;
}

function transformShopifyCart(shopifyCart: any): Cart {
  const items: CartItem[] = shopifyCart.lines.edges.map((edge: any) => {
    const line = edge.node;
    const product = line.merchandise.product;

    return {
      id: line.id,
      quantity: line.quantity,
      price: Number.parseFloat(line.merchandise.price.amount),
      product: {
        title: product.title,
        handle: product.handle,
        image: product.images.edges[0]?.node.url,
      },
      variant: {
        id: line.merchandise.id,
        title: line.merchandise.title,
      },
    };
  });

  const total = Number.parseFloat(shopifyCart.estimatedCost.totalAmount.amount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: shopifyCart.id,
    items,
    total,
    itemCount,
    checkoutUrl: shopifyCart.checkoutUrl,
  };
}

export function useCart() {
  const [cartId, setCartId] = useLocalStorage<string | null>(
    "shopify-cart-id",
    null
  );

  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      if (!cartId) {
        // Create new cart
        const data = await createCart();
        const newCartId = data.cartCreate.cart.id;
        setCartId(newCartId);
        return transformShopifyCart(data.cartCreate.cart);
      }

      // Get existing cart
      const data = await getCart(cartId);
      if (!data.cart) {
        // Cart doesn't exist, create new one
        const newData = await createCart();
        const newCartId = newData.cartCreate.cart.id;
        setCartId(newCartId);
        return transformShopifyCart(newData.cartCreate.cart);
      }

      return transformShopifyCart(data.cart);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const [cartId] = useLocalStorage<string | null>("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (data: { variantId: string; quantity: number }) => {
      if (!cartId) {
        throw new Error("No cart found");
      }
      return addToCart(cartId, data.variantId, data.quantity);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["cart", cartId],
        transformShopifyCart(data.cartLinesAdd.cart)
      );
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const [cartId] = useLocalStorage<string | null>("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (data: { lineId: string; quantity: number }) => {
      if (!cartId) {
        throw new Error("No cart found");
      }
      return updateCartLines(cartId, [
        { id: data.lineId, quantity: data.quantity },
      ]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["cart", cartId],
        transformShopifyCart(data.cartLinesUpdate.cart)
      );
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const [cartId] = useLocalStorage<string | null>("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (lineId: string) => {
      if (!cartId) {
        throw new Error("No cart found");
      }
      return removeFromCart(cartId, [lineId]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["cart", cartId],
        transformShopifyCart(data.cartLinesRemove.cart)
      );
    },
  });
}
