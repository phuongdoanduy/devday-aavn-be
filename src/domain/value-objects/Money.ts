export class Money {
  constructor(public readonly amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  toFixed(decimals: number = 2): string {
    return this.amount.toFixed(decimals);
  }
}
