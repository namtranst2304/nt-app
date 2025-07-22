package handlers

import (
	"errors"
	"fmt"
	"go-backend/models"
	"go-backend/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserHandler struct {
	db *gorm.DB
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	return &UserHandler{db: db}
}

// =========================
// 🔐 Register
// =========================
func (h *UserHandler) Register(c *fiber.Ctx) error {
	var userData models.User
	if err := c.BodyParser(&userData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	// Log giá trị password nhận được từ frontend
	fmt.Printf("[DEBUG] Register received password: '%s'\n", userData.Password)
	// Kiểm tra username và password không được rỗng
	if userData.Username == "" || userData.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username and password are required"})
	}

	// Kiểm tra trùng email hoặc username
	var existing models.User
	if err := h.db.Where("email = ? OR username = ?", userData.Email, userData.Username).First(&existing).Error; err == nil {
		return c.Status(409).JSON(fiber.Map{"error": "User already exists"})
	}

	// Hash password
	hashed, err := utils.HashPassword(userData.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	userData.Password = hashed

	if err := h.db.Create(&userData).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}

	token, err := utils.GenerateToken(userData.ID.String())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.Status(201).JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":       userData.ID,
			"username": userData.Username,
			"email":    userData.Email,
		},
	})
}

// =========================
// 🔑 Login
// =========================
func (h *UserHandler) Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var input LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	var user models.User
	// Allow login by username or email
	if err := h.db.Where("username = ? OR email = ?", input.Username, input.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	if !utils.CheckPassword(input.Password, user.Password) {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	token, err := utils.GenerateToken(user.ID.String())
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

// =========================
// ❌ Logout (chỉ trả về OK)
// =========================
func (h *UserHandler) Logout(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "Logged out successfully"})
}

// =========================
// 🧾 Lấy danh sách User
// =========================
func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	var users []models.User
	if err := h.db.Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch users"})
	}

	// Trả về danh sách users nhưng loại bỏ password
	var safeUsers []fiber.Map
	for _, u := range users {
		safeUsers = append(safeUsers, fiber.Map{
			"id":        u.ID,
			"username":  u.Username,
			"email":     u.Email,
			"firstName": u.FirstName,
			"lastName":  u.LastName,
			"avatar":    u.Avatar,
		})
	}

	return c.JSON(safeUsers)
}

// =========================
// ➕ Tạo user mới (Admin)
// =========================
func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	var userData models.User
	if err := c.BodyParser(&userData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Kiểm tra trùng email hoặc username
	var existing models.User
	if err := h.db.Where("email = ? OR username = ?", userData.Email, userData.Username).First(&existing).Error; err == nil {
		return c.Status(409).JSON(fiber.Map{"error": "User already exists"})
	}

	hashed, err := utils.HashPassword(userData.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}
	userData.Password = hashed

	if err := h.db.Create(&userData).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create user"})
	}

	return c.Status(201).JSON(fiber.Map{
		"user": fiber.Map{
			"id":       userData.ID,
			"username": userData.Username,
			"email":    userData.Email,
		},
	})
}

// =========================
// 🔍 Lấy thông tin user theo ID
// =========================
func (h *UserHandler) GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(fiber.Map{
		"id":        user.ID,
		"username":  user.Username,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"avatar":    user.Avatar,
	})
}

// =========================
// ✏️ Cập nhật thông tin user
// =========================
func (h *UserHandler) UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var user models.User
	if err := h.db.First(&user, "id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	var updateData models.User
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if updateData.Password != "" {
		hashed, err := utils.HashPassword(updateData.Password)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
		}
		user.Password = hashed
	}

	user.Username = updateData.Username
	user.Email = updateData.Email
	user.FirstName = updateData.FirstName
	user.LastName = updateData.LastName
	user.Avatar = updateData.Avatar

	if err := h.db.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.JSON(fiber.Map{
		"id":        user.ID,
		"username":  user.Username,
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"avatar":    user.Avatar,
	})
}

// =========================
// 🗑️ Xoá user theo ID
// =========================
func (h *UserHandler) DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	userID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	if err := h.db.Delete(&models.User{}, userID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	return c.JSON(fiber.Map{"message": "User deleted successfully"})
}
