import { ValueObject } from '../../../core/ValueObject';

interface IStarRatingProps {
  value: number;
}

export class StarRating extends ValueObject<IStarRatingProps> {
  private constructor(props: IStarRatingProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  get display(): string {
    return '⭐'.repeat(this.props.value);
  }

  public static create(rating: number): StarRating {
    if (rating < 1 || rating > 5) {
      throw new Error('Star rating must be between 1 and 5');
    }

    if (!Number.isInteger(rating)) {
      throw new Error('Star rating must be an integer');
    }

    return new StarRating({ value: rating });
  }
}
