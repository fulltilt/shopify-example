export type ShopifyCart = {
  id: string;
  createdAt: string;
  updatedAt: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
  estimatedCost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
    totalTaxAmount: ShopifyMoneyV2;
  };
  buyerIdentity?: {
    email?: string;
    phone?: string;
    customer?: {
      id: string;
    };
    countryCode?: string;
  };
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant;
  cost: {
    totalAmount: ShopifyMoneyV2;
    amountPerQuantity: ShopifyMoneyV2;
    compareAtAmountPerQuantity?: ShopifyMoneyV2;
  };
  attributes: Array<{
    key: string;
    value: string;
  }>;
};

export type GetAllProductsResponse = {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: {
    edges: Array<{
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
  };
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  sku: string | null;
  quantityAvailable: number | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  availableForSale: boolean;
};

export type ShopifyMoneyV2 = {
  amount: string;
  currencyCode: string;
};
