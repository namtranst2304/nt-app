@echo off
echo Starting Go Fiber Backend Server...
echo ==================================

REM Set environment variables
set PORT=8080
set DATABASE_URL=./database.db
set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
set CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003
set APP_ENV=development

REM Go to backend directory
cd go-backend

REM Download dependencies
echo Downloading Go dependencies...
go mod download

REM Build the application
echo Building Go application...
go build -o bin/server.exe main.go

REM Run the server
echo Starting server on port %PORT%...
bin\server.exe
