"""通知服务"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Notification


async def create_notification(
    db: AsyncSession,
    user_id: str,
    type: str,
    title: str = None,
    content: str = None,
    related_task_id: str = None
) -> Notification:
    """创建通知"""
    notification = Notification(
        user_id=user_id,
        type=type,
        title=title,
        content=content,
        related_task_id=related_task_id
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification


async def notify_task_assigned(
    db: AsyncSession,
    assignee_id: str,
    task_title: str,
    task_id: str,
    assigner_name: str = "系统"
) -> Notification:
    """任务分配通知"""
    return await create_notification(
        db=db,
        user_id=assignee_id,
        type="task_assigned",
        title="📝 新任务分配",
        content=f"{assigner_name} 将任务「{task_title}」分配给了你",
        related_task_id=task_id
    )


async def notify_task_updated(
    db: AsyncSession,
    user_id: str,
    task_title: str,
    task_id: str,
    update_type: str = "状态更新"
) -> Notification:
    """任务更新通知"""
    return await create_notification(
        db=db,
        user_id=user_id,
        type="task_updated",
        title=f"📌 任务{update_type}",
        content=f"任务「{task_title}」已{update_type}",
        related_task_id=task_id
    )


async def notify_task_due_soon(
    db: AsyncSession,
    user_id: str,
    task_title: str,
    task_id: str,
    due_in: str = "即将到期"
) -> Notification:
    """任务即将到期提醒"""
    return await create_notification(
        db=db,
        user_id=user_id,
        type="task_due",
        title="⏰ 任务即将到期",
        content=f"任务「{task_title}」{due_in}，请及时处理",
        related_task_id=task_id
    )
