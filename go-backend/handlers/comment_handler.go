package handlers

import (
	"go-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CommentHandler struct {
	db *gorm.DB
}

func NewCommentHandler(db *gorm.DB) *CommentHandler {
	return &CommentHandler{db: db}
}

func (h *CommentHandler) GetComments(c *fiber.Ctx) error {
	var comments []models.Comment
	if err := h.db.Preload("Author").Preload("Post").Find(&comments).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch comments"})
	}
	return c.JSON(comments)
}

func (h *CommentHandler) CreateComment(c *fiber.Ctx) error {
	var comment models.Comment
	if err := c.BodyParser(&comment); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.db.Create(&comment).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create comment"})
	}

	// Load related data
	h.db.Preload("Author").Preload("Post").First(&comment, comment.ID)

	return c.Status(201).JSON(comment)
}

func (h *CommentHandler) GetComment(c *fiber.Ctx) error {
	id := c.Params("id")
	commentID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid comment ID"})
	}

	var comment models.Comment
	if err := h.db.Preload("Author").Preload("Post").First(&comment, commentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Comment not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch comment"})
	}

	return c.JSON(comment)
}

func (h *CommentHandler) UpdateComment(c *fiber.Ctx) error {
	id := c.Params("id")
	commentID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid comment ID"})
	}

	var comment models.Comment
	if err := h.db.First(&comment, commentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Comment not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch comment"})
	}

	var updateData models.Comment
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if updateData.Content != "" {
		comment.Content = updateData.Content
	}
	comment.IsApproved = updateData.IsApproved

	if err := h.db.Save(&comment).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update comment"})
	}

	// Load related data
	h.db.Preload("Author").Preload("Post").First(&comment, comment.ID)

	return c.JSON(comment)
}

func (h *CommentHandler) DeleteComment(c *fiber.Ctx) error {
	id := c.Params("id")
	commentID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid comment ID"})
	}

	if err := h.db.Delete(&models.Comment{}, commentID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete comment"})
	}

	return c.JSON(fiber.Map{"message": "Comment deleted successfully"})
}
