'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, Droplets, Wind, Eye, Sun, Moon,
  Cloud, CloudRain, CloudSnow, CloudDrizzle, Zap, Gauge,
  Activity, BarChart3, TrendingUp
} from 'lucide-react'

export default function WeatherPage() {
  // Helper to get Unsplash background image based on weather description
  const getBgImage = (desc) => {
    if (!desc) return defaultImg;
    const d = desc.toLowerCase();
    if (d.includes('sunny') || d.includes('clear')) return sunImg;
    if (d.includes('rain')) return rainImg;
    if (d.includes('cloud')) return cloudImg;
    if (d.includes('snow')) return snowImg;
    if (d.includes('storm') || d.includes('thunder')) return stormImg;
    return defaultImg;
  };

  // Unsplash images for different weather
  const defaultImg = 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80)'; // núi trời xanh
  const sunImg = 'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80)'; // nắng vàng
  const rainImg = 'url(https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80)'; // mưa
  const cloudImg = 'url(https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1200&q=80)'; // nhiều mây
  const snowImg = 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80)'; // tuyết
  const stormImg = 'url(https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80)'; // giông bão
  // Helper to get background gradient based on weather description
  const getBgGradient = (desc) => {
    if (!desc) return 'from-slate-900 via-blue-900 to-slate-800';
    const d = desc.toLowerCase();
    if (d.includes('sunny') || d.includes('clear')) return 'from-yellow-200 via-yellow-400 to-orange-500';
    if (d.includes('rain')) return 'from-blue-900 via-blue-600 to-blue-400';
    if (d.includes('cloud')) return 'from-gray-700 via-gray-500 to-gray-300';
    if (d.includes('snow')) return 'from-blue-200 via-white to-blue-400';
    if (d.includes('storm') || d.includes('thunder')) return 'from-gray-800 via-purple-700 to-yellow-400';
    return 'from-slate-900 via-blue-900 to-slate-800';
  };
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
      {/* Dynamic background gradient and Unsplash image based on weather */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getBgGradient(weatherData?.current?.weather_descriptions?.[0])}`}
        style={{
          backgroundImage: getBgImage(weatherData?.current?.weather_descriptions?.[0]),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1
        }}
      />
      {/* Overlay to darken background for better text contrast */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
          {/* Header with Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Activity className="h-8 w-8 text-blue-400" />
                Lively Weather
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
                      <p className="text-gray-400">
                        Local time: {new Date(weatherData.location.localtime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
                    {weatherData.forecast?.map((day, index) => {
                      const IconComponent = day.icon === 'sun' ? Sun : 
                                          day.icon === 'rain' ? CloudRain : 
                                          day.icon === 'cloud' ? Cloud : Sun
                      
                      return (
                        <div key={day.day} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                          <div className="flex items-center gap-4 flex-1">
                            <span className={`text-sm font-medium w-12 ${index === 0 ? 'text-blue-400' : 'text-gray-300'}`}>
                              {day.day}
                            </span>
                            <IconComponent className="h-6 w-6 text-gray-300" />
                            <span className="text-gray-300 text-sm flex-1">
                              {index === 0 ? weatherData.current.weather_descriptions[0] : day.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-white">
                            <span className="font-medium">{day.high}°</span>
                            <span className="text-gray-400">{day.low}°</span>
                          </div>
                        </div>
                      )
                    })}
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
                    hourlyData={weatherData.hourly || []} 
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
                  {weatherData.air_quality ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-white text-sm">
                        <span>CO</span>
                        <span>{weatherData.air_quality.co}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>NO₂</span>
                        <span>{weatherData.air_quality.no2}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>O₃</span>
                        <span>{weatherData.air_quality.o3}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>SO₂</span>
                        <span>{weatherData.air_quality.so2}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>PM2.5</span>
                        <span>{weatherData.air_quality.pm2_5}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>PM10</span>
                        <span>{weatherData.air_quality.pm10}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>US-EPA Index</span>
                        <span>{weatherData.air_quality["us-epa-index"]}</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span>GB-DEFRA Index</span>
                        <span>{weatherData.air_quality["gb-defra-index"]}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">No air quality data</div>
                  )}
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

          {/* Debug JSON Table */}
          {weatherData && (
            <div className="mt-8">
              <details className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white" open>
                <summary className="cursor-pointer font-semibold text-blue-300 mb-2">Xem toàn bộ JSON trả về từ backend</summary>
                <pre className="overflow-x-auto text-xs text-white/90 bg-black/30 p-3 rounded-lg max-h-96">
                  {JSON.stringify(weatherData, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
