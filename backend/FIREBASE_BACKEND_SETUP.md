# Backend Firebase Configuration

## 🔐 Firebase Admin SDK Setup

The backend uses Firebase Admin SDK for server-side operations.

### Installation

The dependency is already in `requirements.txt`:
```
firebase-admin==6.2.0
```

### Configuration

1. **Download Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/everglen)
   - Go to Project Settings (gear icon) → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in `/backend` directory

2. **Create Backend `.env` file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Update `.env` with your credentials:**
   ```
   FIREBASE_PROJECT_ID=everglen
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   JWT_SECRET=your_strong_secret_key_here
   ```

### Initialize Firebase in Backend

Example usage in `app.py`:

```python
import firebase_admin
from firebase_admin import credentials, db, firestore

# Initialize Firebase Admin
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'projectId': 'everglen'
})

# Get Firestore client
db = firestore.client()
```

---

## 🔄 API Endpoints with Role-Based Access

### Customer Endpoints
```
GET /api/customer/dashboard          - Get customer profile
GET /api/customer/orders              - Get customer orders
POST /api/customer/orders             - Create new order
GET /api/customer/orders/{order_id}   - Get specific order
```

### Hotel Endpoints
```
GET /api/hotel/kitchen                - Get active kitchen orders
PUT /api/hotel/kitchen/{order_id}     - Update order status
GET /api/hotel/menu                   - Get hotel menu items
POST /api/hotel/menu                  - Add menu item
```

### Driver Endpoints
```
GET /api/driver/logistics             - Get assigned deliveries
PUT /api/driver/logistics/{order_id}  - Update delivery status
GET /api/driver/profile               - Get driver profile
PUT /api/driver/location              - Update current location
```

---

## 🛡️ Middleware Configuration

The `RoleBasedAuthMiddleware` in `backend/middleware/auth.py`:

1. **Validates Firebase ID tokens** from frontend
2. **Extracts user role** from Firestore
3. **Enforces role-based access** on protected endpoints

Usage in routes:

```python
from fastapi import Depends
from backend.middleware.auth import verify_role

@app.get("/api/customer/dashboard")
async def get_customer_dashboard(
    user_id: str = Depends(verify_role(["customer"]))
):
    """Only customers can access this"""
    return {"user_id": user_id}
```

---

## 📊 Firestore Collections (Backend Reference)

See `FIREBASE_SETUP.md` for complete collection structure.

---

## 🚀 Running the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

API will be available at: `http://localhost:8000`
API Docs at: `http://localhost:8000/docs`

---

## 🔗 Firestore Operations Examples

### Read User Data
```python
from firebase_admin import firestore

db = firestore.client()

# Get user
user_ref = db.collection('users').document(user_id)
user_data = user_ref.get()
```

### Write Order Data
```python
# Create order
order_data = {
    'customer_id': customer_id,
    'hotel_id': hotel_id,
    'items': items,
    'status': 'pending',
    'created_at': firestore.SERVER_TIMESTAMP
}

order_ref = db.collection('orders').add(order_data)
```

### Real-time Listener
```python
def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(f'Received document: {doc.id}')

# Listen to changes
query = db.collection('orders').where('status', '==', 'pending')
listener = query.on_snapshot(on_snapshot)
```

---

**Backend is now ready to connect with Firestore!** 🚀
