import { Product } from '../types/product';
import { ProductResponse } from '../types/ProductResponse';

const BASE_URL = 'https://dummyjson.com';

export async function getProducts(
  skip: number,
  limit: number,
): Promise<ProductResponse> {
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function searchProducts(query: string): Promise<ProductResponse> {
  const response = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
  );
  if (!response.ok) throw new Error('Failed to search products');
  return response.json();
}

export async function getProductDetail(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product detail');
  return response.json();
}
