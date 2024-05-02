import proj4 from 'proj4';
import { useEffect, useRef, useState } from 'react';
import jsonData from '../../../assets/projdb_comp.json';
import './style.css'; // CSS 파일을 잘 불러오고 있는지 확인하세요.

const NaverMapAndRestaurantInfo = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);

  // Define the projection strings for TM and WGS84
  const tmProjection =
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs';
  const wgs84Projection = 'EPSG:4326';

  // Function to update the map's center and create a marker at the new location
  const updateMapCenter = (tmX, tmY) => {
    tmX += 80;
    tmY += 100280; // Add 100000 to tmY coordinate
    const [lon, lat] = proj4(tmProjection, wgs84Projection, [tmX, tmY]);
    if (!map) return; // Ensure map is not null
    const navermaps = window.naver.maps;
    const newCenter = new navermaps.LatLng(lat, lon);
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
  const createMarker = (lat, lng, map) => {
    return new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
    });
  };

  const handleCurrentLocation = () => {
    if (!map) {
      console.error('Map is not initialized.');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newCenter = new window.naver.maps.LatLng(lat, lng);

          // 현재 위치 마커 업데이트 또는 새로 생성
          if (currentLocationMarker) {
            currentLocationMarker.setPosition(newCenter);
          } else {
            const newMarker = createMarker(lat, lng, map);
            setCurrentLocationMarker(newMarker);
          }

          map.setCenter(newCenter);
        },
        (error) => {
          console.error('Failed to fetch current location:', error.message);
        },
        { timeout: 10000 },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
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
    if (map && restaurantData) {
      const tmX = parseFloat(restaurantData[5]);
      const tmY = parseFloat(restaurantData[6]);
      updateMapCenter(tmX, tmY);
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
    if (!data || data.length <= startIndex) {
      return <p>No reviews available.</p>;
    }

    for (let index = 0; index < 5; index++) {
      if (data[startIndex + index] === null) {
        return <p key={prefix + index}>No review available</p>;
      }
    }

    return Array.from({ length: 5 }, (_, index) => {
      return (
        <p key={prefix + (index + 1)}>{`${prefix}${index + 1}: ${
          data[startIndex + index]
        }`}</p>
      );
    });
  };

  // Component render method
  return (
    <div className="container">
      <div className="left">
        <input
          type="text"
          placeholder="Enter restaurant name"
          value={restaurantName}
          onChange={handleInputChange}
          className="search-input"
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
      </div>
      <div className="right" style={{ position: 'relative' }}>
        <div ref={mapRef} className="navermap"></div>
        <button className="button" onClick={handleCurrentLocation}>
          현재 위치
        </button>
      </div>
    </div>
  );
};

export default NaverMapAndRestaurantInfo;
