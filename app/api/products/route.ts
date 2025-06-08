import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: {
          where: { available: true },
          orderBy: { price: "asc" },
        },
        images: {
          orderBy: { position: "asc" },
        },
      },
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      price: product.variants[0]?.price || 0,
      compareAtPrice: product.variants[0]?.compareAtPrice || undefined,
      images: product.images.map((img) => ({
        id: img.id,
        src: img.src,
        altText: img.altText,
      })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: Number(variant.price),
        size: variant.size,
        color: variant.color,
        available: variant.available,
        inventoryQuantity: variant.inventoryQuantity,
      })),
      tags: product.tags,
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
