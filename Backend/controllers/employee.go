package controllers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"igniteHR/config"
	"igniteHR/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Employee struct (Updated JSON fields to match frontend)
type Employee struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	EmpID      string             `json:"emp_id" bson:"emp_id"`
	FirstName  string             `json:"firstName" bson:"first_name"`
	LastName   string             `json:"lastName" bson:"last_name"`
	Email      string             `json:"email" bson:"email"`
	Phone      string             `json:"phone" bson:"phone"`
	Salary     float64            `json:"salary" bson:"salary"`
	Role       string             `json:"role" bson:"role"`
	Department string             `json:"department" bson:"department"`
	Status     string             `json:"status" bson:"status"`
	StartDate  time.Time          `json:"startDate" bson:"start_date"`
	Password   string             `json:"password,omitempty" bson:"password"` // Omit from response
}

// Generate a unique Employee ID
func generateEmpID() string {
	currentYear := time.Now().Year()
	randomNum := randInt(1000, 9999)
	return fmt.Sprintf("EMP%d%04d", currentYear, randomNum)
}

// Generate a secure random password
func generatePassword() (string, error) {
	bytes := make([]byte, 12)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(bytes), nil
}

// Add Employee API
func AddEmployee(c *gin.Context) {
	var newEmployee Employee

	// Bind JSON input
	if err := c.ShouldBindJSON(&newEmployee); err != nil {
		fmt.Printf("JSON binding error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Ensure MongoDB generates a new ID
	newEmployee.ID = primitive.NilObjectID

	// Validate required fields
	if newEmployee.FirstName == "" || newEmployee.LastName == "" ||
		newEmployee.Email == "" || newEmployee.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Generate Employee ID & Password (Only for new employees)
	if newEmployee.EmpID == "" {
		newEmployee.EmpID = generateEmpID()
		password, err := generatePassword()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generating password"})
			return
		}
		newEmployee.Password = password
	}

	// Ensure the start date is valid
	if newEmployee.StartDate.IsZero() {
		newEmployee.StartDate = time.Now()
	}

	// Insert into MongoDB
	collection := config.GetCollection("employees")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, newEmployee)
	if err != nil {
		fmt.Printf("MongoDB error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add employee: " + err.Error()})
		return
	}

	// **🔹 Send Welcome Email to Employee 🔹**
	subject := "Welcome to Our Company!"
	body := fmt.Sprintf(
		"Hi %s,\n\nWelcome to our company! Your Employee ID is %s, and your temporary password is %s.\nPlease change your password after login.\n\nBest Regards,\nHR Team",
		newEmployee.FirstName+" "+newEmployee.LastName, newEmployee.EmpID, newEmployee.Password,
	)

	err = utils.SendEmail(newEmployee.Email, subject, body)
	if err != nil {
		fmt.Printf("Failed to send welcome email: %v\n", err)
	}

	// Return Employee ID and password
	c.JSON(http.StatusOK, gin.H{
		"message":  "Employee added successfully",
		"emp_id":   newEmployee.EmpID,
		"password": newEmployee.Password,
	})
}

// Get Employees API (Fetch all employees)
func GetEmployees(c *gin.Context) {
	collection := config.GetCollection("employees")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var employees []Employee
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch employees"})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &employees); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding employees"})
		return
	}

	c.JSON(http.StatusOK, employees)
}

// Delete Employee API
func DeleteEmployee(c *gin.Context) {
	empID := c.Param("id") // Get employee ID from URL
	fmt.Printf("Deleting employee with ID: %s\n", empID)

	collection := config.GetCollection("employees")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"emp_id": empID})
	if err != nil {
		fmt.Printf("Error deleting employee: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

// Improved utility function for generating random numbers
func randInt(min, max int) int {
	// Use 4 bytes for better randomness
	b := make([]byte, 4)
	rand.Read(b)

	// Convert bytes to uint32 for larger range
	num := int(b[0]) | (int(b[1]) << 8) | (int(b[2]) << 16) | (int(b[3]) << 24)

	// Ensure positive number
	if num < 0 {
		num = -num
	}

	return min + (num % (max - min + 1))
}
