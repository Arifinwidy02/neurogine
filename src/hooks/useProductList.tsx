import { useEffect, useRef, useState } from 'react';
import { Product } from '../types/product';
import { getProducts, searchProducts } from '../services/productApi';
import { useDebounce } from './useDebounce';

const LIMIT = 20;

export function useProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const requestId = useRef(0);
  const isSearchMode = debouncedSearch.trim().length > 0;

  async function loadData(nextSkip: number, append: boolean) {
    const id = ++requestId.current;

    if (append) {
      setIsLoadingMore(true);
      setLoadMoreError(null);
    } else if (isSearchMode) {
      setIsSearching(true);
      setError(null);
    } else if (products.length === 0) {
      setInitialLoading(true);
      setError(null);
    } else {
      setIsSearching(true);
      setError(null);
    }

    try {
      const res = isSearchMode
        ? await searchProducts(debouncedSearch.trim())
        : await getProducts(nextSkip, LIMIT);

      if (id !== requestId.current) return;

      if (append) {
        setProducts(prev => [...prev, ...res.products]);
      } else {
        setProducts(res.products);
      }
      setTotal(res.total);
      setSkip(isSearchMode ? 0 : nextSkip);
      setError(null);
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
      setIsSearching(false);
    }
  }

  useEffect(() => {
    loadData(0, false);
  }, []);

  useEffect(() => {
    if (initialLoading) return;
    setLoadMoreError(null);
    loadData(0, false);
  }, [debouncedSearch]);

  function loadMore() {
    if (isSearchMode) return;
    if (isLoadingMore || initialLoading || isSearching) return;
    if (products.length >= total) return;
    loadData(skip + LIMIT, true);
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
    search,
    setSearch,
    isSearching,
  };
}
