import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductByHandle } from "@/lib/shopify";

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
  productType?: string;
  vendor?: string;
}

function transformShopifyProduct(shopifyProduct: any): Product {
  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    handle: shopifyProduct.handle,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    images: shopifyProduct.images.edges.map((edge: any) => ({
      id: edge.node.id,
      src: edge.node.url,
      altText: edge.node.altText,
    })),
    variants: shopifyProduct.variants.edges.map((edge: any) => {
      const variant = edge.node;
      const sizeOption = variant.selectedOptions.find(
        (opt: any) => opt.name.toLowerCase() === "size"
      );
      const colorOption = variant.selectedOptions.find(
        (opt: any) => opt.name.toLowerCase() === "color"
      );

      return {
        id: variant.id,
        title: variant.title,
        price: parseFloat(variant.price.amount),
        compareAtPrice: variant.compareAtPrice
          ? parseFloat(variant.compareAtPrice.amount)
          : undefined,
        size: sizeOption?.value,
        color: colorOption?.value,
        available: variant.availableForSale,
        inventoryQuantity: variant.quantityAvailable,
        sku: variant.sku,
      };
    }),
    tags: shopifyProduct.tags,
    productType: shopifyProduct.productType,
    vendor: shopifyProduct.vendor,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await getAllProducts();
      const products = data.products.edges.map((edge: any) =>
        transformShopifyProduct(edge.node)
      );
      return { products };
    },
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const data = await getProductByHandle(handle);
      if (!data.productByHandle) {
        throw new Error("Product not found");
      }
      const product = transformShopifyProduct(data.productByHandle);
      return { product };
    },
    enabled: !!handle,
  });
}
