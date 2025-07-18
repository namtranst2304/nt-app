package handlers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

// WeatherHandler handles weather-related requests
type WeatherHandler struct{}

// NewWeatherHandler creates a new WeatherHandler instance
func NewWeatherHandler() *WeatherHandler {
	return &WeatherHandler{}
}

// WeatherResponse represents the complete weather API response
type WeatherResponse struct {
	Location LocationData  `json:"location"`
	Current  CurrentData   `json:"current"`
	Forecast []ForecastDay `json:"forecast"`
	Hourly   []HourlyData  `json:"hourly"`
	Error    *ErrorData    `json:"error,omitempty"`
}

// ErrorData represents API error information
type ErrorData struct {
	Code int    `json:"code"`
	Type string `json:"type"`
	Info string `json:"info"`
}

// LocationData represents location information
type LocationData struct {
	Name           string `json:"name"`
	Country        string `json:"country"`
	Region         string `json:"region"`
	Lat            string `json:"lat"`
	Lon            string `json:"lon"`
	TimezoneID     string `json:"timezone_id"`
	LocalTime      string `json:"localtime"`
	LocalTimeEpoch int    `json:"localtime_epoch"`
	UtcOffset      string `json:"utc_offset"`
}

// CurrentData represents current weather conditions
type CurrentData struct {
	ObservationTime string   `json:"observation_time"`
	Temperature     int      `json:"temperature"`
	WeatherCode     int      `json:"weather_code"`
	WeatherIcons    []string `json:"weather_icons"`
	WeatherDesc     []string `json:"weather_descriptions"`
	WindSpeed       int      `json:"wind_speed"`
	WindDegree      int      `json:"wind_degree"`
	WindDir         string   `json:"wind_dir"`
	Pressure        int      `json:"pressure"`
	Precip          float64  `json:"precip"`
	Humidity        int      `json:"humidity"`
	Cloudcover      int      `json:"cloudcover"`
	FeelsLike       int      `json:"feelslike"`
	UVIndex         int      `json:"uv_index"`
	Visibility      float64  `json:"visibility"`
	IsDay           string   `json:"is_day"`
}

// ForecastDay represents a single day forecast
type ForecastDay struct {
	Day  string `json:"day"`
	Icon string `json:"icon"`
	High int    `json:"high"`
	Low  int    `json:"low"`
	Desc string `json:"description"`
}

// HourlyData represents hourly weather data
type HourlyData struct {
	Hour string `json:"hour"`
	Temp int    `json:"temp"`
	Icon string `json:"icon"`
}

// GetWeather fetches weather data for a given location
func (h *WeatherHandler) GetWeather(c *fiber.Ctx) error {
	// Seed random number generator
	rand.Seed(time.Now().UnixNano())

	query := c.Query("location")
	if query == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Location parameter is required",
		})
	}

	// Get API key from environment variable
	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		return c.Status(500).JSON(fiber.Map{
			"error": "Weather API key not configured",
		})
	}

	// Build WeatherStack API URL
	apiURL := fmt.Sprintf("http://api.weatherstack.com/current?access_key=%s&query=%s",
		apiKey, url.QueryEscape(query))

	// Make HTTP request to WeatherStack API
	resp, err := http.Get(apiURL)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch weather data from external service",
		})
	}
	defer resp.Body.Close()

	// Check HTTP status
	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{
			"error": fmt.Sprintf("External API returned status: %d", resp.StatusCode),
		})
	}

	// Parse response
	var weatherData WeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherData); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to parse weather data",
		})
	}

	// Check if API returned an error
	if weatherData.Error != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": weatherData.Error.Info,
		})
	}

	// Generate forecast and hourly data based on current temperature
	weatherData.Forecast = h.generateForecast(weatherData.Current.Temperature)
	weatherData.Hourly = h.generateHourlyData(weatherData.Current.Temperature)

	// Return successful response with all data
	return c.JSON(weatherData)
}

// generateForecast creates 7-day forecast data based on current temperature
func (h *WeatherHandler) generateForecast(currentTemp int) []ForecastDay {
	days := []string{"Today", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"}
	icons := []string{"sun", "rain", "cloud", "sun", "rain", "sun", "cloud"}
	descriptions := []string{"Partly Cloudy", "Light Rain", "Cloudy", "Sunny", "Rain Showers", "Clear", "Overcast"}

	forecast := make([]ForecastDay, 7)
	for i, day := range days {
		forecast[i] = ForecastDay{
			Day:  day,
			Icon: icons[i],
			High: currentTemp + rand.Intn(6) - 3,
			Low:  currentTemp - rand.Intn(8) - 2,
			Desc: descriptions[i],
		}
	}
	return forecast
}

// generateHourlyData creates hourly temperature data for today
func (h *WeatherHandler) generateHourlyData(currentTemp int) []HourlyData {
	hours := []int{0, 3, 6, 9, 12, 15, 18, 21}
	hourlyData := make([]HourlyData, len(hours))

	for i, hour := range hours {
		displayHour := fmt.Sprintf("%02d:00", hour)

		// Create natural temperature variation throughout the day
		var temp int
		if hour >= 6 && hour <= 12 {
			// Morning warming up
			temp = currentTemp + (hour-6)*2 + rand.Intn(3) - 1
		} else if hour >= 12 && hour <= 18 {
			// Afternoon peak
			temp = currentTemp + 8 + rand.Intn(4) - 2
		} else if hour >= 18 && hour <= 21 {
			// Evening cooling down
			temp = currentTemp + 6 - (hour-18)*2 + rand.Intn(3) - 1
		} else {
			// Night/early morning - cooler
			temp = currentTemp - 5 + rand.Intn(4) - 2
		}

		var icon string
		if hour >= 6 && hour <= 18 {
			icon = "sun"
		} else if hour >= 18 && hour <= 21 {
			icon = "cloud"
		} else {
			icon = "moon"
		}

		hourlyData[i] = HourlyData{
			Hour: displayHour,
			Temp: temp,
			Icon: icon,
		}
	}

	return hourlyData
}
