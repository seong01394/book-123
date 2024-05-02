import { useEffect, useRef, useState } from 'react';
import jsonData from '../../../assets/projdb_comp.json';

const NaverMapAndRestaurantInfo = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [marker, setMarker] = useState(null);

  // Function to update the map's center and create a marker at the new location
  const updateMapCenter = (lat, lng) => {
    if (!map) return; // Ensure map is not null
    const navermaps = window.naver.maps;
    const newCenter = new navermaps.LatLng(lat, lng);
    map.setCenter(newCenter);

    if (marker) {
      marker.setPosition(newCenter);
      marker.setMap(map);
    } else {
      const newMarker = new navermaps.Marker({
        position: newCenter,
        map: map,
      });
      setMarker(newMarker);
    }
  };

  // Function to handle moving to the current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateMapCenter(position.coords.latitude, position.coords.longitude);
        },
        () => {
          console.error('Failed to fetch current location.');
        },
      );
    }
  };

  // Dynamically load the Naver Maps script
  const loadScript = (src, position, id) => {
    if (!document.getElementById(id)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      script.id = id;
      script.async = true;
      position.appendChild(script);
      return script;
    }
    return document.getElementById(id);
  };

  // Initialize the map and info window once the Naver Maps script is loaded
  useEffect(() => {
    const script = loadScript(
      'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=xodt3v6svf',
      document.head,
      'naver-maps-script',
    );
    script.onload = () => {
      const navermaps = window.naver.maps;

      const mapOptions = {
        center: new navermaps.LatLng(37.5666103, 126.9783882),
        zoom: 15,
        mapTypeControl: true,
      };

      const mapInstance = new navermaps.Map(mapRef.current, mapOptions);
      setMap(mapInstance);

      const infoWindowInstance = new navermaps.InfoWindow({
        anchorSkew: true,
      });
      setInfoWindow(infoWindowInstance);
    };

    return () => {
      if (map) map.destroy();
    };
  }, []);

  // Update the map marker and center when restaurant data changes
  useEffect(() => {
    if (
      map &&
      restaurantData &&
      restaurantData.length > 6 &&
      restaurantData[5] &&
      restaurantData[6]
    ) {
      updateMapCenter(
        parseFloat(restaurantData[5]),
        parseFloat(restaurantData[6]),
      );
    }
  }, [restaurantData, map]);

  // Fetch restaurant data when restaurant name changes
  useEffect(() => {
    if (restaurantName) {
      fetch(`/api/restaurant/${restaurantName}`)
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
          const restaurant = jsonData.rows.find(
            (row) => row[3] === restaurantName,
          );
          if (restaurant) {
            setRestaurantData(restaurant);
          } else {
            console.error('Restaurant not found in data.');
          }
        });
    }
  }, [restaurantName]);

  // Handle input changes
  const handleInputChange = (event) => {
    setRestaurantName(event.target.value);
  };

  // Render reviews from the dataset
  const renderReviews = (data, startIndex, prefix) => {
    return Array.from({ length: 5 }, (_, index) => (
      <p key={prefix + (index + 1)}>{`${prefix}${index + 1}: ${
        data[startIndex + index]
      }`}</p>
    ));
  };

  // Component render method
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
          <p>Type: {restaurantData[4]}</p>
          {renderReviews(restaurantData, 8, 'naver_r')}
          {renderReviews(restaurantData, 14, 'kakao_r')}
        </div>
      ) : (
        <p>No data available for the specified restaurant.</p>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default NaverMapAndRestaurantInfo;
