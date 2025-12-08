import { v4 as UUID } from 'uuid';

export abstract class Entity<TInitProps> {
  public readonly id: string;

  constructor(id?: string) {
    this.id = id || UUID();
  }

  public equals(entity?: Entity<TInitProps>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    return this.id === entity.id;
  }
} 
