import { ValueObject } from '../../../core/ValueObject';

interface IMaxRoomsCapacityProps {
  value: number;
}

export class MaxRoomsCapacity extends ValueObject<IMaxRoomsCapacityProps> {
  private constructor(props: IMaxRoomsCapacityProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  public static create(capacity: number): MaxRoomsCapacity {
    if (capacity <= 0) {
      throw new Error('Maximum rooms capacity must be greater than 0');
    }

    if (capacity > 1000) {
      throw new Error('Maximum rooms capacity cannot exceed 1000');
    }

    if (!Number.isInteger(capacity)) {
      throw new Error('Maximum rooms capacity must be an integer');
    }

    return new MaxRoomsCapacity({ value: capacity });
  }

  public hasReachedCapacity(currentRoomCount: number): boolean {
    return currentRoomCount >= this.props.value;
  }

  public getRemainingCapacity(currentRoomCount: number): number {
    return Math.max(0, this.props.value - currentRoomCount);
  }

  public getOccupancyRate(currentRoomCount: number): number {
    return (currentRoomCount / this.props.value) * 100;
  }
}
