package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

// ConnectDB initializes MongoDB connection and returns an error if it fails
func ConnectDB() error {
	// Load environment variables
	_ = godotenv.Load()

	// Get MongoDB URI from .env
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("❌ MONGO_URI not set in .env file")
	}

	// Set up MongoDB client
	clientOptions := options.Client().ApplyURI(mongoURI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return fmt.Errorf("❌ MongoDB Connection Error: %v", err)
	}

	// Ping MongoDB to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return fmt.Errorf("❌ Could not connect to MongoDB: %v", err)
	}

	fmt.Println("✅ Successfully connected to MongoDB!")

	// Set the database
	DB = client.Database("igniteHR") // Ensure this matches your MongoDB database name
	return nil
}

// GetCollection returns a reference to a MongoDB collection
func GetCollection(name string) *mongo.Collection {
	if DB == nil {
		log.Fatal("❌ Database connection is not initialized")
	}
	return DB.Collection(name)
}
