# Everglen All-in-One Platform

A unified, multi-role application ecosystem combining customer, hotel, and driver functionalities into a single consolidated platform.

## Architecture

```
everglen-all-in-one/
├── /backend           # FastAPI + Firebase Admin SDK
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── config/
│
└── /frontend          # Unified Multi-Role Mobile App
    ├── src/
    ├── screens/
    ├── views/
    │   ├── customer/
    │   ├── hotel/
    │   └── driver/
    ├── components/
    ├── services/
    ├── firebase/
    ├── config/
    ├── package.json
    ├── .env.example
    └── tsconfig.json
```

## Role-Based Routing

- **Customer**: Access to `/frontend/views/customer/dashboard`
- **Hotel**: Access to `/frontend/views/hotel/kitchen`
- **Driver**: Access to `/frontend/views/driver/logistics`

## Authentication

Firebase Phone OTP Authentication with role-based access control via Firestore `/users/{user_id}/role`

## Setup

1. Backend: `cd backend && pip install -r requirements.txt`
2. Frontend: `cd frontend && npm install`
3. Configure `.env` files in both directories

---

**Status**: Repository initialization in progress
