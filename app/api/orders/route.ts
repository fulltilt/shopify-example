import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This would be your Shopify Admin API endpoint
const SHOPIFY_ADMIN_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/graphql.json`;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock data
    // In production, you'd query Shopify Admin API here
    const mockOrders = [
      {
        id: "gid://shopify/Order/1",
        orderNumber: 1001,
        processedAt: "2024-01-15T10:30:00Z",
        financialStatus: "PAID",
        fulfillmentStatus: "FULFILLED",
        totalPrice: { amount: "89.99", currencyCode: "USD" },
        lineItems: [
          {
            title: "Premium Cotton T-Shirt - Black / M",
            quantity: 2,
            variant: {
              price: { amount: "29.99", currencyCode: "USD" },
              image: { url: "/placeholder.svg?height=100&width=100" },
              product: {
                handle: "premium-cotton-tshirt",
                title: "Premium Cotton T-Shirt",
              },
            },
          },
          {
            title: "Denim Jacket - Blue / L",
            quantity: 1,
            variant: {
              price: { amount: "79.99", currencyCode: "USD" },
              image: { url: "/placeholder.svg?height=100&width=100" },
              product: { handle: "denim-jacket", title: "Denim Jacket" },
            },
          },
        ],
      },
      {
        id: "gid://shopify/Order/2",
        orderNumber: 1002,
        processedAt: "2024-01-20T14:15:00Z",
        financialStatus: "PAID",
        fulfillmentStatus: "UNFULFILLED",
        totalPrice: { amount: "45.99", currencyCode: "USD" },
        lineItems: [
          {
            title: "Casual Hoodie - Gray / L",
            quantity: 1,
            variant: {
              price: { amount: "45.99", currencyCode: "USD" },
              image: { url: "/placeholder.svg?height=100&width=100" },
              product: { handle: "casual-hoodie", title: "Casual Hoodie" },
            },
          },
        ],
      },
    ];

    return NextResponse.json({ orders: mockOrders });

    // Production code would look like this:
    /*
    if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json({ error: "Shopify Admin API not configured" }, { status: 500 })
    }

    const query = `
      query GetOrdersByEmail($query: String!) {
        orders(first: 50, query: $query) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      price
                      image {
                        url
                      }
                      product {
                        handle
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch(SHOPIFY_ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { query: `email:${email}` }
      })
    })

    const data = await response.json()
    return NextResponse.json(data.data)
    */
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
