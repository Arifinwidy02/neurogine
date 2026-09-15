import { getProducts } from '../src/services/productApi';

describe('getProducts', () => {
  const mockProducts = {
    products: [
      {
        id: 1,
        title: 'Test Product',
        price: 100,
        description: 'Desc',
        rating: 4.5,
        images: ['https://example.com/1.jpg'],
        thumbnail: 'https://example.com/thumb.jpg',
      },
    ],
    total: 1,
    skip: 0,
    limit: 20,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch products with correct url', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });
    // @ts-ignore
    global.fetch = mockFetch;

    const result = await getProducts(0, 20);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=0',
    );
    expect(result).toEqual(mockProducts);
  });

  it('should throw error when response not ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
    });
    // @ts-ignore
    global.fetch = mockFetch;

    await expect(getProducts(0, 20)).rejects.toThrow(
      'Failed to fetch products',
    );
  });

  it('should handle pagination skip param', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockProducts, skip: 20 }),
    });
    // @ts-ignore
    global.fetch = mockFetch;

    await getProducts(20, 20);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=20',
    );
  });
});
