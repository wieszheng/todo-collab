"""管理接口"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User
from app.services.email_service import check_and_notify_due_tasks

router = APIRouter()


@router.post("/check-due-tasks")
async def trigger_check_due_tasks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """手动触发检查到期任务（管理员功能）"""
    notifications = await check_and_notify_due_tasks(db)
    return {
        "message": f"检查完成，发送了 {len(notifications)} 条提醒",
        "notifications": notifications
    }
