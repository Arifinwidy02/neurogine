import { useCallback, useEffect, useState } from 'react';
import { Product } from '../types/product';
import { getProductDetail } from '../services/productApi';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductDetail(productId);
      setProduct(data);
    } catch (e) {
      setError((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { product, loading, error, retry: fetch };
}
