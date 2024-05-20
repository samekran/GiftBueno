export interface Book {
  isbn13: string;
  isbn10: string;
  title: string;
  subtitle: string;
  authors: string;
  categories: string;
  thumbnail: string;
  description: string;
  published_year: string;
  average_rating: string;
  num_pages: string;
  ratings_count: string;
  _additional: AdditionalType;
}


export interface NearTextType {
  concepts: [string] | [];
  certainty?: number;
  moveAwayFrom?: object;
}

export interface AdditionalType {
  generate: GenerateType
}

export interface GenerateType {
  error: string;
  singleResult: string;
}

export interface Gift {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  average_rating: string;
  ratings_count: string;
  _additional: AdditionalType;
}