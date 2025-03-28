package controllers

import (
	"context"
	"net/http"
	"time"

	"igniteHR/config"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// LoginRequest struct
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// User struct for MongoDB
type User struct {
	Email    string `bson:"email"`
	Password string `bson:"password"`
	Role     string `bson:"role"`
}

// Login authenticates the user using MongoDB
func Login(c *gin.Context) {
	var loginReq LoginRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Connect to MongoDB and fetch user details
	collection := config.GetCollection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user User
	err := collection.FindOne(ctx, bson.M{"email": loginReq.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Compare plain-text passwords (for now, without bcrypt)
	if user.Password != loginReq.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"role":    user.Role,
	})
}
