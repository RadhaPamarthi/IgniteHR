package routes

import (
	"igniteHR/controllers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes defines all API endpoints
func SetupRoutes(router *gin.Engine) {
	// Handle CORS preflight
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	// Login route (without `/auth`)
	router.POST("/login", controllers.Login)
	//router.POST("/employees", controllers.AddEmployee) // ✅ New API for adding employees
	// ✅ Ensure Employees Route Exists
	router.GET("/employees", controllers.GetEmployees)          // Fetch all employees
	router.POST("/employees", controllers.AddEmployee)          // Add a new employee
	router.DELETE("/employees/:id", controllers.DeleteEmployee) // Delete an employee

}
