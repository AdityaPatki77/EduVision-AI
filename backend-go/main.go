package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Request structure
type VideoRequest struct {
	URL string `json:"url"`
}

func main() {
	r := gin.Default()

	// ✅ Allow all origins for development (you can restrict later)
	r.Use(cors.Default())

	// Test route (optional)
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "Go Backend running 🚀",
		})
	})

	// Main route to forward video processing request to Python backend
	r.POST("/videos", func(c *gin.Context) {
		var req VideoRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Forward request to Python backend
		jsonData, _ := json.Marshal(req)
		resp, err := http.Post("http://localhost:8000/process_video", "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reach Python backend"})
			return
		}
		defer resp.Body.Close()

		// Read and forward response from Python backend
		body, _ := io.ReadAll(resp.Body)
		c.Data(resp.StatusCode, "application/json", body)
	})

	// Start server on localhost:8080
	r.Run(":8080")
}
