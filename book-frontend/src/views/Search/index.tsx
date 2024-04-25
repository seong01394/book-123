// src/RestaurantDetails.tsx
import React, { useEffect, useState } from 'react';
import { Restaurant } from '../../apis/type'; // Import the interfaces
import './style.css'; // Make sure this path is correct

const RestaurantDetails: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch('projdb_comp.json')
      .then(response => response.json())
      .then(data => {
        // Assuming data is an array and we're interested in the first item
        const firstRestaurant = data[0]; // Adjust according to actual data structure
        setRestaurant(firstRestaurant);
      })
      .catch(error => console.error('Failed to fetch data:', error));
  }, []);

  if (!restaurant) {
    return <div>Loading...</div>; // Display while data is loading
  }

  return (
    <div className="restaurant-container">
      <div className="square name">{restaurant.name}</div>
      <div className="square food">
        <img src={restaurant.foodImageUrl} alt="Food" />
      </div>
      <div className="square review">
        <div className="review-image naver">
          <img src={restaurant.reviews.naver_review1} alt="Naver Review" />
        </div>
        <div className="review-divider"></div>
        <div className="review-image kakao">
          <img src={restaurant.reviews.k_review1} alt="Kakao Review" />
        </div>
      </div>
      <div className="square map">
        <img src={restaurant.naver_map_url} alt="Naver Map" />
      </div>
    </div>
  );
};

export default RestaurantDetails;

