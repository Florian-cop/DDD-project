import { ValueObject } from '../../../core/ValueObject';

export enum RoomTypeEnum {
  STANDARD = 'STANDARD',
  DELUXE = 'DELUXE',
  SUITE = 'SUITE'
}

interface IRoomTypeProps {
  type: RoomTypeEnum;
}

export class RoomType extends ValueObject<IRoomTypeProps> {
  private constructor(props: IRoomTypeProps) {
    super(props);
  }

  get type(): RoomTypeEnum {
    return this.props.type;
  }

  get name(): string {
    switch (this.props.type) {
      case RoomTypeEnum.STANDARD:
        return 'Standard Room';
      case RoomTypeEnum.DELUXE:
        return 'Deluxe Room';
      case RoomTypeEnum.SUITE:
        return 'Suite';
    }
  }

  get pricePerNight(): number {
    switch (this.props.type) {
      case RoomTypeEnum.STANDARD:
        return 50;
      case RoomTypeEnum.DELUXE:
        return 100;
      case RoomTypeEnum.SUITE:
        return 200;
    }
  }

  get defaultAccessories(): RoomAccessory[] {
    switch (this.props.type) {
      case RoomTypeEnum.STANDARD:
        return ['bed', 'wifi', 'tv'];
      case RoomTypeEnum.DELUXE:
        return ['duoBed', 'wifi', 'flatScreenTv', 'minibar', 'airConditioning'];
      case RoomTypeEnum.SUITE:
        return ['duoBed', 'wifi', 'flatScreenTv', 'minibar', 'airConditioning', 'bathtub', 'terrace'];
    }
  }

  public static create(type: RoomTypeEnum): RoomType {
    if (!Object.values(RoomTypeEnum).includes(type)) {
      throw new Error(`Invalid room type: ${type}`);
    }
    return new RoomType({ type });
  }

  public static fromString(typeString: string): RoomType {
    const upperType = typeString.toUpperCase() as RoomTypeEnum;
    return this.create(upperType);
  }
}

export type RoomAccessory = 
  | 'bed' 
  | 'duoBed' 
  | 'wifi' 
  | 'tv' 
  | 'flatScreenTv' 
  | 'minibar' 
  | 'airConditioning' 
  | 'bathtub' 
  | 'terrace';
