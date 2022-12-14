// Clears search bar
const cancel = document.querySelector('#cancel-button')
cancel.addEventListener('click', () => {
  const searchBar = document.querySelector('#search-bar')
  searchBar.value = ''
})

// Call this function to create an alert at the top of the page!
const newAlert = (message) => {
  const alert = document.createElement('div')
  const close = document.createElement('div')
  alert.classList.add('alert')
  close.classList.add('close')
  alert.innerText = message
  close.innerText = 'X'
  const alertArea = document.querySelector('#alert-area')
  alertArea.prepend(alert)
  alert.appendChild(close)
  close.addEventListener('click', () => alert.remove())
}

// generates  alert with an error message
const handleError = (error) => {
  newAlert(error.message)
  console.error(error)
}

// displays a fullscreen  loader
const runSpinner = () => {
  const splash = document.createElement('div')
  const loader = document.createElement('h1')
  loader.innerText = 'LOADING...'
  loader.id = 'loader'
  splash.classList.add('splash')
  const body = document.querySelector('body')
  body.prepend(splash)
  splash.appendChild(loader)
}

// removes fullscreen loader
const stopSpinner = () => {
  const splash = document.querySelector('.splash')
  splash.remove()
}

// handles form sumbit
const handleSubmit = async (location) => {
  runSpinner()
  const weatherInfo = await getWeatherInfo(location)
  stopSpinner()
  renderWeatherInfo(weatherInfo)
}

// AUTOCOMPLETE
function initAutocomplete() {
  // init autocomplete for search bar
  autocomplete = new google.maps.places.Autocomplete(
    document.querySelector('#search-bar'),
    {
      componentRestrictions: { country: ['AU'] },
      fields: ['geometry'],
      types: ['(cities)']
    }
  )

  // run handleSubmit when a location is selected
  autocomplete.addListener('place_changed', () => {
    const { lat, lng } = autocomplete.getPlace().geometry.location
    console.log(lat(), lng())
    handleSubmit({ lat: lat(), lng: lng() })
  })
}

// function for making request to apis
const apiFetch = async (url) => {
  try {
    const response = await fetch(url, {
      'Access-Control-Allow-Origin': 'https://api.openweathermap.org'
    })
    if (response.status === 200) {
      const text = await response.text()
      const data = JSON.parse(text)
      console.log('this should be the response: ', data)
      return data
    } else {
      throw new Error('something went wrong')
    }
  } catch (error) {
    handleError(error)
  }
}

// receives geolocation and builds a url for api request and sends it.
const getWeatherInfo = async ({ lat, lng }) => {
  const apiKey = '3fb3bd415089d39656842aea6abbf73f'
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`
  const current = await apiFetch(currentUrl)
  return current
}

// rendersWeatherInfo
const renderWeatherInfo = (current) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const mainDate = document.getElementById('main-date')
  const timeStamp = new Date(current.dt * 1000)
  // const dateStr = timeStamp.toLocaleDateString()
  const dateStr = `${timeStamp.getDay()} ${
    months[timeStamp.getMonth()]
  } ${timeStamp.getFullYear()}`
  mainDate.innerHTML = dateStr

  const mainLocation = document.getElementById('main-location')
  const currLocation = current.name + ',' + current.sys.country
  mainLocation.innerHTML = `${currLocation}`

  const weatherIconID = current.weather[0].icon
  document.getElementById(
    'weather-icon'
  ).src = `http://openweathermap.org/img/wn/${weatherIconID}@2x.png`

  const weatherDescription = document.getElementById('weather-description')
  const currDescription = current.weather[0].description
  console.log(currDescription)
  weatherDescription.textContent = `${currDescription}`

  const currTemp = Math.round(current.main.temp - 273)
  const currTempDom = document.getElementById('temp')
  currTempDom.innerHTML = `${currTemp} C`
  document.getElementById('temp-img').src = './resources/temp.png'
  // const weatherBorder = document.getElementsByClassName("weather-buttons")
  // weatherBorder.style.border = "thick solid black"
  document.getElementById('wb1').style.border = '2px solid grey'

  const sunriseTimeStamp = new Date(current.sys.sunrise * 1000)
  const sun = document.getElementById('sun')
  sun.textContent = `Sunrise: ${sunriseTimeStamp.getHours()}:${sunriseTimeStamp.getMinutes()}`
  document.getElementById('sunset-img').src = './resources/sunset.png'
  document.getElementById('wb2').style.border = '2px solid grey'

  const sunsetTimeStamp = new Date(current.sys.sunset * 1000)
  const sunset = document.getElementById('sunset')
  sunset.textContent = `Sunset: ${sunsetTimeStamp.getHours()}:${sunsetTimeStamp.getMinutes()}`

  const rain = current.main.humidity
  const rainPercent = document.getElementById('rain')
  rainPercent.textContent = `${rain}%`
  document.getElementById('rain-img').src = './resources/rain.png'
  document.getElementById('wb3').style.border = '2px solid grey'

  const wind = current.wind.speed
  const windDom = document.getElementById('wind')
  windDom.textContent = `${wind} m/s`
  document.getElementById('wind-img').src = './resources/wind.png'
  document.getElementById('wb4').style.border = '2px solid grey'
}
