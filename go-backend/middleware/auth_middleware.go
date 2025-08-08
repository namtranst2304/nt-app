package middleware

import (
	"go-backend/utils"

	"github.com/gofiber/fiber/v2"
)

// AuthRequired middleware: kiểm tra JWT từ HttpOnly cookie
func AuthRequired(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	if cookie == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing auth token"})
	}
	userId, err := utils.ValidateToken(cookie)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token"})
	}
	// Lưu userId vào context để các handler sau dùng
	c.Locals("userId", userId)
	return c.Next()
}
