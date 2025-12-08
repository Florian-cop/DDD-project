import { RoomType, RoomTypeEnum } from '../RoomType';

describe('RoomType Value Object', () => {
  describe('create', () => {
    it('should create STANDARD room type', () => {
      const roomType = RoomType.create(RoomTypeEnum.STANDARD);
      expect(roomType.type).toBe(RoomTypeEnum.STANDARD);
      expect(roomType.name).toBe('Standard Room');
      expect(roomType.pricePerNight).toBe(50);
    });

    it('should create DELUXE room type', () => {
      const roomType = RoomType.create(RoomTypeEnum.DELUXE);
      expect(roomType.type).toBe(RoomTypeEnum.DELUXE);
      expect(roomType.name).toBe('Deluxe Room');
      expect(roomType.pricePerNight).toBe(100);
    });

    it('should create SUITE room type', () => {
      const roomType = RoomType.create(RoomTypeEnum.SUITE);
      expect(roomType.type).toBe(RoomTypeEnum.SUITE);
      expect(roomType.name).toBe('Suite');
      expect(roomType.pricePerNight).toBe(200);
    });
  });

  describe('defaultAccessories', () => {
    it('should return correct accessories for STANDARD room', () => {
      const roomType = RoomType.create(RoomTypeEnum.STANDARD);
      const accessories = roomType.defaultAccessories;
      expect(accessories).toContain('bed');
      expect(accessories).toContain('wifi');
      expect(accessories).toContain('tv');
      expect(accessories).toHaveLength(3);
    });

    it('should return correct accessories for DELUXE room', () => {
      const roomType = RoomType.create(RoomTypeEnum.DELUXE);
      const accessories = roomType.defaultAccessories;
      expect(accessories).toContain('duoBed');
      expect(accessories).toContain('wifi');
      expect(accessories).toContain('flatScreenTv');
      expect(accessories).toContain('minibar');
      expect(accessories).toContain('airConditioning');
      expect(accessories).toHaveLength(5);
    });

    it('should return correct accessories for SUITE', () => {
      const roomType = RoomType.create(RoomTypeEnum.SUITE);
      const accessories = roomType.defaultAccessories;
      expect(accessories).toContain('duoBed');
      expect(accessories).toContain('wifi');
      expect(accessories).toContain('flatScreenTv');
      expect(accessories).toContain('minibar');
      expect(accessories).toContain('airConditioning');
      expect(accessories).toContain('bathtub');
      expect(accessories).toContain('terrace');
      expect(accessories).toHaveLength(7);
    });
  });

  describe('fromString', () => {
    it('should create room type from lowercase string', () => {
      const roomType = RoomType.fromString('standard');
      expect(roomType.type).toBe(RoomTypeEnum.STANDARD);
    });

    it('should create room type from uppercase string', () => {
      const roomType = RoomType.fromString('DELUXE');
      expect(roomType.type).toBe(RoomTypeEnum.DELUXE);
    });

    it('should create room type from mixed case string', () => {
      const roomType = RoomType.fromString('SuItE');
      expect(roomType.type).toBe(RoomTypeEnum.SUITE);
    });
  });

  describe('pricePerNight', () => {
    it('should have correct pricing hierarchy', () => {
      const standard = RoomType.create(RoomTypeEnum.STANDARD);
      const deluxe = RoomType.create(RoomTypeEnum.DELUXE);
      const suite = RoomType.create(RoomTypeEnum.SUITE);

      expect(standard.pricePerNight).toBeLessThan(deluxe.pricePerNight);
      expect(deluxe.pricePerNight).toBeLessThan(suite.pricePerNight);
    });
  });

  describe('equality', () => {
    it('should consider two room types with same type as equal', () => {
      const roomType1 = RoomType.create(RoomTypeEnum.STANDARD);
      const roomType2 = RoomType.create(RoomTypeEnum.STANDARD);
      expect(roomType1.equals(roomType2)).toBe(true);
    });

    it('should consider different room types as not equal', () => {
      const roomType1 = RoomType.create(RoomTypeEnum.STANDARD);
      const roomType2 = RoomType.create(RoomTypeEnum.DELUXE);
      expect(roomType1.equals(roomType2)).toBe(false);
    });
  });
});
