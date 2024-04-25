import { useEffect, useState } from 'react';
import jsonData from '../../../assets/projdb_comp.json'; // Import the JSON file



function searchedList() {
  const keyword = '김밥';


  const lists = jsonData.rows.filter((restaurant) => {if(restaurant[3] != null) restaurant[3].includes(keyword)});
  

  return(
    <>
      {lists.map((item) => (
        <Card key={item} {...item} />  // 잔여연산자 사용
      ))}
    </>)
}
  
  // Card component
  
  
  function Card(key) {   
    return (
      <div className='cardContainer'>
        <h2>상호명   {key[3]}</h2>
        <h2>품목 {key[4]}</h2>
        <h2>전화번호 {key[0]}</h2>
        <h2>네이버 url {key[7]}</h2>
      </div>
    );
  }

export default searchedList;
