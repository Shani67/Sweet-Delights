export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Plain-text summary shown on product cards. */
  summary: string;
  /** Plain-text long description, split into paragraphs on blank lines. */
  description: string;
  /** Price in the smallest currency unit (cents) to avoid floating point errors. */
  price: number;
  currency: string;
  image: ProductImage;
  categories: Category[];
  featured: boolean;
  inStock: boolean;
};

/**
 * The storefront only talks to this interface. The WooCommerce GraphQL source and the
 * demo source both implement it, so pages never depend on where the data comes from.
 */
export interface CatalogSource {
  getProducts(): Promise<Product[]>;
  getCategories(): Promise<Category[]>;
}
