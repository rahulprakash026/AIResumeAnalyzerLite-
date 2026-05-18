git add README.md
# AI Resume Analyzer Lite

A production-ready full-stack AI Resume Analyzer platform using Django, Flask, PostgreSQL, Redis, Celery, Docker, and Nginx.

## Architecture

1. **Django App**: Handles user authentication, file uploads, saving results, and serving the REST API.
2. **Flask AI Service**: Receives resume text/PDF, extracts keywords, and generates ATS scores (mocked or via OpenAI).
3. **PostgreSQL**: Stores users, resumes, job descriptions, and analysis results.
4. **Redis & Celery**: Handles asynchronous background tasks (like calling the AI service without blocking the user).
5. **Nginx**: Reverse proxy to route traffic between Django (`/api`) and Flask (`/ai`).

## Running the Application

### Prerequisites
- Docker and Docker Compose installed.

### Setup
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in the values (especially `OPENAI_API_KEY`).
   ```bash
   cp .env.example .env
   ```
3. Build and start the services:
   ```bash
   docker-compose up --build
   ```

### API Endpoints
- **Django Main API**: `http://localhost:8000/api/`
- **Swagger Docs**: `http://localhost:8000/api/schema/swagger-ui/`
- **Flask AI Service**: `http://localhost:5000/`

## Deployment
This project is containerized using Docker and is ready to be deployed on any server (e.g., AWS EC2, DigitalOcean) using `docker-compose`. Ensure `.env` is securely provided on the host.

## CI/CD
GitHub Actions is configured in `.github/workflows/ci.yml` to automatically lint code, run tests, and build Docker images on push to the `main` branch.
=======
# AIResumeAnalyzerLite-
>>>>>>> 2b977fd013a8ca1c134fc8550a4fe1d7870ea0ff
