import { notFound } from "next/navigation";
import { categories, type Category } from "@/data/catalog";
import ProductList from "./ProductList";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryListPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sub?: string };
}) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  return <ProductList slug={params.slug as Category} initialSub={searchParams.sub} />;
}
