export interface UpdateProductDTO {
  name?: string;
  image?: string;
  price?: number;
  tags?: string[];
  rating?: number;
  background?: string;
  backgroundImg?: string;
  isAI?: boolean;
  stockQuantity?: number;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER';
}

export interface BatchUpdateDTO {
  updates: Array<{
    id: number;
    data: UpdateProductDTO;
  }>;
}
