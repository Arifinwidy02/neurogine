import { useEffect, useRef, useState } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../services/productApi';

const LIMIT = 20;

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const requestId = useRef(0);

  async function loadData(nextSkip: number, append: boolean) {
    const id = ++requestId.current;

    if (append) {
      setIsLoadingMore(true);
      setLoadMoreError(null);
    } else {
      if (products.length === 0 && !refreshing) {
        setInitialLoading(true);
      }
      setError(null);
    }

    try {
      const res = await getProducts(nextSkip, LIMIT);
      if (id !== requestId.current) return;

      if (append) {
        setProducts(prev => [...prev, ...res.products]);
      } else {
        setProducts(res.products);
      }
      setTotal(res.total);
      setSkip(nextSkip + res.products.length);
    } catch (e) {
      if (id !== requestId.current) return;
      const msg = (e as Error).message || 'Something went wrong';
      if (append) setLoadMoreError(msg);
      else setError(msg);
    } finally {
      if (id !== requestId.current) return;
      setInitialLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData(0, false);
  }, []);

  function loadMore() {
    if (isLoadingMore || initialLoading) return;
    if (products.length >= total) return;
    loadData(skip, true);
  }

  function retry() {
    if (loadMoreError) {
      loadMore();
      return;
    }
    if (error) loadData(0, false);
  }

  function refresh() {
    setRefreshing(true);
    setError(null);
    setLoadMoreError(null);
    loadData(0, false);
  }

  return {
    products,
    initialLoading,
    isLoadingMore,
    refreshing,
    error,
    loadMoreError,
    loadMore,
    retry,
    refresh,
  };
}
