const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const currentWeatherItemEl = document.getElementById('current-weather-item');
const timezone = document.querySelector('time-zone');
const countryEl = document.querySelector('country');
const weatherForecastEl = document.querySelector('.weather-forecast');
console.log(weatherForecastEl);
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const API_KEY = '17bbb7f79ac65b6c44ecb138dc11d3ef';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();

    const hoursIn24Format = hour > 12 ? hour % 12 : hour;
    const minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    //``shiyong 
    timeEl.innerHTML = hoursIn24Format + ":" + minutes + " " + `<span id='am-pm'>${ampm}</span>`;
    dateEl.innerHTML = months[month] + " " + date + ", " + days[day];

}, 1000);

getWeatherDate();
function getWeatherDate() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;


        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=hourly,minutely&appid=${API_KEY}`).then(res => res.json()).then(data => {
           
            showWeatherData(data);
        })

    })

    
}

function showWeatherData(data) {
    let { humidity, pressure, sunset, sunrise, wind_speed } = data.current;
    currentWeatherItemEl.innerHTML = 
    `<div class="weather-item">
        <p>Humidity</p>
        <p>${humidity}%</p>
     </div>

     <div class="weather-item">
        <p>Pressure</p>
        <p>${pressure}</p>
     </div>

     <div class="weather-item">
        <p>Wind Speed</p>
        <p>${wind_speed}</p>
     </div>
     <div class="weather-item">
        <p>Sunrise</p>
        <p>${window.moment(sunrise * 1000).format('HH:mm a')}</p>
     </div>
     <div class="weather-item">
        <p>Sunset</p>
        <p>${window.moment(sunset * 1000).format('HH:mm a')}</p>
     </div>
     `;


     let otherDayForcast = '';
     data.daily.forEach((day, idx)=>{
        if (idx = 0) {
            currentTempEl.innerHTML = 
            `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}</div>
                <div class="temp">Day - ${day.temp.day}</div>
            </div>
            `;
        } else {
            otherDayForcast +=
            `<div class="weather-forecast-item">
               <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
               <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
               <div class="temp">Night - ${day.temp.night}</div>
               <div class="temp">Day - ${day.temp.day}</div>
           </div>`;
        }
    })

    weatherForecastEl.innerHTML=otherDayForcast;
    
}
