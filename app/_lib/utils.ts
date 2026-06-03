import { Product } from "./definitions";

export const mapProductsToArray = (res: object) => {
  const array = Object.entries(res);
  const products: Product[] = [];
  for (const entry of array) {
    const product: Product = {
      id: entry[0],
      ...entry[1],
    };
    products.push(product);
  }
  products.reverse();
  return products;
};
