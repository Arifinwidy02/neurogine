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
