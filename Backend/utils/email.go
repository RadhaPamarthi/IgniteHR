package utils

import (
	"fmt"
	"net/smtp"
	"os"

	"github.com/joho/godotenv"
)

// Load environment variables
func init() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}
}

// SendEmail sends an email using SMTP
func SendEmail(to, subject, body string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USERNAME")
	smtpPass := os.Getenv("SMTP_PASSWORD")

	// Sender details
	from := smtpUser
	toEmail := []string{to}

	// Message format
	message := []byte("Subject: " + subject + "\r\n\r\n" + body)

	// Authentication
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)

	// Send the email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, toEmail, message)
	if err != nil {
		fmt.Println("Error sending email:", err)
		return err
	}

	fmt.Println("Email sent successfully to", to)
	return nil
}
