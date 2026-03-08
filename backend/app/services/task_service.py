"""任务服务"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import Task, TaskStatus, TaskPriority
from app.schemas.user import TaskCreate, TaskUpdate


async def get(db: AsyncSession, task_id: str) -> Task | None:
    """获取单个任务"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    return result.scalar_one_or_none()


async def get_user_tasks(
    db: AsyncSession,
    user_id: str,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[str] = None
) -> List[Task]:
    """获取用户任务列表"""
    query = select(Task).where(
        (Task.creator_id == user_id) | (Task.assignee_id == user_id)
    )
    
    if status:
        query = query.where(Task.status == status)
    if priority:
        query = query.where(Task.priority == priority)
    if assignee_id:
        query = query.where(Task.assignee_id == assignee_id)
    
    result = await db.execute(query.order_by(Task.created_at.desc()))
    return list(result.scalars().all())


async def create(db: AsyncSession, task_in: TaskCreate, creator_id: str) -> Task:
    """创建任务"""
    task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        due_date=task_in.due_date,
        assignee_id=task_in.assignee_id,
        creator_id=creator_id,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


async def update(db: AsyncSession, task_id: str, task_in: TaskUpdate) -> Task | None:
    """更新任务"""
    task = await get(db, task_id)
    if not task:
        return None
    
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task)
    return task


async def delete(db: AsyncSession, task_id: str) -> bool:
    """删除任务"""
    task = await get(db, task_id)
    if not task:
        return False
    
    await db.delete(task)
    await db.commit()
    return True


async def update_status(db: AsyncSession, task_id: str, status: str) -> Task | None:
    """更新任务状态"""
    task = await get(db, task_id)
    if not task:
        return None
    
    task.status = status
    await db.commit()
    await db.refresh(task)
    return task


async def assign(db: AsyncSession, task_id: str, assignee_id: str) -> Task | None:
    """分配任务"""
    task = await get(db, task_id)
    if not task:
        return None
    
    task.assignee_id = assignee_id
    await db.commit()
    await db.refresh(task)
    return task
