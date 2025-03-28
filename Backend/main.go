package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"igniteHR/config"
	"igniteHR/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file")
	}

	// Get port from environment variables
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to port 8080 if not set
	}

	// Get server address from environment variables
	serverAddress := os.Getenv("SERVER_ADDRESS")
	if serverAddress == "" {
		serverAddress = "0.0.0.0" // Default to all network interfaces
	}

	// Initialize MongoDB connection
	fmt.Println("🔄 Initializing MongoDB connection...")
	if err := config.ConnectDB(); err != nil {
		log.Fatal("❌ Failed to connect to MongoDB:", err)
	}

	// Create a new Gin router
	router := gin.Default()

	// Apply CORS Middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins (can be restricted)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup routes
	routes.SetupRoutes(router)

	// Start the server
	fmt.Printf("🚀 Server is running on %s:%s\n", serverAddress, port)
	err = router.Run(serverAddress + ":" + port)
	if err != nil {
		log.Fatal("❌ Error starting server:", err)
	}
}
