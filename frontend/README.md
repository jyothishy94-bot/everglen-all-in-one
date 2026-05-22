# Everglen All-in-One Frontend Setup

## Installation

```bash
cd frontend
npm install
```

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your Firebase project credentials
3. Update API endpoint if needed

## Running the Frontend

```bash
npm start
```

For specific platforms:
- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

## Project Structure

```
src/
├── App.tsx                    # Main app with role-based navigation
├── screens/
│   └── LoginScreen.tsx        # Firebase Phone OTP login
├── views/
│   ├── customer/
│   │   └── dashboard.tsx      # Customer order dashboard
│   ├── hotel/
│   │   └── kitchen.tsx        # Hotel kitchen management
│   └── driver/
│       └── logistics.tsx      # Driver delivery tracking
├── services/                  # API & Firebase services
├── components/                # Reusable components
└── config/                    # App configuration
```

## Authentication Flow

1. User enters phone number
2. Firebase sends OTP
3. User verifies OTP
4. App fetches user role from Firestore (`/users/{user_id}/role`)
5. App navigates to role-specific dashboard

## Role-Based Navigation

- **Customer** → Dashboard to view and place orders
- **Hotel** → Kitchen view to manage orders
- **Driver** → Logistics view to track deliveries

## Technologies

- React Native / React
- Firebase Authentication (Phone OTP)
- Firestore (user roles)
- React Navigation
- TypeScript