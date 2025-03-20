package routes

import (
	"igniteHR/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Handle OPTIONS requests for CORS
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204) // No Content response for preflight requests
	})

	// Login route (public)
	router.POST("/login", controllers.Login)
}
