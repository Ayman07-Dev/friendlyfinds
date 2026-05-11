export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  salePrice?: string;
  description: string;
  imageUrl: string;
  productLink: string;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export type Theme = 'light' | 'dark';

export interface AdminUser {
  uid: string;
  email: string;
}
