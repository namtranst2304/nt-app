package handlers

import (
	"go-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderHandler struct {
	db *gorm.DB
}

func NewOrderHandler(db *gorm.DB) *OrderHandler {
	return &OrderHandler{db: db}
}

func (h *OrderHandler) GetOrders(c *fiber.Ctx) error {
	var orders []models.Order
	if err := h.db.Preload("User").Preload("Items").Preload("Items.Product").Find(&orders).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch orders"})
	}
	return c.JSON(orders)
}

func (h *OrderHandler) CreateOrder(c *fiber.Ctx) error {
	var order models.Order
	if err := c.BodyParser(&order); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.db.Create(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create order"})
	}

	// Load related data
	h.db.Preload("User").Preload("Items").Preload("Items.Product").First(&order, order.ID)

	return c.Status(201).JSON(order)
}

func (h *OrderHandler) GetOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	orderID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	var order models.Order
	if err := h.db.Preload("User").Preload("Items").Preload("Items.Product").First(&order, orderID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch order"})
	}

	return c.JSON(order)
}

func (h *OrderHandler) UpdateOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	orderID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	var order models.Order
	if err := h.db.First(&order, orderID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch order"})
	}

	var updateData models.Order
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Update fields
	if updateData.Status != "" {
		order.Status = updateData.Status
	}
	if updateData.TotalAmount > 0 {
		order.TotalAmount = updateData.TotalAmount
	}

	if err := h.db.Save(&order).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update order"})
	}

	// Load related data
	h.db.Preload("User").Preload("Items").Preload("Items.Product").First(&order, order.ID)

	return c.JSON(order)
}

func (h *OrderHandler) DeleteOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	orderID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid order ID"})
	}

	if err := h.db.Delete(&models.Order{}, orderID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete order"})
	}

	return c.JSON(fiber.Map{"message": "Order deleted successfully"})
}
