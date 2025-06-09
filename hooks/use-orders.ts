"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    price: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
    };
    product: {
      handle: string;
      title: string;
    };
  };
}

export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: OrderLineItem[];
}

export function useOrders() {
  const { user, isLoaded } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  return useQuery({
    queryKey: ["orders", userEmail],
    queryFn: async () => {
      if (!userEmail) {
        throw new Error("User email not available");
      }

      const response = await fetch(
        `/api/orders?email=${encodeURIComponent(userEmail)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      return data.orders as Order[];
    },
    enabled: isLoaded && !!userEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
