package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var loginReq struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Hardcoded users for login
	users := map[string]string{
		"admin@gmail.com":      "admin123",
		"hr@gmail.com":         "hr123",
		"employee@eloop.com":   "employee123",
		"superadmin@eloop.com": "superadmin123",
	}

	// Validate user
	password, exists := users[loginReq.Email]
	if !exists || password != loginReq.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}
