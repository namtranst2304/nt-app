package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

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
	Location LocationData              `json:"location"`
	Current  CurrentData               `json:"current"`
	Forecast map[string]ForecastDayRaw `json:"forecast"`
	Error    *ErrorData                `json:"error,omitempty"`
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

// ForecastDayRaw dùng để parse dữ liệu thô từ Weatherstack
type ForecastDayRaw struct {
	Date    string `json:"date"`
	Maxtemp int    `json:"maxtemp"`
	Mintemp int    `json:"mintemp"`
	Avgtemp int    `json:"avgtemp"`
	UvIndex int    `json:"uv_index"`
	// Có thể bổ sung các trường khác nếu frontend cần
}

// HourlyData represents hourly weather data
type HourlyData struct {
	Hour string `json:"hour"`
	Temp int    `json:"temp"`
	Icon string `json:"icon"`
}

// GetWeather fetches weather data for a given location (dùng forecast endpoint)
func (h *WeatherHandler) GetWeather(c *fiber.Ctx) error {
	query := c.Query("location")
	if query == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Location parameter is required",
		})
	}

	apiKey := os.Getenv("WEATHER_API_KEY")
	if apiKey == "" {
		return c.Status(500).JSON(fiber.Map{
			"error": "Weather API key not configured",
		})
	}

	apiURL := fmt.Sprintf("http://api.weatherstack.com/forecast?access_key=%s&query=%s&forecast_days=7",
		apiKey, url.QueryEscape(query))

	resp, err := http.Get(apiURL)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch weather data from external service",
		})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{
			"error": fmt.Sprintf("External API returned status: %d", resp.StatusCode),
		})
	}

	var raw map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to parse weather data",
		})
	}

	// Check for error field in raw response
	if errObj, ok := raw["error"].(map[string]interface{}); ok {
		if info, ok := errObj["info"].(string); ok {
			return c.Status(400).JSON(fiber.Map{"error": info})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Weather API error"})
	}

	// Lấy ngày hôm nay theo localtime (không cần dùng nữa)

	// Trả về toàn bộ các trường, không xử lý gì thêm
	return c.JSON(raw)
}
