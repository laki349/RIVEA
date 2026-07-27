import type { Product } from "@/data/catalog";
import ProductCard from "./ProductCard";

// Responsive grid — used for full listings.
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// Horizontal scroll rail — used inside home sections on small screens,
// becomes a grid on large screens.
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <>
      <div className="no-scrollbar -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-1 sm:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div className="hidden gap-x-4 gap-y-8 sm:grid sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
