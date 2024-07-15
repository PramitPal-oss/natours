export interface Tour {
  id?: number;
  name: string;
  duration: number;
  rating?: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'medium' | 'difficult';
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price: number;
  summary: string;
  description?: string | null;
  imageCover: string;
  images?: string[];
  priceDiscount?: number;
}

export interface TourDate {
  startDate: Date;
}

export interface TourWithDates {
  tour: Tour;
  dates: TourDate[];
}
