import { Entity } from '../../../core/Entity';
import { HotelName } from '../value-objects/HotelName';
import { Address } from '../value-objects/Address';
import { MaxRoomsCapacity } from '../value-objects/MaxRoomsCapacity';
import { StarRating } from '../value-objects/StarRating';

export interface IHotelProps {
  name: HotelName;
  address: Address;
  maxRoomsCapacity: MaxRoomsCapacity;
  starRating: StarRating;
  adminIds: string[];
  roomIds: string[];
  description?: string;
  isActive: boolean;
}

export class Hotel extends Entity<IHotelProps> {
  private _name: HotelName;
  private _address: Address;
  private _maxRoomsCapacity: MaxRoomsCapacity;
  private _starRating: StarRating;
  private _adminIds: string[];
  private _roomIds: string[];
  private _description?: string;
  private _isActive: boolean;

  private constructor(props: IHotelProps, id?: string) {
    super(id);
    this._name = props.name;
    this._address = props.address;
    this._maxRoomsCapacity = props.maxRoomsCapacity;
    this._starRating = props.starRating;
    this._adminIds = [...props.adminIds];
    this._roomIds = [...props.roomIds];
    this._description = props.description;
    this._isActive = props.isActive;
  }

  get name(): HotelName {
    return this._name;
  }

  get address(): Address {
    return this._address;
  }

  get maxRoomsCapacity(): MaxRoomsCapacity {
    return this._maxRoomsCapacity;
  }

  get starRating(): StarRating {
    return this._starRating;
  }

  get adminIds(): string[] {
    return [...this._adminIds];
  }

  get roomIds(): string[] {
    return [...this._roomIds];
  }

  get description(): string | undefined {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get currentRoomCount(): number {
    return this._roomIds.length;
  }

  get remainingCapacity(): number {
    return this._maxRoomsCapacity.getRemainingCapacity(this.currentRoomCount);
  }

  get occupancyRate(): number {
    return this._maxRoomsCapacity.getOccupancyRate(this.currentRoomCount);
  }

  get hasReachedCapacity(): boolean {
    return this._maxRoomsCapacity.hasReachedCapacity(this.currentRoomCount);
  }

  // Gestion des administrateurs
  public addAdmin(adminId: string): void {
    if (!adminId || adminId.trim().length === 0) {
      throw new Error('Admin ID cannot be empty');
    }

    if (this._adminIds.includes(adminId)) {
      throw new Error('Admin already exists in hotel');
    }

    this._adminIds.push(adminId);
  }

  public removeAdmin(adminId: string): void {
    if (this._adminIds.length === 1) {
      throw new Error('Hotel must have at least one administrator');
    }

    const index = this._adminIds.indexOf(adminId);
    if (index === -1) {
      throw new Error('Admin not found in hotel');
    }

    this._adminIds.splice(index, 1);
  }

  public isAdmin(adminId: string): boolean {
    return this._adminIds.includes(adminId);
  }

  public hasAdmin(): boolean {
    return this._adminIds.length > 0;
  }

  // Gestion des chambres
  public addRoom(roomId: string): void {
    if (!roomId || roomId.trim().length === 0) {
      throw new Error('Room ID cannot be empty');
    }

    if (this.hasReachedCapacity) {
      throw new Error(`Hotel has reached maximum capacity of ${this._maxRoomsCapacity.value} rooms`);
    }

    if (this._roomIds.includes(roomId)) {
      throw new Error('Room already exists in hotel');
    }

    this._roomIds.push(roomId);
  }

  public removeRoom(roomId: string): void {
    const index = this._roomIds.indexOf(roomId);
    if (index === -1) {
      throw new Error('Room not found in hotel');
    }

    this._roomIds.splice(index, 1);
  }

  public hasRoom(roomId: string): boolean {
    return this._roomIds.includes(roomId);
  }

  public canAddMoreRooms(numberOfRooms: number = 1): boolean {
    return this.currentRoomCount + numberOfRooms <= this._maxRoomsCapacity.value;
  }

  // Gestion de l'hôtel
  public updateName(newName: HotelName): void {
    this._name = newName;
  }

  public updateAddress(newAddress: Address): void {
    this._address = newAddress;
  }

  public updateDescription(description: string): void {
    if (description && description.trim().length > 1000) {
      throw new Error('Description cannot exceed 1000 characters');
    }
    this._description = description?.trim();
  }

  public updateStarRating(newRating: StarRating): void {
    this._starRating = newRating;
  }

  public increaseCapacity(newCapacity: MaxRoomsCapacity): void {
    if (newCapacity.value < this._maxRoomsCapacity.value) {
      throw new Error('New capacity cannot be less than current capacity');
    }

    if (newCapacity.value < this.currentRoomCount) {
      throw new Error('New capacity cannot be less than current room count');
    }

    this._maxRoomsCapacity = newCapacity;
  }

  public activate(): void {
    if (!this.hasAdmin()) {
      throw new Error('Hotel must have at least one administrator to be activated');
    }
    this._isActive = true;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  // Factory methods
  public static create(
    name: string,
    street: string,
    city: string,
    postalCode: string,
    country: string,
    maxRoomsCapacity: number,
    starRating: number,
    adminId: string,
    description?: string,
    id?: string
  ): Hotel {
    if (!adminId || adminId.trim().length === 0) {
      throw new Error('Hotel must have at least one administrator');
    }

    const nameVO = HotelName.create(name);
    const addressVO = Address.create(street, city, postalCode, country);
    const capacityVO = MaxRoomsCapacity.create(maxRoomsCapacity);
    const ratingVO = StarRating.create(starRating);

    return new Hotel(
      {
        name: nameVO,
        address: addressVO,
        maxRoomsCapacity: capacityVO,
        starRating: ratingVO,
        adminIds: [adminId.trim()],
        roomIds: [],
        description: description?.trim(),
        isActive: true
      },
      id
    );
  }

  public static fromValueObjects(props: IHotelProps, id?: string): Hotel {
    return new Hotel(props, id);
  }
}
