"""用户接口"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User

router = APIRouter()


@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """获取当前用户信息"""
    return current_user
