export interface Gift {
  giftId: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  average_rating: string;
  ratings_count: string;
  link: string;
  _additional: AdditionalType;
}

export interface NearTextType {
  concepts: string[];
  certainty?: number;
  moveAwayFrom?: object;
}

export interface AdditionalType {
  generate: GenerateType;
}

export interface GenerateType {
  error: string;
  singleResult: string;
}
