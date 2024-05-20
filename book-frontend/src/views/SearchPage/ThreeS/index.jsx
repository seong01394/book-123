import proj4 from 'proj4';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsonData from '../../../assets/projdb_comp.json';
import './style.css';

const NaverMapAndRestaurantInfo = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [marker, setMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    x: 37.5665,
    y: 126.978,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [previousState, setPreviousState] = useState({
    searchTerm: '',
    filteredResults: [],
    restaurantData: null,
  });
  const [closestRestaurants, setClosestRestaurants] = useState([]); // 추가

  const getCurrentPriority = () => {
    const now = new Date();
    const currentHour = now.getHours();
    if (
      (12 <= currentHour && currentHour <= 14) ||
      (17 <= currentHour && currentHour <= 19)
    ) {
      return [
        '중식',
        '한식',
        '일식',
        '고기집',
        '패스트푸드',
        '횟집',
        '분식',
        '이색음식점',
      ];
    } else if (
      (15 <= currentHour && currentHour <= 16) ||
      (9 <= currentHour && currentHour <= 11)
    ) {
      return ['전시회', '뷰(맛집)'];
    } else if (currentHour >= 20) {
      return ['술집', '치킨/맥주'];
    } else {
      return ['카페'];
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon1 - lon2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const dijkstra = (graph, startNode) => {
    const distances = {};
    const visited = new Set();
    const pq = [[startNode, 0]];

    for (let node in graph) {
      distances[node] = Infinity;
    }
    distances[startNode] = 0;

    while (pq.length > 0) {
      const [currentNode, currentDistance] = pq.shift();
      visited.add(currentNode);

      for (let neighbor in graph[currentNode]) {
        const distance = graph[currentNode][neighbor];
        const totalDistance = currentDistance + distance;

        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          pq.push([neighbor, totalDistance]);
        }
      }
      pq.sort((a, b) => a[1] - b[1]);
    }

    return distances;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        x: position.coords.latitude,
        y: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const storedRestaurants = loadSelectedRestaurants();
    setSelectedRestaurants(storedRestaurants);
  }, []);

  const loadSelectedRestaurants = () => {
    const storedRestaurants = localStorage.getItem('selectedRestaurants');
    if (storedRestaurants) {
      return JSON.parse(storedRestaurants);
    } else {
      return [];
    }
  };

  const saveSelectedRestaurants = (selectedRestaurants) => {
    localStorage.setItem(
      'selectedRestaurants',
      JSON.stringify(selectedRestaurants),
    );
  };

  const deleteRestaurant = () => {
    setRestaurantData(null);
    setRestaurantName('');
    setSearchTerm('');
    setFilteredResults([]);
  };

  const removeRestaurantFromList = (index) => {
    const updatedRestaurants = selectedRestaurants.filter(
      (_, i) => i !== index,
    );
    setSelectedRestaurants(updatedRestaurants);
    saveSelectedRestaurants(updatedRestaurants);
  };

  const addRestaurantToList = (restaurant) => {
    setSelectedRestaurants((prevRestaurants) => {
      const updatedRestaurants = [...prevRestaurants, restaurant];
      saveSelectedRestaurants(updatedRestaurants);
      return updatedRestaurants;
    });
  };

  const handleReorderRestaurants = () => {
    const priority = getCurrentPriority();
    let priorityRestaurants = [];
    const remainingRestaurants = [];

    for (const restaurant of selectedRestaurants) {
      if (priority.includes(restaurant.types)) {
        priorityRestaurants.push(restaurant);
      } else {
        remainingRestaurants.push(restaurant);
      }
    }

    if (priorityRestaurants.length > 0 && remainingRestaurants.length > 0) {
      const graph = {};

      for (const restaurant of remainingRestaurants) {
        graph[restaurant.name] = {};
        for (const otherRestaurant of remainingRestaurants) {
          if (restaurant.name !== otherRestaurant.name) {
            graph[restaurant.name][otherRestaurant.name] = calculateDistance(
              restaurant.x_coordi,
              restaurant.y_coordi,
              otherRestaurant.x_coordi,
              otherRestaurant.y_coordi,
            );
          }
        }
      }

      const distances = dijkstra(graph, remainingRestaurants[0].name);
      remainingRestaurants.sort(
        (a, b) => distances[a.name] - distances[b.name],
      );
    }

    const reorderedRestaurants = [
      ...priorityRestaurants,
      ...remainingRestaurants,
    ];

    setSelectedRestaurants(reorderedRestaurants);
    saveSelectedRestaurants(reorderedRestaurants);
  };

  const handleReorderByDistance = () => {
    // 현재 우선순위 타입 가져오기
    const priorityTypes = getCurrentPriority();
    const firstPriorityType = priorityTypes[0];

    // setSelectedRestaurants 배열의 첫 번째 요소 가져오기
    const firstRestaurant = selectedRestaurants[0];
    const firstRestaurantX = parseFloat(firstRestaurant.x_coordi);
    const firstRestaurantY = parseFloat(firstRestaurant.y_coordi);

    // 같은 타입의 장소 필터링
    const filteredByType = jsonData.rows.filter(
      (row) => row[4] === firstPriorityType,
    );

    // 거리를 계산하여 추가
    const distances = filteredByType.map((restaurant) => {
      const distance = calculateDistance(
        firstRestaurantX,
        firstRestaurantY,
        parseFloat(restaurant[5]),
        parseFloat(restaurant[6]),
      );
      return { ...restaurant, distance };
    });

    // 거리순으로 정렬
    distances.sort((a, b) => a.distance - b.distance);

    // 가장 가까운 5개의 장소 추천
    const closest = distances.slice(0, 5).map((restaurant) => ({
      name: restaurant[3],
      types: restaurant[4],
      phone: restaurant[0],
      x_coordi: restaurant[5],
      y_coordi: restaurant[6],
      details: restaurant,
    }));

    setClosestRestaurants(closest); // 상태 업데이트
    console.log('Closest restaurants:', closest);
  };

  useEffect(() => {
    console.log('selectedRestaurants state updated:', selectedRestaurants);
  }, [selectedRestaurants]);

  const handleRestaurantClick = (restaurant) => {
    setPreviousState({
      searchTerm: searchTerm,
      filteredResults: filteredResults,
      restaurantData: restaurantData,
    });

    setRestaurantData(restaurant);
    setFilteredResults([]);
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
      setSearchTerm(searchKey);
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
      const [lon, lat] = proj4(tmProjection, wgs84Projection, [
        tmX + 80,
        tmY + 100280,
      ]);
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

  const renderReviews = (data, startIndex, prefix) => {
    if (!data || data.length <= startIndex) {
      return <p className="review-item">No reviews available.</p>;
    }

    for (let index = 0; index < 5; index++) {
      if (data[startIndex + index] === null) {
        return (
          <p key={prefix + index} className="review-item">
            No review available
          </p>
        );
      }
    }

    return Array.from({ length: 5 }, (_, index) => {
      return (
        <p key={prefix + (index + 1)} className="review-item">{`${prefix}${
          index + 1
        }: ${data[startIndex + index]}`}</p>
      );
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const results = jsonData.rows
        .filter(
          (row) =>
            row[3].toLowerCase().includes(value.toLowerCase()) ||
            row[4].toLowerCase().includes(value.toLowerCase()),
        )
        .map((row) => {
          let tmX = row[5];
          let tmY = row[6];

          tmX += 80;
          tmY += 100280;

          const [lon, lat] = proj4(tmProjection, wgs84Projection, [tmX, tmY]);

          const transformedRow = {
            name: row[3],
            types: row[4],
            phone: row[0],
            x_coordi: lon,
            y_coordi: lat,
            details: row,
          };

          return transformedRow;
        })
        .filter(
          (result) =>
            !selectedRestaurants.some(
              (restaurant) => restaurant.name === result.name,
            ),
        );

      setFilteredResults(results);
    } else {
      setFilteredResults([]);
      setRestaurantData(null);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm) {
      const results = jsonData.rows.filter((row) =>
        row[3].toLowerCase().includes(searchTerm.toLowerCase()),
      );
      if (results.length > 0) {
        setRestaurantData(results[0]);
      } else {
        setRestaurantData(null);
      }
      setFilteredResults(results);
    }
  };

  const filterByCategory = (category) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter((cat) => cat !== category);
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const results = jsonData.rows.filter((row) =>
        selectedCategories.some((category) => row[4].includes(category)),
      );
      setFilteredResults(
        results.map((row) => {
          let tmX = row[5];
          let tmY = row[6];

          tmX += 80;
          tmY += 100280;

          const [lon, lat] = proj4(tmProjection, wgs84Projection, [tmX, tmY]);

          const transformedRow = {
            name: row[3],
            types: row[4],
            phone: row[0],
            x_coordi: lon,
            y_coordi: lat,
            details: row,
          };

          return transformedRow;
        }),
      );
    } else {
      setFilteredResults([]);
    }
  }, [selectedCategories]);

  const handleGoBack = () => {
    setSearchTerm(previousState.searchTerm);
    setFilteredResults(previousState.filteredResults);
    setRestaurantData(previousState.restaurantData);
  };

  const clearRestaurants = () => {
    setSelectedRestaurants([]);
    setClosestRestaurants([]);
  };

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
          {searchTerm && (
            <button onClick={deleteRestaurant} className="delete-button">
              X
            </button>
          )}
          <button onClick={handleSearchClick} className="search-button">
            <div className="search-icon" />
          </button>
        </div>
        <div className="category-buttons">
          <button
            onClick={() => filterByCategory('중식')}
            className={`category-button ${
              selectedCategories.includes('중식') ? 'active' : ''
            }`}
          >
            중식
          </button>
          <button
            onClick={() => filterByCategory('카페')}
            className={`category-button ${
              selectedCategories.includes('카페') ? 'active' : ''
            }`}
          >
            카페
          </button>
          <button
            onClick={() => filterByCategory('한식')}
            className={`category-button ${
              selectedCategories.includes('한식') ? 'active' : ''
            }`}
          >
            한식
          </button>
          <button
            onClick={() => filterByCategory('뷰(맛집)')}
            className={`category-button ${
              selectedCategories.includes('뷰(맛집)') ? 'active' : ''
            }`}
          >
            뷰(맛집)
          </button>
          <button
            onClick={() => filterByCategory('일식')}
            className={`category-button ${
              selectedCategories.includes('일식') ? 'active' : ''
            }`}
          >
            일식
          </button>
          <button
            onClick={() => filterByCategory('전시회')}
            className={`category-button ${
              selectedCategories.includes('전시회') ? 'active' : ''
            }`}
          >
            전시회
          </button>
        </div>
        {filteredResults.length > 0 ? (
          <div>
            {filteredResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleRestaurantClick(result.details)}
                className="result-card"
              >
                <div className="result-content">
                  <span className="result-name">{result.name}</span>
                  <span className="result-types">{result.types}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addRestaurantToList(result);
                    setRestaurantData(null);
                  }}
                  className="plus-button"
                >
                  +
                </button>
              </div>
            ))}
          </div>
        ) : restaurantData ? (
          <div className="restaurant-card">
            <div className="restaurant-header">
              <div className="restaurant-title">{restaurantData[3]}</div>
              <span className="back-button" onClick={handleGoBack}></span>
            </div>
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
            <span>
              {restaurant.name} - {restaurant.types}
            </span>
            <button
              className="trash-button"
              onClick={() => removeRestaurantFromList(index)}
            >
              🗑️
            </button>
          </div>
        ))}
        <div>
          <button onClick={handleReorderRestaurants}>
            Reorder by Priority
          </button>
          <button onClick={handleReorderByDistance}>Reorder by Distance</button>
          <button onClick={clearRestaurants}>reset</button>
        </div>
        <div className="closest-restaurants">
          <h3>Closest Restaurants:</h3>
          <ul>
            {closestRestaurants.map((restaurant, index) => (
              <li key={index}>
                {restaurant.name} - {restaurant.types}
              </li>
            ))}
          </ul>
        </div>
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
