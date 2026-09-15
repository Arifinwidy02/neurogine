import { Product } from '../types/product';

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
};
