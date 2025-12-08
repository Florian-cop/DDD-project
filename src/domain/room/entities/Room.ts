import { Entity } from '../../../core/Entity';
import { RoomNumber } from '../value-objects/RoomNumber';
import { RoomType, RoomTypeEnum } from '../value-objects/RoomType';
import { RoomAccessories } from '../value-objects/RoomAccessories';
import { RoomAccessory } from '../value-objects/RoomType';

export interface IRoomProps {
  roomNumber: RoomNumber;
  type: RoomType;
  accessories: RoomAccessories;
  isAvailable: boolean;
}

export class Room extends Entity<IRoomProps> {
  private _roomNumber: RoomNumber;
  private _type: RoomType;
  private _accessories: RoomAccessories;
  private _isAvailable: boolean;

  private constructor(props: IRoomProps, id?: string) {
    super(id);
    this._roomNumber = props.roomNumber;
    this._type = props.type;
    this._accessories = props.accessories;
    this._isAvailable = props.isAvailable;
  }

  get roomNumber(): RoomNumber {
    return this._roomNumber;
  }

  get type(): RoomType {
    return this._type;
  }

  get accessories(): RoomAccessories {
    return this._accessories;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get pricePerNight(): number {
    return this._type.pricePerNight;
  }

  get typeName(): string {
    return this._type.name;
  }

  public makeAvailable(): void {
    this._isAvailable = true;
  }

  public makeUnavailable(): void {
    this._isAvailable = false;
  }

  public addAccessory(accessory: RoomAccessory): void {
    this._accessories = this._accessories.addAccessory(accessory);
  }

  public removeAccessory(accessory: RoomAccessory): void {
    this._accessories = this._accessories.removeAccessory(accessory);
  }

  public hasAccessory(accessory: RoomAccessory): boolean {
    return this._accessories.has(accessory);
  }

  public upgradeType(newType: RoomType): void {
    
    const typeOrder = [RoomTypeEnum.STANDARD, RoomTypeEnum.DELUXE, RoomTypeEnum.SUITE];
    const currentIndex = typeOrder.indexOf(this._type.type);
    const newIndex = typeOrder.indexOf(newType.type);

    if (newIndex < currentIndex) {
      throw new Error('Cannot downgrade room type');
    }

    this._type = newType;
    
    this._accessories = RoomAccessories.create(newType.defaultAccessories);
  }

  public static create(
    roomNumber: string,
    type: RoomTypeEnum,
    customAccessories?: RoomAccessory[],
    isAvailable: boolean = true,
    id?: string
  ): Room {
    const roomNumberVO = RoomNumber.create(roomNumber);
    const roomTypeVO = RoomType.create(type);

    const accessories = customAccessories 
      ? RoomAccessories.create(customAccessories)
      : RoomAccessories.create(roomTypeVO.defaultAccessories);

    return new Room(
      {
        roomNumber: roomNumberVO,
        type: roomTypeVO,
        accessories,
        isAvailable
      },
      id
    );
  }

  public static fromValueObjects(props: IRoomProps, id?: string): Room {
    return new Room(props, id);
  }

  public static createStandardRoom(roomNumber: string, id?: string): Room {
    return this.create(roomNumber, RoomTypeEnum.STANDARD, undefined, true, id);
  }

  public static createDeluxeRoom(roomNumber: string, id?: string): Room {
    return this.create(roomNumber, RoomTypeEnum.DELUXE, undefined, true, id);
  }

  public static createSuite(roomNumber: string, id?: string): Room {
    return this.create(roomNumber, RoomTypeEnum.SUITE, undefined, true, id);
  }
}
