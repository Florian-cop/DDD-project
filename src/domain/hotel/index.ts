// Entities
export { Hotel, IHotelProps } from './entities/Hotel';

// Value Objects
export { HotelName } from './value-objects/HotelName';
export { Address } from './value-objects/Address';
export { MaxRoomsCapacity } from './value-objects/MaxRoomsCapacity';
export { StarRating } from './value-objects/StarRating';

// Repositories
export { IHotelRepository } from './repositories/IHotelRepository';

// Events
export { HotelCreated } from './events/HotelCreated';
export { RoomAddedToHotel } from './events/RoomAddedToHotel';
export { RoomRemovedFromHotel } from './events/RoomRemovedFromHotel';
export { AdminAddedToHotel } from './events/AdminAddedToHotel';
export { AdminRemovedFromHotel } from './events/AdminRemovedFromHotel';
export { HotelCapacityIncreased } from './events/HotelCapacityIncreased';
export { HotelActivated } from './events/HotelActivated';
export { HotelDeactivated } from './events/HotelDeactivated';
