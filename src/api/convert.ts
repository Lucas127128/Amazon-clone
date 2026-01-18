import products from "./products.json";

const newProducts = products.map((product) => {
  const newProduct = {
    id: product.id,
    image: product.image,
    name: product.name,
    rating: product.rating,
    priceCents: product.priceCents,
    keywords: product.keywords,
  };
  return newProduct;
});

// console.log(newProducts);
Bun.write("./products.json", JSON.stringify(newProducts));
