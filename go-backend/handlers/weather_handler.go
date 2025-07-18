package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/gofiber/fiber/v2"
)

type WeatherHandler struct{}

type WeatherResponse struct {
	Location LocationData `json:"location"`
	Current  CurrentData  `json:"current"`
	Error    *ErrorData   `json:"error,omitempty"`
}

type ErrorData struct {
	Code int    `json:"code"`
	Type string `json:"type"`
	Info string `json:"info"`
}

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

// GetWeather fetches weather data for a given location
func (h *WeatherHandler) GetWeather(c *fiber.Ctx) error {
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

	// Return successful response
	return c.JSON(weatherData)
}
