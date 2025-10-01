import { Rating } from '../value-objects/Rating';
import { Money } from '../value-objects/Money';

export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly image: string,
    public readonly price: Money,
    public readonly tags: string[],
    public readonly rating: Rating,
    public readonly background: string,
    public readonly backgroundImg?: string,
    public readonly isAI: boolean = false
  ) {}

  isFeatured(): boolean {
    return this.tags.includes('Season Choice');
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  matchesCategory(categoryId: string): boolean {
    return this.tags.includes(categoryId);
  }

  matchesSearch(query: string): boolean {
    return this.name.toLowerCase().includes(query.toLowerCase());
  }
}
