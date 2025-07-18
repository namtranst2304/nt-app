# NTSync - Video Streaming Dashboard with Go Fiber Backend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js-based video streaming dashboard called NTSync built with:
- Next.js 14 + App Router
- Tailwind CSS 3.x for styling with glassmorphism design
- Framer Motion for animations
- Zustand for state management
- Lucide React for icons
- Recharts for data visualization
- Go Fiber backend for API services

## Project Structure
- Frontend: Next.js with App Router in /src/app
- Backend: Go Fiber server in /go-backend
- Components use modern React patterns with hooks
- Glassmorphism design with backdrop blur effects
- Responsive grid layouts
- State management via Zustand store
- API Testing functionality with 5 dedicated pages

## Design Guidelines
- Use glassmorphism styling with `glass-card`, `glass-sidebar`, `glass-nav` classes
- Implement smooth animations with Framer Motion
- Follow the dark theme with purple/blue gradients
- Use Lucide React icons consistently
- Maintain responsive design patterns

## Key Features
- Video streaming from multiple sources
- Playlist management
- Watch history and statistics
- Modern dashboard UI
- API Testing Suite with 5 individual pages
- Go Fiber backend with SQLite database

## Commands to Run
- Frontend: cd "d:\Learning\NextJS + Go Fiber\nt-app"; npm run dev
- Backend: cd "d:\Learning\NextJS + Go Fiber\nt-app\go-backend"; go run main.go
- Or use batch script: cd "d:\Learning\NextJS + Go Fiber\nt-app"; .\start-go-server.bat
- Initialize Go module: cd "d:\Learning\NextJS + Go Fiber\nt-app\go-backend"; go mod init go-backend
- Download Go dependencies: cd "d:\Learning\NextJS + Go Fiber\nt-app\go-backend"; go mod tidy

## API Structure
- API 1: User Management (/api/v1/users, /api/v1/auth)
- API 2: Content Management (/api/v1/posts)
- API 3: Analytics (/api/v1/analytics)
- API 4: E-commerce (/api/v1/products, /api/v1/orders)
- API 5: Communication (/api/v1/comments)

## Testing and Debugging
- Frontend runs on localhost:3003
- Backend runs on localhost:8080
- Always check both services are running for API testing
- Use the API Testing pages at /api/api1 through /api/api5