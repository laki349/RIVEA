import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  categories,
  categoryBySlug,
  productsByCategory,
} from "@/data/catalog";
import CategoryView from "@/components/CategoryView";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = categoryBySlug(params.slug);
  return { title: c ? `${c.name} — 마춰케어` : "카테고리 — 마춰케어" };
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = categoryBySlug(params.slug);
  if (!category) notFound();

  const list = productsByCategory(category.slug);
  return <CategoryView category={category} products={list} />;
}
