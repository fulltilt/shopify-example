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
  const [cartId, setCartId, isLocalStorageLoaded] = useLocalStorage<
    string | null
  >("shopify-cart-id", null);

  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      console.log("🛒 Cart query running with cartId:", cartId);
      console.log("📦 LocalStorage loaded:", isLocalStorageLoaded);

      // If we have a cart ID, try to fetch the existing cart first
      if (cartId && cartId.trim() !== "") {
        try {
          console.log("🔍 Fetching existing cart:", cartId);
          const data = await getCart(cartId);
          if (data.cart) {
            console.log(
              "✅ Found existing cart with",
              data.cart.lines.edges.length,
              "items"
            );
            return transformShopifyCart(data.cart);
          } else {
            console.log("❌ Cart not found in Shopify, will create new one");
          }
        } catch (error) {
          console.error("❌ Error fetching cart:", error);
          // If cart fetch fails, we'll create a new one below
        }
      }

      // Create new cart if no existing cart found
      console.log("🆕 Creating new cart...");
      const data = await createCart();
      const newCartId = data.cartCreate.cart.id;
      console.log("✅ New cart created:", newCartId);
      setCartId(newCartId);
      return transformShopifyCart(data.cartCreate.cart);
    },
    enabled: isLocalStorageLoaded, // Only run query after localStorage is loaded
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const [cartId, setCartId, isLocalStorageLoaded] = useLocalStorage<
    string | null
  >("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (data: { variantId: string; quantity: number }) => {
      // Validate inputs
      if (!data.variantId || data.variantId.trim() === "") {
        throw new Error("Invalid variant ID provided");
      }

      if (data.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      console.log("🛒 Adding to cart with data:", data);
      console.log("🆔 Current cart ID:", cartId);

      let currentCartId = cartId;

      // If no cart exists, create one first
      if (!currentCartId || currentCartId.trim() === "") {
        console.log("🆕 No cart ID found, creating new cart...");
        const newCartData = await createCart();
        currentCartId = newCartData.cartCreate.cart.id;
        setCartId(currentCartId);
        console.log("✅ New cart created for add to cart:", currentCartId);
      }

      // Now add the item to the cart
      console.log(
        "➕ Adding item to cart:",
        currentCartId,
        data.variantId,
        data.quantity
      );
      const result = await addToCart(
        currentCartId!,
        data.variantId,
        data.quantity
      );

      // Update the cart ID in case it changed
      const updatedCartId = result.cartLinesAdd.cart.id;
      if (updatedCartId !== currentCartId) {
        console.log("🔄 Cart ID changed, updating:", updatedCartId);
        setCartId(updatedCartId);
      }

      return result;
    },
    onSuccess: (data) => {
      console.log("✅ Add to cart success");
      const cart = data.cartLinesAdd.cart;
      const cartData = transformShopifyCart(cart);

      // Update query cache
      queryClient.setQueryData(["cart", cart.id], cartData);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("❌ Add to cart error:", error);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const [cartId] = useLocalStorage<string | null>("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (data: { lineId: string; quantity: number }) => {
      if (!cartId || cartId.trim() === "") {
        throw new Error(
          "No cart found. Please refresh the page and try again."
        );
      }

      console.log("🔄 Updating cart item:", data);

      // If quantity is 0, remove the item instead
      if (data.quantity === 0) {
        return removeFromCart(cartId, [data.lineId]);
      }

      return updateCartLines(cartId, [
        { id: data.lineId, quantity: data.quantity },
      ]);
    },
    onSuccess: (data) => {
      console.log("✅ Cart item updated");
      const cart = data.cartLinesUpdate?.cart || data.cartLinesRemove?.cart;
      if (cart) {
        const cartData = transformShopifyCart(cart);
        queryClient.setQueryData(["cart", cartId], cartData);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const [cartId] = useLocalStorage<string | null>("shopify-cart-id", null);

  return useMutation({
    mutationFn: async (lineId: string) => {
      if (!cartId || cartId.trim() === "") {
        throw new Error(
          "No cart found. Please refresh the page and try again."
        );
      }

      console.log("🗑️ Removing item from cart:", lineId);
      return removeFromCart(cartId, [lineId]);
    },
    onSuccess: (data) => {
      console.log("✅ Item removed from cart");
      const cartData = transformShopifyCart(data.cartLinesRemove.cart);
      queryClient.setQueryData(["cart", cartId], cartData);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
