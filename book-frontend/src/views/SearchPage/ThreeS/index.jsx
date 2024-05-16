import proj4 from 'proj4';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  // 저장된 식당 불러오기
  useEffect(() => {
    const storedRestaurants = loadSelectedRestaurants();
    setSelectedRestaurants(storedRestaurants);
  }, []);

  // 선택된 식당을 로컬 스토리지에 저장
  const saveSelectedRestaurants = (selectedRestaurants) => {
    localStorage.setItem('selectedRestaurants', JSON.stringify(selectedRestaurants));
  };

  // 로컬 스토리지에서 저장된 식당 불러오기
  const loadSelectedRestaurants = () => {
    const storedRestaurants = localStorage.getItem('selectedRestaurants');
    if (storedRestaurants) {
      return JSON.parse(storedRestaurants);
    } else {
      return []; // 저장된 식당이 없을 경우 빈 배열을 반환
    }
  };

  // 식당 삭제
  const deleteRestaurant = () => {
    setRestaurantData(null); // 선택된 레스토랑 데이터 지우기
    setRestaurantName(''); // 검색 입력 지우기
    setSearchTerm('');
  };

  // 선택된 식당 추가
  const addRestaurantToList = (restaurant) => {
    setSelectedRestaurants((prevRestaurants) => [
      ...prevRestaurants,
      restaurant,
    ]);
    saveSelectedRestaurants([...selectedRestaurants, restaurant]); // 변경된 선택된 식당을 저장
  };

  useEffect(() => {
    const storedRestaurants = loadSelectedRestaurants();
    setSelectedRestaurants(storedRestaurants);
  }, []); 
  
  const handleRestaurantClick = (restaurant) => {
    setRestaurantData(restaurant); // 선택된 레스토랑 정보 저장
    setFilteredResults([]); // 검색 결과 목록을 비워 검색 결과를 숨김
  };

  const tmProjection =
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs';
  const wgs84Projection = 'EPSG:4326';

  const updateMapCenter = (tmX, tmY) => {
    tmX += 80;
    tmY += 100280;
    const [lon, lat] = proj4(tmProjection, wgs84Projection, [tmX, tmY]);
    if (!map) return;
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

  const searchKey = useLocation().state?.searchKey;
  useEffect(() => {
    if (searchKey) {
      setRestaurantName(searchKey);
    }
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
    return () => script.remove();
  }, []);

  useEffect(() => {
    if (map && restaurantData) {
      const tmX = parseFloat(restaurantData[5]);
      const tmY = parseFloat(restaurantData[6]);
      updateMapCenter(tmX, tmY);
      const [lon, lat] = proj4(tmProjection, wgs84Projection, [tmX+80, tmY+100280]);
      if (map) {
        const newCenter = new window.naver.maps.LatLng(lat, lon);
        map.setCenter(newCenter);
        if (!marker) {
          const newMarker = new window.naver.maps.Marker({
            position: newCenter,
            map: map,
          });
          setMarker(newMarker);
        } else {
          marker.setPosition(newCenter);
        }
      }
    }
  }, [restaurantData, map]);

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

  // Render reviews from the dataset
  const renderReviews = (data, startIndex, prefix) => {
    if (!data || data.length <= startIndex) {
      return <p className="review-item">No reviews available.</p>;
    }

    // 데이터 중에 null 값이 있을 경우 'No review available' 메시지를 표시
    for (let index = 0; index < 5; index++) {
      if (data[startIndex + index] === null) {
        return (
          <p key={prefix + index} className="review-item">
            No review available
          </p>
        );
      }
    }

    // 5개의 리뷰를 렌더링하며, 각 리뷰에 고유한 키와 스타일 클래스를 추가
    return Array.from({ length: 5 }, (_, index) => {
      return (
        <p key={prefix + (index + 1)} className="review-item">{`${prefix}${
          index + 1
        }: ${data[startIndex + index]}`}</p>
      );
    });
  };

  // 검색 입력을 처리하는 함수
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      // 입력값에 따라 검색 결과 필터링
      const results = jsonData.rows
        .filter((row) => row[3].toLowerCase().includes(value.toLowerCase()) || row[4].toLowerCase().includes(value.toLowerCase()) )
        .map((row) => ({
          name: row[3],
          types: row[4],
          phone: row[0],
          details: row,
        }));
      setFilteredResults(results);
    } else {
      // 입력값이 없을 때는 모든 상태 초기화
      setFilteredResults([]);
      setRestaurantData(null);
    }
  };

  const Coodinatedchange = () =>  {

  }

  return (
    <div className="container">
      <div className="left">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter restaurant name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button onClick={deleteRestaurant} className="delete-button">
            X
          </button>
        </div>
        {filteredResults.length > 0 ? (
          <div className="scrollable-container">
            {filteredResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleRestaurantClick(result.details)}
              >
                <span>
                  {result.name}⭐ - {result.types}
                </span>
                <button
                  onClick={() => addRestaurantToList(result)}
                  className="plus-button"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        ) : restaurantData ? (
          <div className="restaurant-card">
            <div className="restaurant-title">{restaurantData[3]}</div>
            <div className="restaurant-subtitle">{restaurantData[4]}</div>
            <div className="restaurant-info">
              <span className="restaurant-info-icon phone-icon"></span>
              <span className="restaurant-info-text">{restaurantData[0]}</span>
            </div>
            <div className="restaurant-info">
              <span className="restaurant-info-icon address-icon"></span>
              <span className="restaurant-info-text">{restaurantData[2]}</span>
            </div>

            <div className="review-section">
              <h3>Naver Reviews:</h3>
              {renderReviews(restaurantData, 8, 'naver_r')}
              <h3>Kakao Reviews:</h3>
              {renderReviews(restaurantData, 14, 'kakao_r')}
            </div>
          </div>
        ) : null}
      </div>

      <div className="middle">
        {selectedRestaurants.map((restaurant, index) => (
          <div key={index} className="selected-restaurant-item">
            {restaurant.name} - {restaurant.types}
          </div>
        ))}
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
