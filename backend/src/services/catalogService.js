import Product from "../models/Product.js";
import { catalog } from "../data/catalog.js";

export async function seedCatalog() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Catalog seed skipped: ${count} product records already exist`);
    return;
  }
  await Product.insertMany(catalog.map(item => ({
    productId: item.id,
    name: item.name,
    collection: item.collection,
    category: item.category,
    price: item.price,
    currency: item.currency || "USD",
    image: item.image,
    isActive: true
  })));
  console.log(`Seeded ${catalog.length} source-prompt catalog products`);
}
