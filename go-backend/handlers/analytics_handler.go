package handlers

import (
	"go-backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type AnalyticsHandler struct {
	db *gorm.DB
}

func NewAnalyticsHandler(db *gorm.DB) *AnalyticsHandler {
	return &AnalyticsHandler{db: db}
}

func (h *AnalyticsHandler) GetAnalytics(c *fiber.Ctx) error {
	var events []models.AnalyticsEvent
	if err := h.db.Preload("User").Find(&events).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch analytics events"})
	}
	return c.JSON(events)
}

func (h *AnalyticsHandler) CreateEvent(c *fiber.Ctx) error {
	var event models.AnalyticsEvent
	if err := c.BodyParser(&event); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Set IP address and user agent from request
	event.IPAddress = c.IP()
	event.UserAgent = c.Get("User-Agent")

	if err := h.db.Create(&event).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create analytics event"})
	}

	return c.Status(201).JSON(event)
}

func (h *AnalyticsHandler) GetDashboard(c *fiber.Ctx) error {
	// Get analytics dashboard data
	var totalEvents int64
	h.db.Model(&models.AnalyticsEvent{}).Count(&totalEvents)

	var totalUsers int64
	h.db.Model(&models.User{}).Count(&totalUsers)

	var totalPosts int64
	h.db.Model(&models.Post{}).Count(&totalPosts)

	var totalProducts int64
	h.db.Model(&models.Product{}).Count(&totalProducts)

	// Get events from last 30 days
	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)
	var recentEvents []models.AnalyticsEvent
	h.db.Where("created_at >= ?", thirtyDaysAgo).Find(&recentEvents)

	// Get top event types
	var eventTypes []struct {
		EventType string
		Count     int64
	}
	h.db.Model(&models.AnalyticsEvent{}).
		Select("event_type, count(*) as count").
		Group("event_type").
		Order("count DESC").
		Limit(10).
		Scan(&eventTypes)

	dashboardData := fiber.Map{
		"totals": fiber.Map{
			"events":   totalEvents,
			"users":    totalUsers,
			"posts":    totalPosts,
			"products": totalProducts,
		},
		"recent_events": recentEvents,
		"top_events":    eventTypes,
	}

	return c.JSON(dashboardData)
}
