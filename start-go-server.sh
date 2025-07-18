#!/bin/bash

echo "Starting Go Fiber Backend Server..."
echo "=================================="

# Set environment variables
export PORT=8080
export DATABASE_URL=./database.db
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
export CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
export APP_ENV=development

# Go to backend directory
cd go-backend

# Download dependencies
echo "Downloading Go dependencies..."
go mod download

# Build the application
echo "Building Go application..."
go build -o bin/server main.go

# Run the server
echo "Starting server on port $PORT..."
./bin/server
