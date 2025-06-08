import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: { handle: params.handle },
      include: {
        variants: {
          orderBy: { price: "asc" },
        },
        images: {
          orderBy: { position: "asc" },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
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
        compareAtPrice: variant.compareAtPrice
          ? Number(variant.compareAtPrice)
          : undefined,
        size: variant.size,
        color: variant.color,
        available: variant.available,
        inventoryQuantity: variant.inventoryQuantity,
        sku: variant.sku,
      })),
      tags: product.tags,
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
        user: {
          name: `${review.user.firstName} ${review.user.lastName}`.trim(),
        },
      })),
      rating:
        product.reviews.length > 0
          ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    };

    return NextResponse.json({ product: formattedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
