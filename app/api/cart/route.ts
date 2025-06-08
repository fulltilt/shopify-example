import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (!userId && !sessionId) {
    throw new Error("Either userId or sessionId is required");
  }

  // Try to find existing cart
  let cart = await prisma.cart.findFirst({
    where: userId
      ? { userId, status: "ACTIVE" }
      : { sessionId, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
  });

  if (!cart) {
    // Create new cart
    cart = await prisma.cart.create({
      data: {
        userId: userId || null,
        sessionId: sessionId || null,
        status: "ACTIVE",
      },
    });
  }

  return cart;
}

export async function GET() {
  try {
    const { userId } = await auth();
    const headersList = await headers();
    const sessionId = headersList.get("x-session-id") || "anonymous";

    const cart = await getOrCreateCart(userId || undefined, sessionId);

    const cartWithItems = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { position: 1 },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cartWithItems) {
      return NextResponse.json({
        id: cart.id,
        items: [],
        total: 0,
        itemCount: 0,
      });
    }

    const items = cartWithItems.items.map((item) => ({
      id: item.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      price: Number(item.price),
      product: {
        title: item.productVariant.product.title,
        handle: item.productVariant.product.handle,
        image: item.productVariant.product.images[0]?.src,
      },
      variant: {
        title: item.productVariant.title,
        size: item.productVariant.size,
        color: item.productVariant.color,
      },
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      id: cartWithItems.id,
      items,
      total,
      itemCount,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
