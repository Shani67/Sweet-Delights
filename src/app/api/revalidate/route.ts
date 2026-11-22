import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";

/**
 * Called by a WooCommerce webhook (product created, updated or deleted) so changes appear
 * on the static storefront within seconds instead of waiting for the ISR interval.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret") ?? "";

  if (!secret) {
    return Response.json({ error: "Revalidation is not configured" }, { status: 501 });
  }

  const expected = Buffer.from(secret);
  const actual = Buffer.from(provided);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Every page reads the same catalog, so refresh the whole site.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
