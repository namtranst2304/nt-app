package handlers

import (
	"go-backend/models"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostHandler struct {
	db *gorm.DB
}

func NewPostHandler(db *gorm.DB) *PostHandler {
	return &PostHandler{db: db}
}

func (h *PostHandler) GetPosts(c *fiber.Ctx) error {
	var posts []models.Post
	if err := h.db.Preload("Author").Find(&posts).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch posts"})
	}
	return c.JSON(posts)
}

func (h *PostHandler) CreatePost(c *fiber.Ctx) error {
	var post models.Post
	if err := c.BodyParser(&post); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Generate slug from title
	post.Slug = generateSlug(post.Title)

	if err := h.db.Create(&post).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create post"})
	}

	// Load author data
	h.db.Preload("Author").First(&post, post.ID)

	return c.Status(201).JSON(post)
}

func (h *PostHandler) GetPost(c *fiber.Ctx) error {
	id := c.Params("id")
	postID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	var post models.Post
	if err := h.db.Preload("Author").First(&post, postID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch post"})
	}

	return c.JSON(post)
}

func (h *PostHandler) UpdatePost(c *fiber.Ctx) error {
	id := c.Params("id")
	postID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	var post models.Post
	if err := h.db.First(&post, postID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch post"})
	}

	var updateData models.Post
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Update fields
	if updateData.Title != "" {
		post.Title = updateData.Title
		post.Slug = generateSlug(updateData.Title)
	}
	if updateData.Content != "" {
		post.Content = updateData.Content
	}
	if updateData.Status != "" {
		post.Status = updateData.Status
		if updateData.Status == "published" && post.PublishedAt == nil {
			now := time.Now()
			post.PublishedAt = &now
		}
	}

	if err := h.db.Save(&post).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update post"})
	}

	// Load author data
	h.db.Preload("Author").First(&post, post.ID)

	return c.JSON(post)
}

func (h *PostHandler) DeletePost(c *fiber.Ctx) error {
	id := c.Params("id")
	postID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid post ID"})
	}

	if err := h.db.Delete(&models.Post{}, postID).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete post"})
	}

	return c.JSON(fiber.Map{"message": "Post deleted successfully"})
}

func generateSlug(title string) string {
	// Convert to lowercase and replace spaces with hyphens
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters (basic implementation)
	slug = strings.ReplaceAll(slug, ".", "")
	slug = strings.ReplaceAll(slug, ",", "")
	slug = strings.ReplaceAll(slug, "!", "")
	slug = strings.ReplaceAll(slug, "?", "")
	return slug
}
