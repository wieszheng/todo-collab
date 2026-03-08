"""通知接口"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Notification
from app.schemas.user import NotificationResponse

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    unread_only: bool = False,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取通知列表"""
    query = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.where(Notification.is_read == False)
    
    query = query.order_by(Notification.created_at.desc()).limit(limit)
    result = await db.execute(query)
    notifications = list(result.scalars().all())
    
    return notifications


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取未读通知数量"""
    from sqlalchemy import func
    
    result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
    )
    count = result.scalar()
    
    return {"count": count}


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """标记通知为已读"""
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notification = result.scalar_one_or_none()
    
    if not notification:
        raise HTTPException(status_code=404, detail="通知不存在")
    
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    
    notification.is_read = True
    await db.commit()
    
    return {"message": "已标记为已读"}


@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """标记所有通知为已读"""
    await db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read == False)
        .values(is_read=True)
    )
    await db.commit()
    
    return {"message": "已全部标记为已读"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除通知"""
    result = await db.execute(
        select(Notification).where(Notification.id == notification_id)
    )
    notification = result.scalar_one_or_none()
    
    if not notification:
        raise HTTPException(status_code=404, detail="通知不存在")
    
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权限")
    
    await db.delete(notification)
    await db.commit()
    
    return {"message": "删除成功"}
