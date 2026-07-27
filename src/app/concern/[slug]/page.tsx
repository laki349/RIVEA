import { notFound } from "next/navigation";
import { concerns } from "@/data/catalog";
import ConcernDetail from "./ConcernDetail";

export function generateStaticParams() {
  return concerns.map((c) => ({ slug: c.slug }));
}

export default function ConcernPage({ params }: { params: { slug: string } }) {
  const concern = concerns.find((c) => c.slug === params.slug);
  if (!concern) notFound();

  return <ConcernDetail concern={concern} />;
}
