export interface ProductDTO {
  id: number;
  name: string;
  image: string;
  price: number;
  tags: string[];
  rating: number;
  background: string;
  backgroundImg?: string;
}
