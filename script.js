const API_KEY = "2494f6225a584df7af3160214251006"; // WeatherAPI.com API key
const searchInput = document.getElementById("searchInput");
const weatherContainer = document.getElementById("weatherContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");

let debounceTimeout;
searchInput.addEventListener("keyup", (e) => {
  clearTimeout(debounceTimeout);
  const city = e.target.value.trim();
  if (city.length > 2) {
    debounceTimeout = setTimeout(() => fetchWeather(city), 500);
  } else {
    weatherContainer.innerHTML = "";
    errorMessage.textContent = "";
  }
});

async function fetchWeather(city) {
  try {
    loading.style.visibility = "visible";
    errorMessage.textContent = "";
    weatherContainer.innerHTML = "";
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    console.log("Fetching URL:", url);
    const res = await fetch(url);
    console.log("Response status:", res.status);
    if (!res.ok) {
      if (res.status === 429) throw new Error("API rate limit exceeded. Please try again later.");
      if (res.status === 401 || res.status === 403) throw new Error("Invalid API key. Please check your key.");
      throw new Error("City not found!");
    }
    const data = await res.json();
    console.log("API response data:", data);
    displayWeather(data);
  } catch (error) {
    errorMessage.textContent = error.message;
    console.error("Fetch error:", error.message);
  } finally {
    loading.style.visibility = "hidden";
  }
}

function displayWeather(data) {
  const card = document.createElement("div");
  card.className = "card-wrapper";
  const iconUrl = `https:${data.current.condition.icon}`;
  card.innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <img src="${iconUrl}" alt="Weather icon" class="weather-icon">
    <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
    <p><strong>Weather:</strong> ${data.current.condition.text}</p>
    <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
    <p><strong>Wind:</strong> ${data.current.wind_kph / 3.6} m/s</p>
  `;
  weatherContainer.appendChild(card);
}