export interface ProductDTO {
  id: number;
  name: string;
  image: string;
  price: number;
  tags: string[];
  rating: number;
  background: string;
  backgroundImg?: string;
  stockQuantity: number;
  stockStatus: string;
  isAvailable: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}
