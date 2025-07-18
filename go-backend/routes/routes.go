package routes

import (
	"go-backend/handlers"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetupRoutes(app *fiber.App, db *gorm.DB) {
	// Initialize handlers
	userHandler := handlers.NewUserHandler(db)
	postHandler := handlers.NewPostHandler(db)
	analyticsHandler := handlers.NewAnalyticsHandler(db)
	productHandler := handlers.NewProductHandler(db)
	orderHandler := handlers.NewOrderHandler(db)
	commentHandler := handlers.NewCommentHandler(db)
	weatherHandler := handlers.NewWeatherHandler()

	// API v1 routes
	api := app.Group("/api/v1")

	// User Management (API 1)
	users := api.Group("/users")
	users.Get("/", userHandler.GetUsers)
	users.Post("/", userHandler.CreateUser)
	users.Get("/:id", userHandler.GetUser)
	users.Put("/:id", userHandler.UpdateUser)
	users.Delete("/:id", userHandler.DeleteUser)

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/login", userHandler.Login)
	auth.Post("/register", userHandler.Register)

	// Content Management (API 2)
	posts := api.Group("/posts")
	posts.Get("/", postHandler.GetPosts)
	posts.Post("/", postHandler.CreatePost)
	posts.Get("/:id", postHandler.GetPost)
	posts.Put("/:id", postHandler.UpdatePost)
	posts.Delete("/:id", postHandler.DeletePost)

	// Analytics (API 3)
	analytics := api.Group("/analytics")
	analytics.Get("/", analyticsHandler.GetAnalytics)
	analytics.Post("/events", analyticsHandler.CreateEvent)
	analytics.Get("/dashboard", analyticsHandler.GetDashboard)

	// E-commerce (API 4)
	products := api.Group("/products")
	products.Get("/", productHandler.GetProducts)
	products.Post("/", productHandler.CreateProduct)
	products.Get("/:id", productHandler.GetProduct)
	products.Put("/:id", productHandler.UpdateProduct)
	products.Delete("/:id", productHandler.DeleteProduct)

	orders := api.Group("/orders")
	orders.Get("/", orderHandler.GetOrders)
	orders.Post("/", orderHandler.CreateOrder)
	orders.Get("/:id", orderHandler.GetOrder)
	orders.Put("/:id", orderHandler.UpdateOrder)
	orders.Delete("/:id", orderHandler.DeleteOrder)

	// Communication (API 5)
	comments := api.Group("/comments")
	comments.Get("/", commentHandler.GetComments)
	comments.Post("/", commentHandler.CreateComment)
	comments.Get("/:id", commentHandler.GetComment)
	comments.Put("/:id", commentHandler.UpdateComment)
	comments.Delete("/:id", commentHandler.DeleteComment)

	// Weather (API 6)
	weather := api.Group("/weather")
	weather.Get("/", weatherHandler.GetWeather)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Server is running",
		})
	})
}
