export function validateProductInput(body, { partial = false } = {}) {
  const has = key => Object.prototype.hasOwnProperty.call(body, key);
  const required = key => !partial || has(key);

  if (required("name")) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2 || name.length > 140) return "Product name must be 2–140 characters.";
  }
  if (required("collection")) {
    const collection = typeof body.collection === "string" ? body.collection.trim() : "";
    if (collection.length < 2 || collection.length > 80) return "Collection must be 2–80 characters.";
  }
  if (required("price")) {
    const price = Number(body.price);
    if (body.price === "" || body.price === null || !Number.isFinite(price) || price < 0 || price > 1000000) return "Enter a valid product price.";
  }
  if (has("currency")) {
    const currency = typeof body.currency === "string" ? body.currency.toUpperCase() : "";
    if (!["USD", "EUR"].includes(currency)) return "Currency must be USD or EUR.";
  }
  if (has("image")) {
    if (typeof body.image !== "string" || body.image.length > 1000) return "Product image must be a valid HTTPS URL.";
    if (body.image.trim()) {
      try {
        const imageUrl = new URL(body.image);
        if (imageUrl.protocol !== "https:" || !imageUrl.hostname || imageUrl.username || imageUrl.password) {
          return "Product image must be a valid HTTPS URL.";
        }
      } catch {
        return "Product image must be a valid HTTPS URL.";
      }
    }
  }
  if (has("category") && (typeof body.category !== "string" || body.category.trim().length > 80)) {
    return "Category must be 80 characters or fewer.";
  }
  if (has("description") && (typeof body.description !== "string" || body.description.trim().length > 1000)) {
    return "Description must be 1000 characters or fewer.";
  }
  if (has("isActive") && typeof body.isActive !== "boolean") {
    return "isActive must be true or false.";
  }
  if (partial && !Object.keys(body).some(key => ["name", "collection", "price", "currency", "image", "category", "description", "isActive"].includes(key))) {
    return "Provide at least one product field to update.";
  }
  return null;
}
