"""Pydantic Schemas"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ========== User Schemas ==========
class UserBase(BaseModel):
    email: EmailStr
    nickname: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    avatar_url: Optional[str] = None
    status: str = "active"
    created_at: datetime

    class Config:
        from_attributes = True


# ========== Task Schemas ==========
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    assignee_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[str] = None


class TaskResponse(TaskBase):
    id: str
    status: str = "todo"
    creator_id: str
    assignee_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ========== Auth Schemas ==========
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


# ========== Notification Schemas ==========
class NotificationResponse(BaseModel):
    id: str
    type: str
    title: Optional[str] = None
    content: Optional[str] = None
    is_read: bool = False
    related_task_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
