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


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None


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


# ========== Comment Schemas ==========
class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: str
    content: str
    task_id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========== Team Schemas ==========
class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class TeamMemberResponse(BaseModel):
    id: str
    team_id: str
    user_id: str
    role: str
    joined_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    creator_id: str
    created_at: datetime
    members: Optional[List[TeamMemberResponse]] = None

    class Config:
        from_attributes = True


class InviteMember(BaseModel):
    email: EmailStr
    role: str = "member"


class UpdateMemberRole(BaseModel):
    role: str
