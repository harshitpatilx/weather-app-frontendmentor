
async function getCity(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&limit=1`);

  const data = await res.json();

  return (`${data.address.city || data.address.town || data.address.village}, ${data.address.country}`);
}


async function getCoordinates(city) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`);

  const data = await res.json();
  return {
    lat: data[0].lat,
    lng: data[0].lon
  };
}

function getWeatherIcon(weatherCode) {
  wc_sunny = [0, 1] 
  wc_partlycloudy = [2] 
  wc_overcast = [3] 
  wc_drizzle = [51, 53, 55, 56, 57] 
  wc_fog = [45, 48] 
  wc_rain = [61, 63, 65, 66, 67, 80, 81, 82] 
  wc_snow = [71, 73, 75, 77, 85, 86] 
  wc_storm = [95, 96, 97] 
  let weatherImg = './assets/weather_icons/icon-sunny.webp'
  if (wc_sunny.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-sunny.webp'
  } else if (wc_partlycloudy.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-partly-cloudy.webp'
  } else if (wc_overcast.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-overcast.webp'
  } else if (wc_drizzle.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-drizzle.webp'
  } else if (wc_fog.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-fog.webp'
  } else if (wc_rain.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-rain.webp'
  } else if (wc_snow.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-snow.webp'
  } else if (wc_storm.includes(weatherCode)) {
    weatherImg = './assets/weather_icons/icon-storm.webp'
  }
  return weatherImg
}

function getWeatherInfo(weatherCode){
  let weatherInfo = ''
  weatherCodes = {0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Depositing rime fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle', 55:'Dense Drizzle', 56: 'Light Freezing Drizzle', 57: 'Heavy Freezing Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain', 71: 'Slight Snow Fall', 73: 'Moderate Snow Fall', 75: 'Heavy Snow Fall', 77: 'Snow Grains', 80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers', 85: 'Slight Snow Showers', 86: 'Heavy Snow Showers', 95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'}
  
  if(weatherCodes[weatherCode]){
    weatherInfo = weatherCodes[weatherCode]
  }
  return weatherInfo
}

function getDailyForecast(daily, daily_units){
  let cards = document.getElementsByClassName('days');
  for (let day = 0; day < 7; day++) {
    const todaysDay = new Date(daily.time[day]).toLocaleDateString('en-US', { weekday: 'short' });
    const weatherImg = getWeatherIcon(daily.weather_code[day]);
    let weatherInfo = getWeatherInfo(b.current.weather_code);
    const highTemp = Math.floor(daily.temperature_2m_max[day]);
    const lowTemp = Math.floor(daily.temperature_2m_min[day]);

    cards[day].innerHTML = `
    <div class="day">${todaysDay}</div>
          <img src="${weatherImg}" alt="" class="dayWeatherIcon" title='${weatherInfo}'>
          <div class="dayTemp">
            <div class="daylowtemp">${highTemp}°</div>
            <div class="dayhightemp">${lowTemp}°</div>
          </div>
    `;
  }
}

let latt = 21.1915;
let long = 81.2762;

let api = `https://api.open-meteo.com/v1/forecast?latitude=${latt}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code`;

async function main() {
  const a = await fetch(api).then(response => response.json())

  b = await a
  // console.log(b)

  // Main Stats
  document.getElementById('currentTemperature').innerHTML = `${Math.ceil(b.current.temperature_2m)}°`;
  const todaysDay = new Date(b.current.time).toLocaleDateString('en-US', { weekday: 'long' });
  const todaysDate = new Date(b.current.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('currentDate').innerHTML = `${todaysDay}, ${todaysDate}`;

  const currentLocation = await getCity(b.latitude, b.longitude)
  document.getElementById('currentLocation').innerHTML = currentLocation;

  let weatherImg = getWeatherIcon(b.current.weather_code)
  let weatherInfo = getWeatherInfo(b.current.weather_code)

  document.querySelector('.subBox2').insertAdjacentHTML('afterbegin', `<img id='currentWeatherIcon' src="${weatherImg}" alt="" title='${weatherInfo}'>`)

  // FHWP
  document.getElementById('currappTemperature').innerHTML = `${Math.ceil(b.current.apparent_temperature)}°`;
  document.getElementById('currHumidity').innerHTML = `${Math.ceil(b.current.relative_humidity_2m)}%`;
  document.getElementById('currwindSpeed').innerHTML = `${Math.ceil(b.current.wind_speed_10m)} km/h`;
  document.getElementById('currPpt').innerHTML = `${Math.ceil(b.current.precipitation)} mm`;


  //Daily Forecast
  getDailyForecast(b.daily, b.daily_units)
}

main()


