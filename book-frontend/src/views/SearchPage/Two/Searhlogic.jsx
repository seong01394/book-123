import { useEffect, useState } from 'react';
import jsonData from '../../../assets/projdb_comp.json'; // Import the JSON file

function RestaurantInfo() {
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    fetch(`/api/restaurant/${restaurantName}`) // Adjust the API endpoint accordingly
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        return response.json();
      })
      .then((data) => {
        setRestaurantData(data);
      })
      .catch((error) => {
        console.error('Error fetching restaurant data:', error);
      });

    if (restaurantName) {
      const restaurant = jsonData.rows.find((row) => row[3] === restaurantName);
      if (restaurant) {
        setRestaurantData(restaurant);
      } else {
        console.error('Restaurant not found in data.');
      }
    }
  }, [restaurantName]);

  const handleInputChange = (event) => {
    setRestaurantName(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter restaurant name"
        value={restaurantName}
        onChange={handleInputChange}
      />
      {restaurantData ? (
        <div>
          <h2>Restaurant Information:</h2>
          <p>Name: {restaurantData[3]}</p>
          <p>Phone: {restaurantData[0]}</p>
          <p>Address: {restaurantData[2]}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>No data available for the specified restaurant.</p>
      )}
    </div>
  );
}

export default RestaurantInfo;
