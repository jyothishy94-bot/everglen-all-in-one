"""
Database Models and Schemas
Unified master document blueprints for all roles
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

# ============================================
# Enums
# ============================================

class RoleEnum(str, Enum):
    CUSTOMER = "customer"
    HOTEL = "hotel"
    DRIVER = "driver"

class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatusEnum(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

# ============================================
# User Model
# ============================================

class UserBase(BaseModel):
    phone_number: str
    name: str
    email: Optional[str] = None
    role: RoleEnum
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class User(UserBase):
    user_id: str
    firestore_id: Optional[str] = None

# ============================================
# Customer Model
# ============================================

class CustomerProfile(BaseModel):
    user_id: str
    delivery_addresses: List[Dict] = []
    saved_payment_methods: List[Dict] = []
    order_history: List[str] = []
    favorite_hotels: List[str] = []
    loyalty_points: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# Hotel Model
# ============================================

class HotelProfile(BaseModel):
    user_id: str
    hotel_name: str
    location: str
    cuisine_type: str
    phone: str
    opening_hours: Dict[str, str] = {}
    menu_items: List[str] = []
    kitchen_staff: List[str] = []
    active_orders: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class KitchenOrder(BaseModel):
    order_id: str
    hotel_id: str
    items: List[Dict]
    status: OrderStatusEnum = OrderStatusEnum.PENDING
    preparation_time: int  # in minutes
    created_at: datetime = Field(default_factory=datetime.utcnow)
    assigned_chef: Optional[str] = None

# ============================================
# Driver Model
# ============================================

class DriverProfile(BaseModel):
    user_id: str
    driver_name: str
    vehicle_type: str
    vehicle_number: str
    license_number: str
    active: bool = True
    current_location: Dict = {}  # {lat, lng}
    assigned_orders: List[str] = []
    total_deliveries: int = 0
    rating: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Delivery(BaseModel):
    delivery_id: str
    order_id: str
    driver_id: str
    pickup_location: Dict
    delivery_location: Dict
    status: OrderStatusEnum
    estimated_time: int  # in minutes
    actual_time: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# Order Model
# ============================================

class OrderItem(BaseModel):
    item_id: str
    name: str
    quantity: int
    price: float
    special_instructions: Optional[str] = None

class Order(BaseModel):
    order_id: str
    customer_id: str
    hotel_id: str
    items: List[OrderItem]
    total_amount: float
    tax: float
    delivery_charges: float
    discount: float = 0.0
    final_amount: float
    status: OrderStatusEnum = OrderStatusEnum.PENDING
    payment_status: PaymentStatusEnum = PaymentStatusEnum.PENDING
    delivery_address: Dict
    estimated_delivery_time: int  # in minutes
    assigned_driver: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============================================
# Wallet/Payment Model
# ============================================

class Wallet(BaseModel):
    wallet_id: str
    user_id: str
    balance: float = 0.0
    currency: str = "USD"
    transactions: List[Dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Transaction(BaseModel):
    transaction_id: str
    wallet_id: str
    amount: float
    transaction_type: str  # "credit", "debit"
    order_id: Optional[str] = None
    status: PaymentStatusEnum
    created_at: datetime = Field(default_factory=datetime.utcnow)