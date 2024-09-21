const searchFormEl = document.getElementById('search-form');
const cityInputEl = document.getElementById('city-input');
const searchHistoryContainer = document.getElementById('search-history');
const forecastContainerEl=document.getElementById('current-forecast');
const cityName=document.getElementById('city-name');
const time=document.getElementById('time');
const currentWind=document.getElementById('wind');
const currentTemp=document.getElementById('temp');
const currentHumidity=document.getElementById('humidity');
const fiveDayForecastEl = document.querySelector('#five-day-forecast');
const apiKey="4b271f2c8693e98196bc7672be995d17";


const formSubmitHandler = function (event) {
  event.preventDefault();
  searchHistoryContainer.innerHTML='';
  const city = cityInputEl.value.trim();
  if (city) {
    getCoordinates(city);
    //forecastContainerEl.textContent = '';
    cityInputEl.value = '';
    saveSearchHistory(city);
  } else {
    alert('Please enter the city to view the weather forecast');
  }
};
searchFormEl.addEventListener('submit',formSubmitHandler);
//first get city coordinates from the api to use them later to build a weather api url
const getCoordinates = function (city) {
  fiveDayForecastEl.innerHTML = '';
  const  geocodingApiUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${city},US&limit=1&appid=${apiKey}`
   fetch (geocodingApiUrl)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log("Data:", data);
           const {lat, lon, name} = data[0];
            getForecast(lat,lon);
          });
        } else {
          alert(`Error: ${response.statusText}`);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
      
    };
//render weather for Miami when page loads
    getCoordinates('Miami');

    function getForecast(lat,lon) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
          console.log("Weather data: ", data);
          updateCurrentWeather(data);
          updateForecast(data);
          
      });
  }

  //function to save the city to the search history and make it clickable
 function saveSearchHistory (city) {
  const searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
  console.log("search history:", searchHistoryArray)
  searchHistoryArray.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
  const searchHistoryFromStorage=JSON.parse(localStorage.getItem("searchHistory"));

  // Create buttons for each city in the search history
  const buttonsToRender = [...new Set(searchHistoryFromStorage)];
  
  buttonsToRender.map(city => {
      const button = document.createElement('button');
      button.textContent = city;
      button.addEventListener('click', () => {
        getCoordinates(city)
      });
      searchHistoryContainer.appendChild(button);
  });

  console.log(searchHistoryArray);
  return
}

  function updateCurrentWeather(data) {
// Get the current timestamp
const timestamp = Date.now();
for (let i=0; i<data.list.length; i++) {
  if (timestamp<=data.list[i].dt) {
    continue;
  } else {
    cityName.textContent=`${data.city.name}`;
    time.textContent=new Date();
    currentWind.textContent=`${data.list[i].wind.speed} mph`;
    currentTemp.textContent=`${data.list[i].main.temp} F`;
    currentHumidity.textContent=`${data.list[i].main.humidity}`;
  }
}  
 
  }
  function updateForecast (data) {
const fiveDayWeather=[data.list[0], data.list[8],data.list[16],data.list[24],data.list[32]];
console.log("Five day weather: ", fiveDayWeather)
fiveDayWeather.map(day => {
  const card = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent=`${day.dt_txt}`;
  card.appendChild(h2);
  const weather=document.createElement('span');
  if (day.weather[0].main=="Clouds") {
    weather.className="fa-solid fa-cloud";
  } else if (day.weather[0].main=="Rain") {
    weather.className="fa-solid fa-cloud-showers-heavy";
  } else if (day.weather[0].main=="Clear") {
    weather.className="fa-solid fa-sun";
  } 
  card.appendChild(weather);
  const ul = document.createElement('ul');
  const wind = document.createElement('li');
  wind.textContent=`Wind: ${day.wind.speed} mph`
  const temp = document.createElement('li');
  temp.textContent=`Temp: ${day.main.temp} F`
  const humidity = document.createElement('li');
  humidity.textContent=`Humidity: ${day.main.humidity}%`
  ul.appendChild(wind);
  ul.appendChild(temp);
  ul.appendChild(humidity);
  card.appendChild(ul);
  fiveDayForecastEl.appendChild(card);
});

  }
