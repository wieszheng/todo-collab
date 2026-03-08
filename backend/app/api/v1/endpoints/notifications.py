"""通知接口"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_notifications():
    """获取通知列表"""
    return []
