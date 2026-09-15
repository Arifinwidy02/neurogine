import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productApi';

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts(0, 20);
      setProducts(data.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}
