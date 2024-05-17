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

  const getCurrentPriority = () => {
    const now = new Date();
    const currentHour = now.getHours();
    if (
      (12 <= currentHour && currentHour <= 14) ||
      (17 <= currentHour && currentHour <= 19)
    ) {
      return '고기집';
    } else if (currentHour >= 20) {
      return '치킨';
    } else {
      return '카페';
    }
  };

  // Haversine formula to calculate distance between two points (in km)
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

  // 저장한 식당 불러오기
  useEffect(() => {
    const storedRestaurants = loadSelectedRestaurants();
    setSelectedRestaurants(storedRestaurants);
  }, []);

  // 로컬 스토리지에서 저장된 식당 불러오기
  const loadSelectedRestaurants = () => {
    const storedRestaurants = localStorage.getItem('selectedRestaurants');
    if (storedRestaurants) {
      return JSON.parse(storedRestaurants);
    } else {
      return []; // 저장된 식당이 없을 경우 빈 배열 반환
    }
  };

  // 선택된 식당을 로컬 스토리지에 저장
  const saveSelectedRestaurants = (selectedRestaurants) => {
    localStorage.setItem(
      'selectedRestaurants',
      JSON.stringify(selectedRestaurants),
    );
  };

  // 식당 삭제
  const deleteRestaurant = () => {
    setRestaurantData(null); // 선택된 레스토랑 데이터 지우기
    setRestaurantName(''); // 검색 입력 지우기
    setSearchTerm('');
    setFilteredResults([]); // 검색 결과 초기화
  };

  // 선택된 식당 삭제
  const removeRestaurantFromList = (index) => {
    const updatedRestaurants = selectedRestaurants.filter(
      (_, i) => i !== index,
    );
    setSelectedRestaurants(updatedRestaurants);
    saveSelectedRestaurants(updatedRestaurants); // 변경된 선택된 식당을 저장
  };

  const addRestaurantToList = (restaurant) => {
    setSelectedRestaurants((prevRestaurants) => {
      const updatedRestaurants = [...prevRestaurants, restaurant];
      saveSelectedRestaurants(updatedRestaurants); // 업데이트된 선택된 식당 목록 저장
      return updatedRestaurants;
    });
  };

  const handleReorderRestaurants = () => {
    const priority = getCurrentPriority();
    let priorityRestaurant = null;
    const remainingRestaurants = [];

    // types에 따른 우선순위 결정
    for (const restaurant of selectedRestaurants) {
      if (restaurant.types === priority) {
        priorityRestaurant = restaurant;
      } else {
        remainingRestaurants.push(restaurant);
      }
    }

    console.log('Priority:', priority);
    console.log('Priority Restaurant:', priorityRestaurant);
    console.log('Remaining Restaurants:', remainingRestaurants);

    // remainingRestaurants를 다익스트라 알고리즘으로 정렬
    if (priorityRestaurant && remainingRestaurants.length > 0) {
      const graph = {};

      for (const restaurant of remainingRestaurants) {
        graph[restaurant.name] = {};
        for (const otherRestaurant of remainingRestaurants) {
          if (restaurant.name !== otherRestaurant.name) {
            graph[restaurant.name][otherRestaurant.name] = calculateDistance(
              restaurant.y_coordi, // x_coordi와 y_coordi 순서 변경
              restaurant.x_coordi,
              otherRestaurant.y_coordi,
              otherRestaurant.x_coordi,
            );
          }
        }
      }

      console.log('Graph:', graph);

      const distances = dijkstra(graph, priorityRestaurant.name);
      remainingRestaurants.sort(
        (a, b) => distances[a.name] - distances[b.name],
      );

      console.log('Distances:', distances);
    }

    // 정렬된 배열을 설정
    const reorderedRestaurants = priorityRestaurant
      ? [priorityRestaurant, ...remainingRestaurants]
      : remainingRestaurants;

    // 상태 업데이트
    setSelectedRestaurants(reorderedRestaurants);
    saveSelectedRestaurants(reorderedRestaurants);
    console.log('Updated selectedRestaurants:', reorderedRestaurants); // 상태 업데이트 후 콘솔 로그 출력
  };

  // 상태가 변경되면 컴포넌트를 다시 렌더링
  useEffect(() => {
    console.log('selectedRestaurants state updated:', selectedRestaurants);
  }, [selectedRestaurants]);

  const handleRestaurantClick = (restaurant) => {
    // 이전 상태 저장
    setPreviousState({
      searchTerm: searchTerm,
      filteredResults: filteredResults,
      restaurantData: restaurantData,
    });

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
        // 이미 선택된 식당을 제외
        .filter(
          (result) =>
            !selectedRestaurants.some(
              (restaurant) => restaurant.name === result.name,
            ),
        );

      setFilteredResults(results);
    } else {
      // 입력값이 없을 때 상태 초기화
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
        // 이미 선택된 카테고리를 클릭하면 해당 카테고리 제거
        return prevSelectedCategories.filter((cat) => cat !== category);
      } else {
        // 선택되지 않은 카테고리를 클릭하면 해당 카테고리 추가
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

  // 이전 상태로 복원하는 함수
  const handleGoBack = () => {
    setSearchTerm(previousState.searchTerm);
    setFilteredResults(previousState.filteredResults);
    setRestaurantData(previousState.restaurantData);
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
            onClick={() => filterByCategory('고기집')}
            className={`category-button ${
              selectedCategories.includes('고기집') ? 'active' : ''
            }`}
          >
            고기집
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
            onClick={() => filterByCategory('치킨')}
            className={`category-button ${
              selectedCategories.includes('치킨') ? 'active' : ''
            }`}
          >
            치킨
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
            onClick={() => filterByCategory('경양식')}
            className={`category-button ${
              selectedCategories.includes('경양식') ? 'active' : ''
            }`}
          >
            경양식
          </button>
          <button
            onClick={() => filterByCategory('전시회')}
            className={`category-button ${
              selectedCategories.includes('전시회') ? 'active' : ''
            }`}
          >
            전시회
          </button>

          <button
            onClick={() => filterByCategory('분식')}
            className={`category-button ${
              selectedCategories.includes('분식') ? 'active' : ''
            }`}
          >
            분식
          </button>
          <button
            onClick={() => filterByCategory('횟집')}
            className={`category-button ${
              selectedCategories.includes('횟집') ? 'active' : ''
            }`}
          >
            횟집
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
                    e.stopPropagation(); // 부모 클릭 이벤트 전파 중지
                    addRestaurantToList(result);
                    setRestaurantData(null); // 추가 후 선택된 가게 정보 비우기
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
            Reorder by Distance
          </button>
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
