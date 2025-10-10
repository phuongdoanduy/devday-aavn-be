import { Request, Response } from 'express';
import { GetAllProducts } from '../../../application/use-cases/product/GetAllProducts';
import { GetProductById } from '../../../application/use-cases/product/GetProductById';
import { GetFeaturedProducts } from '../../../application/use-cases/product/GetFeaturedProducts';
import { SearchProducts } from '../../../application/use-cases/product/SearchProducts';
import { UpdateProduct } from '../../../application/use-cases/product/UpdateProduct';
import { BatchUpdateProducts } from '../../../application/use-cases/product/BatchUpdateProducts';
import { ProductMapper } from '../../../application/mappers/ProductMapper';
import { ApiResponse } from '../../responses/ApiResponse';

export class ProductController {
  constructor(
    private getAllProducts: GetAllProducts,
    private getProductById: GetProductById,
    private getFeaturedProducts: GetFeaturedProducts,
    private searchProducts: SearchProducts,
    private updateProduct: UpdateProduct,
    private batchUpdateProducts: BatchUpdateProducts
  ) {}

  getAll = async (req: Request, res: Response) => {
    const isAI = req.query.isAI === 'true';
    const category = req.query.category as string;
    const search = req.query.search as string;

    let products;

    if (search) {
      products = await this.searchProducts.execute(search, isAI);
    } else if (category) {
      products = await this.getAllProducts.execute(isAI);
      products = products.filter(p => p.matchesCategory(category));
    } else {
      products = await this.getAllProducts.execute(isAI);
    }

    const productsDTO = ProductMapper.toDTOList(products);

    res.json(ApiResponse.success({ products: productsDTO, total: productsDTO.length }));
  };

  getById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const isAI = req.query.isAI === 'true';

    const product = await this.getProductById.execute(id, isAI);
    const productDTO = ProductMapper.toDTO(product);

    res.json(ApiResponse.success(productDTO));
  };

  getFeatured = async (req: Request, res: Response) => {
    const isAI = req.query.isAI === 'true';
    const products = await this.getFeaturedProducts.execute(isAI);
    const productsDTO = ProductMapper.toDTOList(products);

    res.json(ApiResponse.success({ products: productsDTO, total: productsDTO.length }));
  };

  getTopRated = async (req: Request, res: Response) => {
    const isAI = req.query.isAI === 'true';
    const products = await this.getAllProducts.execute(isAI);
    const topRated = products.filter(p => p.rating.isTopRated());
    const productsDTO = ProductMapper.toDTOList(topRated);

    res.json(ApiResponse.success({ products: productsDTO, total: productsDTO.length }));
  };

  update = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const updatedProduct = await this.updateProduct.execute(id, updateData);
    const productDTO = ProductMapper.toDTO(updatedProduct);

    res.json(ApiResponse.success(productDTO, 'Product updated successfully'));
  };

  batchUpdate = async (req: Request, res: Response) => {
    const { updates } = req.body;

    const updatedProducts = await this.batchUpdateProducts.execute(updates);
    const productsDTO = ProductMapper.toDTOList(updatedProducts);

    res.json(ApiResponse.success({ products: productsDTO, total: productsDTO.length }, 'Products updated successfully'));
  };
}
