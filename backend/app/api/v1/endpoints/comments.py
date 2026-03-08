"""评论接口"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_comments():
    """获取评论列表"""
    return []
