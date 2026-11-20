import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function useCatalog(fallback) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/catalog`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Catalog unavailable")))
      .then(data => { if (!cancelled) setLive(Array.isArray(data.products) ? data.products : []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (live === null) return fallback;
  const byId = new Map(live.map(product => [product.productId, product]));
  const baseIds = new Set(fallback.map(product => product.id));
  const merged = fallback
    .filter(product => byId.has(product.id))
    .map(product => {
      const source = byId.get(product.id);
      return { ...product, name: source.name, price: source.price, currency: source.currency, image: source.image || product.image, category: source.category || product.category };
    });
  const collection = fallback[0]?.collection;
  const additions = live.filter(product => product.collection === collection && !baseIds.has(product.productId))
    .map(product => ({ id: product.productId, name: product.name, price: product.price, currency: product.currency, collection: product.collection, category: product.category, image: product.image }));
  return [...merged, ...additions];
}
