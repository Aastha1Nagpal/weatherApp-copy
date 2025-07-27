const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

//set interval function will call itself till infinity and we are calling it after every 1 sec

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '4710ec7ef6574f98864223029252507';

// setInterval(() => {
//     const time = new Date();
//     const month = time.getMonth();
//     const date = time.getDate();
//     const day = time.getDay();
//     const hour = time.getHours(); //it will give 24 hour clock
//     // const hours12HourFormat = hour>= 13 ? hour %12 :hour // if want in 12 hour format
//     const minutes = time.getMinutes();
//     // const ampm = hour >= 12? 'PM' : 'AM';

//     timeEl.innerHTML = hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

//     dateEl.innerHTML = days[day] + ',' + ' ' + date + ' ' + months[month];
// }, 1000);


function updateTimeAndDate(localtime) {
    const time = new Date(localtime);
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    timeEl.innerHTML = hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}


//calling api
//we'll use navigator to get the geo location
//popup to get location

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=4710ec7ef6574f98864223029252507&q=${latitude},${longitude}&days=8`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

//we'll get data from current (console on chrome)
function showWeatherData(data) {
    updateTimeAndDate(data.location.localtime);
    timezone.innerText = data.location.name;
countryEl.innerText = data.location.country;
    let { humidity, pressure_mb, wind_kph } = data.current;
    let { sunrise, sunset } = data.forecast.forecastday[0].astro;
    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
                        <div>Humidity</div>
                        <div>${humidity}</div>
                    </div>
                    <div class="weather-item">
                        <div>Pressure</div>
                        <div>${pressure_mb}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind speed</div>
                        <div>${wind_kph}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunrise</div>
                        <div>${moment(sunrise, "hh:mm A").format("HH:mm")}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunset</div>
                        <div>${moment(sunset, "hh:mm A").format("HH:mm")}</div>
                    </div>`;
    let otherDayForecast = '';
    data.forecast.forecastday.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
    <img src="${day.day.condition.icon}" alt="weather icon" class="w-icon">
    <div class="other">
        <div class="day">${moment(day.date).format('dddd')}</div>
        <div class="temp"> Day - ${day.day.maxtemp_c}&#176;C</div>
        <div class="temp"> Night - ${day.day.mintemp_c}&#176;C</div>
    </div>
`;


        }
        else {
            otherDayForecast += `
                            <div class="weather-forecast-item">
        <div class="day">${moment(day.date).format('dddd')}</div>
        <img src="${day.day.condition.icon}" alt="weather icon" class="w-icon">
        <div class="temp"> Day - ${day.day.maxtemp_c}&#176;C</div>
        <div class="temp"> Night - ${day.day.mintemp_c}&#176;C</div>
            </div>
                            `
        }
    });
    weatherForecastEl.innerHTML = otherDayForecast;
}


//search weather

function searchCity() {
    const city = document.getElementById('city-input').value.trim();
    if (city !== "") {
        fetchWeatherByCity(city);
    }
}

document.getElementById('city-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchCity(); // Call the same function as the button
    }
});

function fetchWeatherByCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=4710ec7ef6574f98864223029252507&q=${city}&days=8`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(error => {
            alert('City not found or API error');
            console.error(error);
        });
}