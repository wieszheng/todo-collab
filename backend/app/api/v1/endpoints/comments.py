"""评论接口"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Task, Comment
from app.schemas.user import CommentCreate, CommentResponse

router = APIRouter()


@router.get("/task/{task_id}", response_model=List[CommentResponse])
async def list_task_comments(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取任务的评论列表"""
    # 检查任务是否存在且用户有权限
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    if task.creator_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权查看此任务的评论")
    
    # 获取评论
    result = await db.execute(
        select(Comment)
        .where(Comment.task_id == task_id)
        .order_by(Comment.created_at.desc())
    )
    comments = list(result.scalars().all())
    return comments


@router.post("/task/{task_id}", response_model=CommentResponse)
async def create_comment(
    task_id: str,
    data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建评论"""
    # 检查任务是否存在且用户有权限
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    if task.creator_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权评论此任务")
    
    # 创建评论
    comment = Comment(
        content=data.content,
        task_id=task_id,
        user_id=current_user.id
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    
    return comment


@router.delete("/{comment_id}")
async def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除评论"""
    result = await db.execute(select(Comment).where(Comment.id == comment_id))
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(status_code=404, detail="评论不存在")
    
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权删除此评论")
    
    await db.delete(comment)
    await db.commit()
    
    return {"message": "评论已删除"}
