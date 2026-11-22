import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page space-y-6 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">We couldn&apos;t find that page</h1>
      <p className="text-cocoa-soft">
        It may have sold out or moved. Our fresh bakes are this way.
      </p>
      <Link href="/shop" className="btn-primary">
        Go to the shop
      </Link>
    </div>
  );
}
