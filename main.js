let api = "https://api.open-meteo.com/v1/forecast?latitude=21.1938&longitude=81.3509&daily=weather_code,temperature_2m_max,apparent_temperature_max,wind_speed_10m_max,precipitation_sum&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,precipitation";

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

async function main(){
    const a = await fetch(api).then(response=>response.json())

    b = await a
    console.log(b)
    // head Stats
    document.getElementById('currentTemp').innerHTML = `${Math.ceil(b.current.temperature_2m)}°`;
    const todaysDay = new Date(b.current.time).toLocaleDateString('en-US', {weekday: 'long'});
    const todaysDate = new Date(b.current.time).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
    document.getElementById('todaysDate').innerHTML = `${todaysDay}, ${todaysDate}`;
    
    const currentLocation = await getCity(b.latitude, b.longitude)
    console.log(currentLocation)
    document.getElementById('currentLocation').innerHTML = currentLocation;



    // FHWP
    document.getElementById('feelslikeTemp').innerHTML = `${Math.ceil(b.current.apparent_temperature)}°`;
    document.getElementById('currentHumidity').innerHTML = `${Math.ceil(b.current.relative_humidity_2m)}%`;
    document.getElementById('windSpeed').innerHTML = `${Math.ceil(b.current.wind_speed_10m)} km/h`;
    document.getElementById('currentPpt').innerHTML = `${Math.ceil(b.current.precipitation)} mm`;
    
    
}

main()


