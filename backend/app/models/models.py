# 数据库模型

from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nickname = Column(String(100))
    avatar_url = Column(Text)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    tasks_created = relationship("Task", back_populates="creator", foreign_keys="Task.creator_id")
    tasks_assigned = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(20), default=TaskStatus.TODO.value)
    priority = Column(String(20), default=TaskPriority.MEDIUM.value)
    due_date = Column(DateTime, nullable=True)
    creator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    assignee_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    creator = relationship("User", back_populates="tasks_created", foreign_keys=[creator_id])
    assignee = relationship("User", back_populates="tasks_assigned", foreign_keys=[assignee_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(255))
    content = Column(Text)
    is_read = Column(Boolean, default=False)
    related_task_id = Column(String(36), ForeignKey("tasks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
