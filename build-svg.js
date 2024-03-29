const WEATHER_API_KEY = process.env.WEATHER_API_KEY

let fs = require('fs')
let formatDistance = require('date-fns/formatDistance')
let weather = require('openweather-apis')
let qty = require('js-quantities')

const emojis = {
  '01d': '☀️',
  '02d': '⛅️',
  '03d': '☁️',
  '04d': '☁️',
  '09d': '🌧',
  '10d': '🌦',
  '11d': '🌩',
  '13d': '❄️',
  '50d': '🌫'
}

// Time working at PlanetScale
const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long',timeZone: 'Asia/Kolkata' }).format(today)

const psTime = formatDistance(new Date(2020, 09, 12), today, {
  addSuffix: false
})

// Today's weather
weather.setLang('en')
weather.setCoordinate(19.080113748891442, 72.87225152222301)
weather.setUnits('metric')
weather.setAPPID(WEATHER_API_KEY)

weather.getWeatherOneCall(function (err, data) {
  if (err) console.log(err)

  const degC = Math.round(data.daily[0].temp.max)
  const icon = data.daily[0].weather[0].icon

  fs.readFile('template.svg', 'utf-8', (error, data) => {
    if (error) {
      console.error(error)
      return
    }

    data = data.replace('{degC}', degC)
    data = data.replace('{weatherEmoji}', emojis[icon])
    data = data.replace('{psTime}', psTime)
    data = data.replace('{todayDay}', todayDay)

    data = fs.writeFile('chat.svg', data, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
  })
})
