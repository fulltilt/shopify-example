const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sample products
  const tshirt = await prisma.product.create({
    data: {
      shopifyId: "gid://shopify/Product/1",
      title: "Classic Cotton T-Shirt",
      description:
        "Comfortable everyday cotton t-shirt perfect for casual wear",
      handle: "classic-cotton-tshirt",
      productType: "T-Shirts",
      vendor: "Your Brand",
      tags: ["cotton", "casual", "basic"],
      variants: {
        create: [
          {
            shopifyVariantId: "gid://shopify/ProductVariant/1",
            title: "Small / Black",
            price: 29.99,
            sku: "TSHIRT-S-BLK",
            size: "S",
            color: "Black",
            inventoryQuantity: 50,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/2",
            title: "Medium / Black",
            price: 29.99,
            sku: "TSHIRT-M-BLK",
            size: "M",
            color: "Black",
            inventoryQuantity: 75,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/3",
            title: "Large / Black",
            price: 29.99,
            sku: "TSHIRT-L-BLK",
            size: "L",
            color: "Black",
            inventoryQuantity: 60,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/4",
            title: "Small / White",
            price: 29.99,
            sku: "TSHIRT-S-WHT",
            size: "S",
            color: "White",
            inventoryQuantity: 45,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/5",
            title: "Medium / White",
            price: 29.99,
            sku: "TSHIRT-M-WHT",
            size: "M",
            color: "White",
            inventoryQuantity: 80,
          },
        ],
      },
      images: {
        create: [
          {
            src: "/placeholder.svg?height=400&width=400",
            altText: "Classic Cotton T-Shirt",
            position: 1,
          },
        ],
      },
    },
  });

  const jacket = await prisma.product.create({
    data: {
      shopifyId: "gid://shopify/Product/2",
      title: "Denim Jacket",
      description: "Vintage-style denim jacket with modern fit",
      handle: "denim-jacket",
      productType: "Jackets",
      vendor: "Your Brand",
      tags: ["denim", "jacket", "vintage"],
      variants: {
        create: [
          {
            shopifyVariantId: "gid://shopify/ProductVariant/6",
            title: "Small / Blue",
            price: 89.99,
            sku: "JACKET-S-BLU",
            size: "S",
            color: "Blue",
            inventoryQuantity: 25,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/7",
            title: "Medium / Blue",
            price: 89.99,
            sku: "JACKET-M-BLU",
            size: "M",
            color: "Blue",
            inventoryQuantity: 30,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/8",
            title: "Large / Blue",
            price: 89.99,
            sku: "JACKET-L-BLU",
            size: "L",
            color: "Blue",
            inventoryQuantity: 20,
          },
        ],
      },
      images: {
        create: [
          {
            src: "/placeholder.svg?height=400&width=400",
            altText: "Denim Jacket",
            position: 1,
          },
        ],
      },
    },
  });

  const jeans = await prisma.product.create({
    data: {
      shopifyId: "gid://shopify/Product/3",
      title: "Slim Fit Jeans",
      description: "Premium denim jeans with slim fit cut",
      handle: "slim-fit-jeans",
      productType: "Jeans",
      vendor: "Your Brand",
      tags: ["denim", "jeans", "slim-fit"],
      variants: {
        create: [
          {
            shopifyVariantId: "gid://shopify/ProductVariant/9",
            title: "30x32 / Dark Blue",
            price: 79.99,
            sku: "JEANS-30-32-DBLUE",
            size: "30x32",
            color: "Dark Blue",
            inventoryQuantity: 40,
          },
          {
            shopifyVariantId: "gid://shopify/ProductVariant/10",
            title: "32x32 / Dark Blue",
            price: 79.99,
            sku: "JEANS-32-32-DBLUE",
            size: "32x32",
            color: "Dark Blue",
            inventoryQuantity: 35,
          },
        ],
      },
      images: {
        create: [
          {
            src: "/placeholder.svg?height=400&width=400",
            altText: "Slim Fit Jeans",
            position: 1,
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully!");
  console.log(
    `Created products: ${tshirt.title}, ${jacket.title}, ${jeans.title}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
