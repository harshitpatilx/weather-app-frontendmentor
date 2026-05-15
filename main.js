
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
  wc_sunny = [0, 1] // clear, mainly clear
  wc_partlycloudy = [2] //partly cloudy
  wc_overcast = [3] //overcast
  wc_drizzle = [51, 53, 55, 56, 57] //Drizzle: Light, moderate, and dense intensity and Freezing Drizzle: Light and dense intensity
  wc_fog = [45, 48] //Fog and depositing rime fog
  wc_rain = [61, 63, 65, 66, 67, 80, 81, 82] //Rain: Slight, moderate and heavy intensity, Freezing Rain: Light and heavy intensity, Rain showers: Slight, moderate, and violent
  wc_snow = [71, 73, 75, 77, 85, 86] //Snow fall: Slight, moderate, and heavy intensity, Snow grains, Snow showers slight and heavy
  wc_storm = [95, 96, 97] //Thunderstorm: Slight or moderate
  let weatherImg = './assets/images/weather_icons/icon-sunny.webp'
  if (wc_sunny.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-sunny.webp'
  } else if (wc_partlycloudy.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-partly-cloudy.webp'
  } else if (wc_overcast.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-overcast.webp'
  } else if (wc_drizzle.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-drizzle.webp'
  } else if (wc_fog.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-fog.webp'
  } else if (wc_rain.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-rain.webp'
  } else if (wc_snow.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-snow.webp'
  } else if (wc_storm.includes(weatherCode)) {
    weatherImg = './assets/images/weather_icons/icon-storm.webp'
  }
  return weatherImg
}

function getDailyForecast(daily, daily_units){
  let cards = document.getElementsByClassName('wfc');
  for (let day = 0; day < 7; day++) {
    const todaysDay = new Date(daily.time[day]).toLocaleDateString('en-US', { weekday: 'short' });
    const weatherImg = getWeatherIcon(daily.weather_code[day]);
    const highTemp = `${Math.floor(daily.temperature_2m_max[day])}${daily_units.temperature_2m_max}`;
    const lowTemp = `${Math.floor(daily.temperature_2m_min[day])}${daily_units.temperature_2m_max}`;

    cards[day].innerHTML = `<div class="day">${todaysDay}</div><div class="weatherIcon"><img src="${weatherImg}" alt=""></div><div class="temperatures"><div class="tempHigh">${highTemp}</div><div class="tempLow">${lowTemp}</div></div>`;
  }

  return [daily, daily_units]

}

let api = "https://api.open-meteo.com/v1/forecast?latitude=21.1938&longitude=81.3509&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code";

async function main() {
  const a = await fetch(api).then(response => response.json())

  b = await a
  console.log(b)

  // head Stats
  document.getElementById('currentTemp').innerHTML = `${Math.ceil(b.current.temperature_2m)}°`;
  const todaysDay = new Date(b.current.time).toLocaleDateString('en-US', { weekday: 'long' });
  const todaysDate = new Date(b.current.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('todaysDate').innerHTML = `${todaysDay}, ${todaysDate}`;

  const currentLocation = await getCity(b.latitude, b.longitude)
  document.getElementById('currentLocation').innerHTML = currentLocation;


  let weatherImg = getWeatherIcon(b.current.weather_code)
  document.getElementById('HeadStatIconContainer').insertAdjacentHTML('afterbegin', `<img src="${weatherImg}" alt="">`)

  // FHWP
  document.getElementById('feelslikeTemp').innerHTML = `${Math.ceil(b.current.apparent_temperature)}°`;
  document.getElementById('currentHumidity').innerHTML = `${Math.ceil(b.current.relative_humidity_2m)}%`;
  document.getElementById('windSpeed').innerHTML = `${Math.ceil(b.current.wind_speed_10m)} km/h`;
  document.getElementById('currentPpt').innerHTML = `${Math.ceil(b.current.precipitation)} mm`;


  //Daily Forecast
  let dailyData = getDailyForecast(b.daily, b.daily_units)
  console.log(dailyData)
}

main()


