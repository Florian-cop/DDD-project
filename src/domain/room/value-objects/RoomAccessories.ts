import { ValueObject } from '../../../core/ValueObject';
import { RoomAccessory } from './RoomType';

interface IRoomAccessoriesProps {
  accessories: RoomAccessory[];
}

export class RoomAccessories extends ValueObject<IRoomAccessoriesProps> {
  private constructor(props: IRoomAccessoriesProps) {
    super(props);
  }

  get accessories(): RoomAccessory[] {
    return [...this.props.accessories];
  }

  public has(accessory: RoomAccessory): boolean {
    return this.props.accessories.includes(accessory);
  }

  public hasAll(accessories: RoomAccessory[]): boolean {
    return accessories.every(acc => this.props.accessories.includes(acc));
  }

  public count(): number {
    return this.props.accessories.length;
  }

  public static create(accessories: RoomAccessory[]): RoomAccessories {
    if (!accessories || accessories.length === 0) {
      throw new Error('Room must have at least one accessory');
    }

    // Enlever les doublons
    const uniqueAccessories = Array.from(new Set(accessories));

    // Validation : pas de bed ET duoBed en même temps
    if (uniqueAccessories.includes('bed') && uniqueAccessories.includes('duoBed')) {
      throw new Error('Room cannot have both bed and duoBed');
    }

    // Validation : pas de tv ET flatScreenTv en même temps
    if (uniqueAccessories.includes('tv') && uniqueAccessories.includes('flatScreenTv')) {
      throw new Error('Room cannot have both tv and flatScreenTv');
    }

    return new RoomAccessories({ accessories: uniqueAccessories });
  }

  public addAccessory(accessory: RoomAccessory): RoomAccessories {
    if (this.has(accessory)) {
      return this; // Déjà présent
    }

    const newAccessories = [...this.props.accessories, accessory];
    return RoomAccessories.create(newAccessories);
  }

  public removeAccessory(accessory: RoomAccessory): RoomAccessories {
    const newAccessories = this.props.accessories.filter(acc => acc !== accessory);
    
    if (newAccessories.length === 0) {
      throw new Error('Room must have at least one accessory');
    }

    return new RoomAccessories({ accessories: newAccessories });
  }
}
