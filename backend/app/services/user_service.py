"""用户服务"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash


async def get_by_email(db: AsyncSession, email: str) -> User | None:
    """根据邮箱获取用户"""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_by_id(db: AsyncSession, user_id: str) -> User | None:
    """根据ID获取用户"""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create(db: AsyncSession, user_in: UserCreate) -> User:
    """创建用户"""
    user = User(
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        nickname=user_in.nickname,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
