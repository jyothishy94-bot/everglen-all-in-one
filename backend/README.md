# Everglen All-in-One Backend Setup

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials
3. Add JWT secret and other required variables

## Running the Backend

```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Architecture

- **Framework**: FastAPI
- **Authentication**: Firebase + JWT
- **Database**: Firestore (configured in models)
- **Authorization**: Role-based middleware

## Key Endpoints

### Public
- `GET /` - Health check
- `GET /health` - Service status

### Protected (Require Authentication)
- `GET /api/customer/dashboard` - Customer data
- `GET /api/hotel/kitchen` - Hotel kitchen orders
- `GET /api/driver/logistics` - Driver deliveries

## Middleware

The `RoleBasedAuthMiddleware` validates Firebase tokens on all protected endpoints.

## Database Schema

See `backend/models/schemas.py` for complete Firestore collection structure.