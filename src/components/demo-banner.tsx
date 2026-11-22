import { isDemoCatalog } from "@/lib/catalog";

export function DemoBanner() {
  if (!isDemoCatalog) return null;

  return (
    <p className="bg-cocoa px-4 py-2 text-center text-xs text-white">
      Demo mode: showing sample products. Connect a WooCommerce backend to use live data.
    </p>
  );
}
