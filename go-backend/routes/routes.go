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
	// commentHandler := handlers.NewCommentHandler(db) // Replaced with music API
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

	// Communication (API 5) - Replaced with Music API
	musicHandler := handlers.NewMusicHandler()

	// Music API endpoints following Spotify Web API structure
	music := api.Group("/music")

	// Artists
	artists := music.Group("/artists")
	artists.Get("/", musicHandler.GetArtists)   // GET /api/v1/music/artists?ids=1,2,3
	artists.Get("/:id", musicHandler.GetArtist) // GET /api/v1/music/artists/{id}

	// Albums
	albums := music.Group("/albums")
	albums.Get("/", musicHandler.GetAlbums)   // GET /api/v1/music/albums?ids=1,2,3
	albums.Get("/:id", musicHandler.GetAlbum) // GET /api/v1/music/albums/{id}

	// Tracks
	tracks := music.Group("/tracks")
	tracks.Get("/", musicHandler.GetTracks)   // GET /api/v1/music/tracks?ids=1,2,3
	tracks.Get("/:id", musicHandler.GetTrack) // GET /api/v1/music/tracks/{id}

	// Search
	search := music.Group("/search")
	search.Get("/", musicHandler.SearchMusic) // GET /api/v1/music/search?q=query&type=track,artist,album

	// Weather (API 6)
	weather := api.Group("/weather")
	weather.Get("/", weatherHandler.GetWeather)

	// CVE Vulnerability Management (API 5 - New Implementation)
	cve := api.Group("/cve")
	cve.Get("/", handlers.GetAllCVEs)         // GET /api/v1/cve
	cve.Get("/mock", handlers.GetCVEMockData) // GET /api/v1/cve/mock
	cve.Get("/stats", handlers.GetCVEStats)   // GET /api/v1/cve/stats
	cve.Post("/", handlers.CreateCVE)         // POST /api/v1/cve
	cve.Get("/:id", handlers.GetCVEByID)      // GET /api/v1/cve/{id}
	cve.Put("/:id", handlers.UpdateCVE)       // PUT /api/v1/cve/{id}
	cve.Delete("/:id", handlers.DeleteCVE)    // DELETE /api/v1/cve/{id}

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Server is running",
		})
	})
}
