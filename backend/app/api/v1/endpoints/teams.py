"""团队接口"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_teams():
    """获取团队列表"""
    return []
