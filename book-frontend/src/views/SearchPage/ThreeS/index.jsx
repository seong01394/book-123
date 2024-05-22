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
  const [closestRestaurants, setClosestRestaurants] = useState([]);
  const [markers, setMarkers] = useState([]); // State to store markers

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=xodt3v6svf`;
    script.async = true;
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

      const storedRestaurants = loadSelectedRestaurants();
      setSelectedRestaurants(storedRestaurants);

      // Create markers for stored restaurants
      if (storedRestaurants && mapInstance) {
        const newMarkers = storedRestaurants.map((restaurant) =>
          createMarker(restaurant.x_coordi, restaurant.y_coordi, mapInstance),
        );
        setMarkers(newMarkers);
      }
    };
    document.head.appendChild(script);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const searchPubTransPathAJAX = (SX, SY, EX, EY, colorIndex) => {
    return new Promise((resolve, reject) => {
      const distance = calculateDistance(SY, SX, EY, EX);

      const xhr = new XMLHttpRequest();
      const url = `https://api.odsay.com/v1/api/searchPubTransPathT?SX=${SX}&SY=${SY}&EX=${EX}&EY=${EY}&apiKey=3oN7X1QUnTil99wEjCYGKtYmr%2BemP3%2FqOR4Monpr1GA`;
      xhr.open('GET', url, true);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            if (
              response.result &&
              response.result.path &&
              response.result.path.length > 0
            ) {
              const mapObj = response.result.path[0].info.mapObj;
              callMapObjApiAJAX(mapObj, SX, SY, EX, EY, colorIndex);
              displayPathInfo(response.result.path[0], colorIndex); // colorIndex 추가
              resolve();
            } else if (distance < 0.7) {
              // 수정된 부분: 거리 조건을 명확히 함
              console.log('700m 이내 경로라 직선으로 표기합니다');
              drawBasicPath(SX, SY, EX, EY, -1); // -1을 사용하여 검정색을 지정
              resolve();
            } else {
              console.error('No path found');
              reject(new Error('No path found'));
            }
          } else {
            console.error(
              `Error fetching path: ${xhr.status} - ${xhr.statusText}`,
            );
            reject(
              new Error(
                `Error fetching path: ${xhr.status} - ${xhr.statusText}`,
              ),
            );
          }
        }
      };
    });
  };

  const colorNames = [
    '빨간색 경로',
    '주황색 경로',
    '노란색 경로',
    '초록색 경로',
    '파란색 경로',
    '남색 경로',
    '보라색 경로',
    '검정색 경로',
  ];

  const displayPathInfo = (pathData, colorIndex) => {
    const pathsContainer = document.getElementById('paths-container');
    const colorName = colorNames[colorIndex % colorNames.length];
    const pathColor = getColorByIndex(colorIndex);

    const pathElement = document.createElement('div');
    pathElement.className = 'path-card';

    let pathDetails = `
  <div class="path-header" style="background-color: ${pathColor}; color: white;">
  <h2>${colorName} 안내</h2>
      </div>
      <div class="path-body">
          <p><strong>총 거리:</strong> ${pathData.info.totalDistance} meters</p>
          <p><strong>총 도보 거리:</strong> ${pathData.info.totalWalk} meters</p>
          <p><strong>버스 환승 횟수:</strong> ${pathData.info.busTransitCount}</p>
          <p><strong>지하철 환승 횟수:</strong> ${pathData.info.subwayTransitCount}</p>
          <p><strong>총 소요 시간:</strong> ${pathData.info.totalTime} minutes</p>
          <p><strong>비용:</strong> ${pathData.info.payment} won</p>
      `;

    pathData.subPath.forEach((subPath, subIndex) => {
      if (subPath.trafficType === 2) {
        pathDetails += `
              <div class="sub-path">
                  <h3>경로 ${subIndex + 1} - 버스 ${subPath.lane[0].busNo}</h3>
                  <p><strong>거리:</strong> ${subPath.distance} meters</p>
                  <p><strong>정류장 수:</strong> ${subPath.stationCount}</p>
                  <p><strong>출발 정류장:</strong> ${subPath.startName}</p>
                  <p><strong>도착 정류장:</strong> ${subPath.endName}</p>
              </div>
          `;
      } else if (subPath.trafficType === 3) {
        pathDetails += `
              <div class="sub-path">
                  <h3>경로 ${subIndex + 1} - 도보</h3>
                  <p><strong>거리:</strong> ${subPath.distance} meters</p>
                  <p><strong>소요 시간:</strong> ${
                    subPath.sectionTime
                  } minutes</p>
              </div>
          `;
      }
    });

    pathDetails += `</div>`;
    pathElement.innerHTML = pathDetails;
    pathsContainer.appendChild(pathElement);
  };

  const callMapObjApiAJAX = (mapObj, SX, SY, EX, EY, colorIndex) => {
    const xhr = new XMLHttpRequest();
    const url = `https://api.odsay.com/v1/api/loadLane?mapObject=0:0@${mapObj}&apiKey=3oN7X1QUnTil99wEjCYGKtYmr%2BemP3%2FqOR4Monpr1GA`;
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resultJsonData = JSON.parse(xhr.responseText);
        drawNaverMarker(SX, SY);
        drawNaverMarker(EX, EY);
        drawNaverPolyLine(resultJsonData, colorIndex);
        if (resultJsonData.result.boundary) {
          const boundary = new window.naver.maps.LatLngBounds(
            new window.naver.maps.LatLng(
              resultJsonData.result.boundary.top,
              resultJsonData.result.boundary.left,
            ),
            new window.naver.maps.LatLng(
              resultJsonData.result.boundary.bottom,
              resultJsonData.result.boundary.right,
            ),
          );
          map.panToBounds(boundary);
        }
      }
    };
  };

  const drawNaverMarker = (x, y) => {
    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(y, x),
      map: map,
    });
  };

  const drawNaverPolyLine = (data, colorIndex) => {
    const colors = [
      '#FF0000',
      '#FFA500',
      '#FFFF00',
      '#008000',
      '#0000FF',
      '#4B0082',
      '#EE82EE',
    ];
    const strokeColor = colors[colorIndex % colors.length];

    data.result.lane.forEach((lane) => {
      lane.section.forEach((section) => {
        const lineArray = section.graphPos.map(
          (pos) => new window.naver.maps.LatLng(pos.y, pos.x),
        );

        new window.naver.maps.Polyline({
          map: map,
          path: lineArray,
          strokeWeight: 3,
          strokeColor: strokeColor,
        });
      });
    });
  };

  const drawBasicPath = (SX, SY, EX, EY, colorIndex) => {
    const pathColor =
      colorIndex === -1 ? '#000000' : getColorByIndex(colorIndex);
    const strokeColor = pathColor;

    const lineArray = [
      new window.naver.maps.LatLng(SY, SX),
      new window.naver.maps.LatLng(EY, EX),
    ];
    new window.naver.maps.Polyline({
      map: map,
      path: lineArray,
      strokeWeight: 3,
      strokeColor: strokeColor,
    });
    drawNaverMarker(SX, SY);
    drawNaverMarker(EX, EY);

    // 검정색 경로 안내 메시지 추가
    if (colorIndex === -1) {
      const colorName = colorNames[7]; // 검정색 경로 이름
      const pathElement = document.createElement('div');
      pathElement.className = 'path-card';
      pathElement.innerHTML = `
            <div class="path-header" style="background-color: ${pathColor}; color: white;">
                <h2>${colorName}</h2>
            </div>
            <div class="path-body">
                <p><strong>700m 이내 입니다. 걸어서 이동 하세요</strong></p>
            </div>
        `;
      document.getElementById('paths-container').appendChild(pathElement);
    }
  };

  const getColorByIndex = (index) => {
    const colors = [
      '#FF0000',
      '#FFA500',
      '#FFFF00',
      '#008000',
      '#0000FF',
      '#4B0082',
      '#EE82EE',
      '#000000',
    ];
    return colors[index % colors.length];
  };

  const handleFindPath = async () => {
    const fixedLocation = {
      x: 37.2117679,
      y: 126.9531452,
    };

    const findPath = async (currentIndex, colorIndex = 0) => {
      if (currentIndex === 0) {
        searchPubTransPathAJAX(
          fixedLocation.y,
          fixedLocation.x,
          selectedRestaurants[currentIndex].x_coordi,
          selectedRestaurants[currentIndex].y_coordi,
          colorIndex,
        );
      } else {
        await searchPubTransPathAJAX(
          selectedRestaurants[currentIndex - 1].x_coordi,
          selectedRestaurants[currentIndex - 1].y_coordi,
          selectedRestaurants[currentIndex].x_coordi,
          selectedRestaurants[currentIndex].y_coordi,
          colorIndex,
        );
      }
      if (currentIndex < selectedRestaurants.length - 1) {
        findPath(currentIndex + 1, colorIndex + 1);
      }
    };

    if (selectedRestaurants.length > 0) {
      findPath(0);
    } else {
      console.error('No restaurants selected to find a path.');
    }
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

  const createMarker = (lat, lng, map) => {
    return new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      icon: {
        url: 'https://navermaps.github.io/maps.js/docs/img/example/sp_pins_spot_v3.png', // 사용자 정의 아이콘 URL
        size: new window.naver.maps.Size(24, 37),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(12, 37),
      },
    });
  };

  const handleReset = () => {
    clearMarkers(); // 기존 마커 제거
    clearRestaurants(); // 선택된 식당 배열 초기화
    setMap(null); // 지도 초기화
    setRestaurantData(null); // 식당 데이터 초기화
    setSearchTerm(''); // 검색어 초기화
    setFilteredResults([]); // 필터링 결과 초기화

    const tripSummary = document.getElementById('trip-summary');
    const pathsContainer = document.getElementById('paths-container');

    // 경로 요약 정보 및 세부 정보 초기화
    if (tripSummary) {
      tripSummary.innerHTML = '';
    }
    if (pathsContainer) {
      pathsContainer.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=xodt3v6svf`;
    script.async = true;
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

      const storedRestaurants = loadSelectedRestaurants();
      setSelectedRestaurants(storedRestaurants);

      // Create markers for stored restaurants
      if (storedRestaurants && mapInstance) {
        const newMarkers = storedRestaurants.map((restaurant) =>
          createMarker(restaurant.x_coordi, restaurant.y_coordi, mapInstance),
        );
        setMarkers(newMarkers);
      }
    };
    document.head.appendChild(script);
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
  }, [searchKey]);

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
    const priorityTypes = getCurrentPriority();
    const firstPriorityType = priorityTypes[0];
    const filteredByType = jsonData.rows.filter(
      (row) => row[4] === firstPriorityType,
    );

    const distances = filteredByType.map((restaurant) => {
      const distance = calculateDistance(
        currentLocation.x,
        currentLocation.y,
        restaurant[5],
        restaurant[6],
      );
      return { ...restaurant, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);

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

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null)); // Clear all markers
    setMarkers([]);
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null); // Clear current location marker
      setCurrentLocationMarker(null);
    }
  };

  const clearRestaurants = () => {
    setSelectedRestaurants([]);
    setClosestRestaurants([]);
  };

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
          <button
            onClick={() => filterByCategory('술집')}
            className={`category-button ${
              selectedCategories.includes('술집') ? 'active' : ''
            }`}
          >
            술집
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
              <div className="restaurant-title">
                {restaurantData[3]}
                <button
                  className="add-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    let tmX = restaurantData[5] + 80;
                    let tmY = restaurantData[6] + 100280;
                    const [lon, lat] = proj4(tmProjection, wgs84Projection, [
                      tmX,
                      tmY,
                    ]);

                    addRestaurantToList({
                      name: restaurantData[3],
                      types: restaurantData[4],
                      phone: restaurantData[0],
                      x_coordi: lon,
                      y_coordi: lat,
                      details: restaurantData,
                    });
                    setRestaurantData(null);
                  }}
                >
                  +
                </button>
              </div>
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
          <button className="reorder" onClick={handleReorderRestaurants}>
            동선 재배열
          </button>
          <button className="CPR" onClick={handleReorderByDistance}>
            5개 선택지
          </button>
          <button className="found" onClick={handleFindPath}>
            길찾기
          </button>
          <button className="reset" onClick={handleReset}>
            초기화
          </button>
        </div>
        <div className="section-b"></div>
        <div className="section-c">
          <ul>
            {closestRestaurants.map((restaurant, index) => (
              <li key={index}>
                {restaurant.name} - {restaurant.types}
              </li>
            ))}
          </ul>
        </div>
        <div id="trip-summary" className="mb-8"></div>
        <div id="paths-container"></div>
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
