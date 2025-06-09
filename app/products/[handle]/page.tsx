import ProductPage from "@/components/ProductPage";

export default function Page({ params }: { params: { handle: string } }) {
  return <ProductPage handle={params.handle} />;
}
