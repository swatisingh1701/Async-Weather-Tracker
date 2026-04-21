const API_KEY = "e7246be6c66cda3c54a1d9aeb91bf062";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const eventLog = document.getElementById("eventLog");
const searchHistory = document.getElementById("searchHistory");
let history = [];

function logEvent(text, type = 'sync') {
    const div = document.createElement("div");
    div.className = `log-${type}`;
    div.textContent = `> ${text}`;
    eventLog.appendChild(div);
    eventLog.scrollTop = eventLog.scrollHeight;
}

async function fetchWeather(city) {
    eventLog.innerHTML = ""; 
    logEvent("Sync Start", "sync");
    
    try {
        logEvent("[ASYNC] Start fetching", "async");
        setTimeout(() => {
            logEvent("setTimeout (Macrotask)", "macro");
        }, 0);

        Promise.resolve().then(() => {
            logEvent("Promise.then (Microtask)", "micro");
        });

        const response = await fetch(`${API_URL}${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if(response.ok) {
            logEvent("[ASYNC] Data received", "async");
            displayWeather(data);
            saveToHistory(city);
        } else {
            throw new Error("City not found");
        }
    } catch(err) {
        logEvent(`Error: ${err.message}`, "sync");
    }

    logEvent("Sync End", "sync");
}

function displayWeather(data) {
    weatherResult.innerHTML = `
        <div class="row"><span>City</span><span class="val">${data.name}, ${data.sys.country}</span></div>
        <div class="row"><span>Temp</span><span class="val">${data.main.temp} °C</span></div>
        <div class="row"><span>Weather</span><span class="val">${data.weather[0].main}</span></div>
        <div class="row"><span>Humidity</span><span class="val">${data.main.humidity}%</span></div>
        <div class="row"><span>Wind</span><span class="val">${data.wind.speed} m/s</span></div>
    `;
}
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if(city) fetchWeather(city);
});
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    if(!history.includes(city)) {
        history.unshift(city);
        if(history.length > 5) history.pop();
        displayHistory();
    }
}
function displayHistory() {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    searchHistory.innerHTML = "";
    history.forEach(city => {
        const span = document.createElement("span");
        span.textContent = city;
        span.onclick = () => fetchWeather(city);
        searchHistory.appendChild(span);
    });
}
displayHistory();
