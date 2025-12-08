import { Room } from '../Room';
import { RoomType, RoomTypeEnum } from '../../value-objects/RoomType';
import { RoomAccessory } from '../../value-objects/RoomType';

describe('Room Entity', () => {
  describe('create', () => {
    it('should create a standard room', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD);

      expect(room.roomNumber.value).toBe('101');
      expect(room.typeName).toBe('Standard Room');
      expect(room.pricePerNight).toBe(50);
      expect(room.isAvailable).toBe(true);
      expect(room.id).toBeDefined();
    });

    it('should create a deluxe room', () => {
      const room = Room.create('201', RoomTypeEnum.DELUXE);

      expect(room.typeName).toBe('Deluxe Room');
      expect(room.pricePerNight).toBe(100);
    });

    it('should create a suite', () => {
      const room = Room.create('301', RoomTypeEnum.SUITE);

      expect(room.typeName).toBe('Suite');
      expect(room.pricePerNight).toBe(200);
    });

    it('should create room with specific ID', () => {
      const roomId = 'room-123';
      const room = Room.create('101', RoomTypeEnum.STANDARD, undefined, true, roomId);

      expect(room.id).toBe(roomId);
    });

    it('should create unavailable room', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD, undefined, false);

      expect(room.isAvailable).toBe(false);
    });

    it('should create room with custom accessories', () => {
      const customAccessories: RoomAccessory[] = ['bed', 'wifi'];
      const room = Room.create('101', RoomTypeEnum.STANDARD, customAccessories);

      expect(room.hasAccessory('bed')).toBe(true);
      expect(room.hasAccessory('wifi')).toBe(true);
    });

    it('should use default accessories when not provided', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD);

      expect(room.hasAccessory('bed')).toBe(true);
      expect(room.hasAccessory('wifi')).toBe(true);
      expect(room.hasAccessory('tv')).toBe(true);
    });
  });

  describe('factory methods', () => {
    it('createStandardRoom should create standard room with defaults', () => {
      const room = Room.createStandardRoom('101');

      expect(room.typeName).toBe('Standard Room');
      expect(room.pricePerNight).toBe(50);
      expect(room.hasAccessory('bed')).toBe(true);
      expect(room.isAvailable).toBe(true);
    });

    it('createDeluxeRoom should create deluxe room with defaults', () => {
      const room = Room.createDeluxeRoom('201');

      expect(room.typeName).toBe('Deluxe Room');
      expect(room.pricePerNight).toBe(100);
      expect(room.hasAccessory('duoBed')).toBe(true);
      expect(room.hasAccessory('minibar')).toBe(true);
    });

    it('createSuite should create suite with defaults', () => {
      const room = Room.createSuite('301');

      expect(room.typeName).toBe('Suite');
      expect(room.pricePerNight).toBe(200);
      expect(room.hasAccessory('bathtub')).toBe(true);
      expect(room.hasAccessory('terrace')).toBe(true);
    });
  });

  describe('availability management', () => {
    it('should make room available', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD, undefined, false);
      expect(room.isAvailable).toBe(false);

      room.makeAvailable();

      expect(room.isAvailable).toBe(true);
    });

    it('should make room unavailable', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD);
      expect(room.isAvailable).toBe(true);

      room.makeUnavailable();

      expect(room.isAvailable).toBe(false);
    });

    it('should toggle availability multiple times', () => {
      const room = Room.create('101', RoomTypeEnum.STANDARD);

      room.makeUnavailable();
      expect(room.isAvailable).toBe(false);

      room.makeAvailable();
      expect(room.isAvailable).toBe(true);

      room.makeUnavailable();
      expect(room.isAvailable).toBe(false);
    });
  });

  describe('accessory management', () => {
    it('should add accessory to room', () => {
      const room = Room.createStandardRoom('101');
      
      expect(room.hasAccessory('minibar')).toBe(false);

      room.addAccessory('minibar');

      expect(room.hasAccessory('minibar')).toBe(true);
    });

    it('should remove accessory from room', () => {
      const room = Room.createStandardRoom('101');
      
      expect(room.hasAccessory('wifi')).toBe(true);

      room.removeAccessory('wifi');

      expect(room.hasAccessory('wifi')).toBe(false);
    });

    it('should check if room has specific accessory', () => {
      const room = Room.createDeluxeRoom('201');

      expect(room.hasAccessory('duoBed')).toBe(true);
      expect(room.hasAccessory('minibar')).toBe(true);
      expect(room.hasAccessory('airConditioning')).toBe(true);
      expect(room.hasAccessory('bathtub')).toBe(false); // Suite only
    });
  });

  describe('room type upgrade', () => {
    it('should upgrade from STANDARD to DELUXE', () => {
      const room = Room.createStandardRoom('101');
      expect(room.pricePerNight).toBe(50);

      const deluxeType = RoomType.create(RoomTypeEnum.DELUXE);
      room.upgradeType(deluxeType);

      expect(room.typeName).toBe('Deluxe Room');
      expect(room.pricePerNight).toBe(100);
    });

    it('should upgrade from DELUXE to SUITE', () => {
      const room = Room.createDeluxeRoom('201');
      expect(room.pricePerNight).toBe(100);

      const suiteType = RoomType.create(RoomTypeEnum.SUITE);
      room.upgradeType(suiteType);

      expect(room.typeName).toBe('Suite');
      expect(room.pricePerNight).toBe(200);
    });

    it('should throw error when downgrading room type', () => {
      const room = Room.createDeluxeRoom('201');

      const standardType = RoomType.create(RoomTypeEnum.STANDARD);

      expect(() => room.upgradeType(standardType))
        .toThrow('Cannot downgrade room type');
    });

    it('should throw error when downgrading from SUITE to DELUXE', () => {
      const room = Room.createSuite('301');

      const deluxeType = RoomType.create(RoomTypeEnum.DELUXE);

      expect(() => room.upgradeType(deluxeType))
        .toThrow('Cannot downgrade room type');
    });

    it('should allow "upgrading" to same type', () => {
      const room = Room.createStandardRoom('101');

      const sameType = RoomType.create(RoomTypeEnum.STANDARD);

      expect(() => room.upgradeType(sameType)).not.toThrow();
    });
  });

  describe('entity identity', () => {
    it('should consider rooms with same ID as equal', () => {
      const roomId = 'room-123';
      const room1 = Room.create('101', RoomTypeEnum.STANDARD, undefined, true, roomId);
      const room2 = Room.create('201', RoomTypeEnum.DELUXE, undefined, false, roomId);

      expect(room1.equals(room2)).toBe(true);
    });

    it('should consider rooms with different IDs as not equal', () => {
      const room1 = Room.createStandardRoom('101');
      const room2 = Room.createStandardRoom('101');

      expect(room1.equals(room2)).toBe(false);
    });
  });

  describe('business rules - hotel room management', () => {
    it('should enforce price hierarchy: STANDARD < DELUXE < SUITE', () => {
      const standard = Room.createStandardRoom('101');
      const deluxe = Room.createDeluxeRoom('201');
      const suite = Room.createSuite('301');

      expect(standard.pricePerNight).toBeLessThan(deluxe.pricePerNight);
      expect(deluxe.pricePerNight).toBeLessThan(suite.pricePerNight);
    });

    it('should enforce accessory hierarchy', () => {
      const standard = Room.createStandardRoom('101');
      const deluxe = Room.createDeluxeRoom('201');
      const suite = Room.createSuite('301');

      // Standard has basic amenities
      expect(standard.hasAccessory('bed')).toBe(true);
      expect(standard.hasAccessory('wifi')).toBe(true);
      expect(standard.hasAccessory('tv')).toBe(true);

      // Deluxe has upgraded amenities
      expect(deluxe.hasAccessory('duoBed')).toBe(true);
      expect(deluxe.hasAccessory('flatScreenTv')).toBe(true);
      expect(deluxe.hasAccessory('minibar')).toBe(true);
      expect(deluxe.hasAccessory('airConditioning')).toBe(true);

      // Suite has luxury amenities
      expect(suite.hasAccessory('bathtub')).toBe(true);
      expect(suite.hasAccessory('terrace')).toBe(true);
    });

    it('should support room reservation workflow', () => {
      const room = Room.createStandardRoom('101');
      expect(room.isAvailable).toBe(true);

      // Client réserve la chambre
      room.makeUnavailable();
      expect(room.isAvailable).toBe(false);

      // Client libère la chambre
      room.makeAvailable();
      expect(room.isAvailable).toBe(true);
    });

    it('should validate room number format', () => {
      expect(() => Room.createStandardRoom('101')).not.toThrow();
      expect(() => Room.createStandardRoom('A-101')).not.toThrow();
      expect(() => Room.createStandardRoom('1-01')).not.toThrow();
    });

    it('should calculate total price for multiple nights', () => {
      const room = Room.createDeluxeRoom('201');
      const pricePerNight = room.pricePerNight;
      const numberOfNights = 3;
      const totalPrice = pricePerNight * numberOfNights;

      expect(totalPrice).toBe(300); // 100 * 3
    });
  });
});
