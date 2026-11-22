import type { Category, Product } from "./types";

const cakes: Category = {
  slug: "cakes",
  name: "Cakes",
  description: "Celebration cakes baked to order, from classic red velvet to glossy chocolate.",
};

const cupcakes: Category = {
  slug: "cupcakes",
  name: "Cupcakes",
  description: "Small treats for parties, offices and dessert tables.",
};

const tarts: Category = {
  slug: "tarts",
  name: "Tarts",
  description: "Buttery pastry with fresh fruit and creamy fillings.",
};

export const demoCategories: Category[] = [cakes, cupcakes, tarts];

export const demoProducts: Product[] = [
  {
    id: "demo-1",
    slug: "red-velvet-cake",
    name: "Red Velvet Cake",
    summary: "Three soft cocoa layers with whipped cream cheese frosting.",
    description:
      "Our best seller. Three layers of moist red velvet sponge with a hint of cocoa, filled and topped with tangy cream cheese frosting and red velvet crumbs.\n\nServes 10 to 12. Order at least 24 hours ahead.",
    price: 650000,
    currency: "LKR",
    image: {
      src: "/images/products/red-velvet-cake.webp",
      alt: "Red velvet cake with a slice cut out, topped with cream rosettes",
      width: 1200,
      height: 991,
    },
    categories: [cakes],
    featured: true,
    inStock: true,
  },
  {
    id: "demo-2",
    slug: "chocolate-orange-cake",
    name: "Chocolate Orange Cake",
    summary: "Dark chocolate mousse cake with a mirror glaze and candied orange.",
    description:
      "Rich dark chocolate mousse on a crunchy biscuit base, finished with a shiny mirror glaze and slices of candied orange.\n\nServes 8 to 10. Keep refrigerated.",
    price: 720000,
    currency: "LKR",
    image: {
      src: "/images/products/chocolate-orange-cake.webp",
      alt: "Glossy chocolate cake topped with candied orange slices",
      width: 1200,
      height: 991,
    },
    categories: [cakes],
    featured: true,
    inStock: true,
  },
  {
    id: "demo-3",
    slug: "strawberry-cream-cake",
    name: "Strawberry Cream Cake",
    summary: "Vanilla sponge loaded with fresh strawberries and whipped cream.",
    description:
      "Light vanilla sponge layered with fresh cream and covered with glazed strawberries and raspberries.\n\nServes 10. Available while strawberries are in season.",
    price: 580000,
    currency: "LKR",
    image: {
      src: "/images/products/strawberry-cream-cake.webp",
      alt: "Cake covered in glazed strawberries with piped cream around the edge",
      width: 1200,
      height: 800,
    },
    categories: [cakes],
    featured: true,
    inStock: false,
  },
  {
    id: "demo-4",
    slug: "party-cupcake-box",
    name: "Party Cupcake Box",
    summary: "Twelve assorted cupcakes for birthdays and dessert tables.",
    description:
      "A box of twelve cupcakes in vanilla, chocolate and strawberry, each finished with buttercream and sprinkles.\n\nPerfect for dessert tables. Custom colours available on request.",
    price: 360000,
    currency: "LKR",
    image: {
      src: "/images/products/cupcake-box.webp",
      alt: "Dessert table with cupcakes on a tiered stand",
      width: 800,
      height: 1200,
    },
    categories: [cupcakes],
    featured: false,
    inStock: true,
  },
  {
    id: "demo-5",
    slug: "strawberry-tart",
    name: "Strawberry Tart",
    summary: "Crisp pastry with vanilla custard, strawberries and fresh mint.",
    description:
      "Flaky pastry filled with vanilla custard and topped with fresh strawberries, strawberry glaze and mint leaves.\n\nServes 6. Best enjoyed on the day.",
    price: 420000,
    currency: "LKR",
    image: {
      src: "/images/products/strawberry-tart.webp",
      alt: "Round tart topped with glazed strawberries and mint leaves",
      width: 1200,
      height: 991,
    },
    categories: [tarts],
    featured: false,
    inStock: true,
  },
];
