export interface Review {
    naver_review1: string;
    naver_review2: string;
    naver_review3: string;
    naver_review4: string;
    naver_review5: string;
    k_review1: string;
    k_review2: string;
    k_review3: string;
    k_review4: string;
    k_review5: string;
  }
  
  export interface Restaurant {
    name: string;
    naver_map_url: string;
    foodImageUrl: string; // Assuming food image URL is part of the restaurant data
    reviews: Review;
  }