'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Droplets, Wind, Eye, Sun, Moon,
  Cloud, CloudRain, CloudSnow, CloudDrizzle, Zap, Gauge,
  Activity, BarChart3, TrendingUp
} from 'lucide-react'

export default function WeatherPage() {
  const [query, setQuery] = useState('Ho Chi Minh City')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const BACKEND_URL = 'http://localhost:8080'
  
  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase()
    if (desc.includes('sunny') || desc.includes('clear')) return <Sun className="h-8 w-8 text-yellow-400" />
    if (desc.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-400" />
    if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-400" />
    if (desc.includes('snow')) return <CloudSnow className="h-8 w-8 text-blue-200" />
    if (desc.includes('drizzle')) return <CloudDrizzle className="h-8 w-8 text-blue-300" />
    if (desc.includes('storm') || desc.includes('thunder')) return <Zap className="h-8 w-8 text-yellow-300" />
    return <Cloud className="h-8 w-8 text-gray-400" />
  }

  const getUVStatus = (uvIndex) => {
    if (uvIndex <= 2) return { status: 'Low', color: 'text-green-400' }
    if (uvIndex <= 5) return { status: 'Moderate', color: 'text-yellow-400' }
    if (uvIndex <= 7) return { status: 'High', color: 'text-orange-400' }
    if (uvIndex <= 10) return { status: 'Very High', color: 'text-red-400' }
    return { status: 'Extreme', color: 'text-purple-400' }
  }

  const getAirQualityStatus = (visibility) => {
    if (visibility >= 10) return { status: 'Excellent', value: 95, color: 'text-green-400' }
    if (visibility >= 8) return { status: 'Good', value: 85, color: 'text-blue-400' }
    if (visibility >= 6) return { status: 'Moderate', value: 70, color: 'text-yellow-400' }
    if (visibility >= 4) return { status: 'Poor', value: 50, color: 'text-orange-400' }
    return { status: 'Very Poor', value: 30, color: 'text-red-400' }
  }

  // Generate mock 7-day forecast
  const generateForecast = (currentTemp) => {
    const days = ['Today', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']
    const icons = [Sun, CloudRain, Cloud, Sun, CloudRain, Sun, Cloud]
    
    return days.map((day, index) => ({
      day,
      icon: icons[index],
      high: currentTemp + Math.floor(Math.random() * 6) - 3,
      low: currentTemp - Math.floor(Math.random() * 8) - 2
    }))
  }

  // Generate mock hourly data for chart (every 3 hours)
  const generateHourlyData = (currentTemp) => {
    const hours = [0, 3, 6, 9, 12, 15, 18, 21].map(hour => {
      const displayHour = hour === 0 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`
      // Create natural temperature variation throughout the day
      let temp
      if (hour >= 6 && hour <= 12) {
        // Morning warming up
        temp = currentTemp + (hour - 6) * 2 + Math.floor(Math.random() * 3) - 1
      } else if (hour >= 12 && hour <= 18) {
        // Afternoon peak
        temp = currentTemp + 8 + Math.floor(Math.random() * 4) - 2
      } else if (hour >= 18 && hour <= 21) {
        // Evening cooling down
        temp = currentTemp + 6 - (hour - 18) * 2 + Math.floor(Math.random() * 3) - 1
      } else {
        // Night/early morning - cooler
        temp = currentTemp - 5 + Math.floor(Math.random() * 4) - 2
      }
      
      return { 
        hour: displayHour, 
        temp: Math.round(temp),
        icon: hour >= 6 && hour <= 18 ? 'sun' : hour >= 18 && hour <= 21 ? 'cloud' : 'moon'
      }
    })
    return hours
  }

  const fetchWeather = async () => {
    if (!query.trim()) {
      setError('Please enter a location')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/weather?location=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setWeatherData(null)
      } else {
        setWeatherData(data)
        setError('')
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  // Auto-load Ho Chi Minh City on component mount
  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/weather?location=${encodeURIComponent('Ho Chi Minh City')}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          setWeatherData(null)
        } else {
          setWeatherData(data)
          setError('')
        }
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.')
        setWeatherData(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialWeather()
  }, [])

  // Simple temperature chart component
  const SimpleTemperatureChart = ({ hourlyData }) => {
    const maxTemp = Math.max(...hourlyData.map(h => h.temp))
    const minTemp = Math.min(...hourlyData.map(h => h.temp))
    const tempRange = maxTemp - minTemp || 10
    
    const getWeatherIconSimple = (iconType) => {
      switch(iconType) {
        case 'sun': return <Sun className="h-5 w-5 text-yellow-400" />
        case 'cloud': return <Cloud className="h-5 w-5 text-gray-400" />
        case 'moon': return <Moon className="h-5 w-5 text-blue-300" />
        default: return <Sun className="h-5 w-5 text-yellow-400" />
      }
    }
    
    return (
      <div className="bg-white/5 rounded-xl p-6">
        {/* Chart container with proper grid */}
        <div className="relative">
          {/* Grid lines - vertical */}
          <div className="absolute inset-0 flex">
            {hourlyData.map((_, index) => (
              <div key={index} className="flex-1 relative">
                {index > 0 && <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>}
              </div>
            ))}
          </div>
          
          {/* Chart area with SVG */}
          <div className="relative h-64 mb-12">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Temperature line */}
              <path
                d={hourlyData.map((hour, index) => {
                  const x = ((index + 0.5) / hourlyData.length) * 100
                  const y = 85 - ((hour.temp - minTemp) / tempRange) * 60
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')}
                stroke="#f59e0b"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Temperature points only */}
              {hourlyData.map((hour, index) => {
                const x = ((index + 0.5) / hourlyData.length) * 100
                const y = 85 - ((hour.temp - minTemp) / tempRange) * 60
                
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="1.225"
                    fill="#f59e0b"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                )
              })}
            </svg>
          </div>
          
          {/* Time labels, weather icons and temperature in perfect grid */}
          <div className="grid grid-cols-8 gap-0">
            {hourlyData.map((hour, index) => (
              <div key={hour.hour} className="flex flex-col items-center space-y-1.5">
                {getWeatherIconSimple(hour.icon)}
                <div className="text-center">
                  <div className="text-sm text-white font-semibold mb-1">
                    {hour.temp}°
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {hour.hour}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with mountain image effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='mountain' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100L25 50L50 75L75 25L100 50L100 100Z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23mountain)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-400" />
                Lively Weather (Beta)
              </h1>
            </div>
            
            {/* Search Bar */}
            <div className="lg:w-96">
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search a place"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors"
                  disabled={loading || !query.trim()}
                >
                  <Search className="h-4 w-4 text-white" />
                </button>
              </form>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Weather Content */}
          {weatherData ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Main Weather */}
              <div className="xl:col-span-2 space-y-6">
                {/* Current Weather Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {weatherData.location.name}, {weatherData.location.country}
                      </h2>
                      <p className="text-gray-300">
                        {new Date(weatherData.location.localtime).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(weatherData.current.weather_descriptions[0])}
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-4 mb-6">
                    <div className="text-7xl font-light text-white">
                      {weatherData.current.temperature}°
                    </div>
                    <div className="text-2xl text-gray-300 mb-4">C</div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-300">
                    <span className="text-lg">{weatherData.current.weather_descriptions[0]}</span>
                    <span>Feels like {weatherData.current.feelslike}° C</span>
                  </div>
                </div>

                {/* 7-Day Forecast */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">7-Day Forecast</h3>
                  <div className="space-y-4">
                    {generateForecast(weatherData.current.temperature).map((day, index) => (
                      <div key={day.day} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                        <div className="flex items-center gap-4 flex-1">
                          <span className={`text-sm font-medium w-12 ${index === 0 ? 'text-blue-400' : 'text-gray-300'}`}>
                            {day.day}
                          </span>
                          <day.icon className="h-6 w-6 text-gray-300" />
                          <span className="text-gray-300 text-sm flex-1">
                            {index === 0 ? weatherData.current.weather_descriptions[0] : 'Partly Cloudy'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-white">
                          <span className="font-medium">{day.high}°</span>
                          <span className="text-gray-400">{day.low}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Hourly Chart */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Today's Temperature</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">24H Forecast</span>
                    </div>
                  </div>
                  
                  <SimpleTemperatureChart 
                    hourlyData={generateHourlyData(weatherData.current.temperature)} 
                  />
                </div>
              </div>

              {/* Right Column - Weather Details */}
              <div className="space-y-6">
                {/* UV Index */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="h-6 w-6 text-orange-400" />
                    <span className="text-lg font-medium text-white">UV Index</span>
                  </div>
                  <div className="text-4xl font-light text-white mb-2">
                    {weatherData.current.uv_index}
                  </div>
                  <div className={`text-sm ${getUVStatus(weatherData.current.uv_index).color}`}>
                    {getUVStatus(weatherData.current.uv_index).status}
                  </div>
                </div>

                {/* Sunrise/Sunset */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="h-6 w-6 text-yellow-400" />
                    <span className="text-lg font-medium text-white">Sun</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sunrise</span>
                      <span className="text-white">5:57 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Sunset</span>
                      <span className="text-white">5:36 PM</span>
                    </div>
                  </div>
                  
                  {/* Sun arc visualization */}
                  <div className="mt-4 relative h-16">
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                    <div className="absolute bottom-0 left-1/3 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Droplets className="h-6 w-6 text-blue-400" />
                    <span className="text-lg font-medium text-white">Humidity</span>
                  </div>
                  <div className="text-4xl font-light text-white mb-2">
                    {weatherData.current.humidity}%
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${weatherData.current.humidity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Wind */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wind className="h-6 w-6 text-gray-400" />
                    <span className="text-lg font-medium text-white">Wind</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-light text-white">{weatherData.current.wind_speed}</span>
                    <span className="text-gray-300">mph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 rounded-full relative">
                      <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-400 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <span className="text-gray-300 text-sm">{weatherData.current.wind_dir}</span>
                  </div>
                </div>

                {/* Air Quality */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="h-6 w-6 text-green-400" />
                    <span className="text-lg font-medium text-white">Air Quality</span>
                  </div>
                  <div className="text-4xl font-light text-white mb-2">
                    {getAirQualityStatus(weatherData.current.visibility).value}
                  </div>
                  <div className={`text-sm ${getAirQualityStatus(weatherData.current.visibility).color}`}>
                    {getAirQualityStatus(weatherData.current.visibility).status}
                  </div>
                </div>

                {/* Pressure */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge className="h-6 w-6 text-purple-400" />
                    <span className="text-lg font-medium text-white">Pressure</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-white">{weatherData.current.pressure}</span>
                    <span className="text-gray-300">hPa/mb</span>
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white">Loading Ho Chi Minh City weather...</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
