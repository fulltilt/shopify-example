import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllProducts } from "@/lib/shopify";

export async function POST() {
  try {
    // Fetch products from Shopify
    const shopifyData = await getAllProducts();

    if (!shopifyData?.products?.edges) {
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    const products = shopifyData.products.edges;

    for (const { node: product } of products) {
      // Upsert product
      const upsertedProduct = await prisma.product.upsert({
        where: { shopifyId: product.id },
        update: {
          title: product.title,
          description: product.description,
          handle: product.handle,
          productType: product.productType,
          vendor: product.vendor,
          tags: product.tags,
        },
        create: {
          shopifyId: product.id,
          title: product.title,
          description: product.description,
          handle: product.handle,
          productType: product.productType,
          vendor: product.vendor,
          tags: product.tags,
        },
      });

      // Sync variants
      for (const { node: variant } of product.variants.edges) {
        const sizeOption = variant.selectedOptions.find(
          (opt: { name: string; value: string }) =>
            opt.name.toLowerCase() === "size"
        );
        const colorOption = variant.selectedOptions.find(
          (opt: { name: string; value: string }) =>
            opt.name.toLowerCase() === "color"
        );

        await prisma.productVariant.upsert({
          where: { shopifyVariantId: variant.id },
          update: {
            title: variant.title,
            price: Number.parseFloat(variant.price.amount),
            compareAtPrice: variant.compareAtPrice
              ? Number.parseFloat(variant.compareAtPrice.amount)
              : null,
            sku: variant.sku,
            inventoryQuantity: variant.quantityAvailable,
            size: sizeOption?.value,
            color: colorOption?.value,
            available: variant.availableForSale,
          },
          create: {
            productId: upsertedProduct.id,
            shopifyVariantId: variant.id,
            title: variant.title,
            price: Number.parseFloat(variant.price.amount),
            compareAtPrice: variant.compareAtPrice
              ? Number.parseFloat(variant.compareAtPrice.amount)
              : null,
            sku: variant.sku,
            inventoryQuantity: variant.quantityAvailable,
            size: sizeOption?.value,
            color: colorOption?.value,
            available: variant.availableForSale,
          },
        });
      }

      // Sync images
      for (const { node: image } of product.images.edges) {
        // Check if image already exists
        const existingImage = await prisma.productImage.findFirst({
          where: {
            productId: upsertedProduct.id,
            shopifyImageId: image.id,
          },
        });

        if (existingImage) {
          await prisma.productImage.update({
            where: { id: existingImage.id },
            data: {
              src: image.url,
              altText: image.altText,
            },
          });
        } else {
          await prisma.productImage.create({
            data: {
              productId: upsertedProduct.id,
              shopifyImageId: image.id,
              src: image.url,
              altText: image.altText,
              position: 1,
            },
          });
        }
      }
    }

    return NextResponse.json({
      message: "Products synced successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync products" },
      { status: 500 }
    );
  }
}
