"""任务接口"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.schemas.user import TaskCreate, TaskUpdate, TaskResponse
from app.models.models import Task
from app.api.deps import get_current_user
from app.models.models import User
from app.services.notification_service import notify_task_assigned

router = APIRouter()


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取任务列表"""
    query = select(Task).where(
        (Task.creator_id == current_user.id) | (Task.assignee_id == current_user.id)
    )
    
    if status_filter:
        query = query.where(Task.status == status_filter)
    if priority:
        query = query.where(Task.priority == priority)
    if assignee_id:
        query = query.where(Task.assignee_id == assignee_id)
    
    result = await db.execute(query.order_by(Task.created_at.desc()))
    tasks = list(result.scalars().all())
    
    return tasks


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建任务"""
    task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority or "medium",
        due_date=task_in.due_date,
        assignee_id=task_in.assignee_id,
        creator_id=current_user.id,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取任务详情"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新任务"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task)
    
    return task


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除任务"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    await db.delete(task)
    await db.commit()
    
    return {"message": "删除成功"}


@router.put("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(
    task_id: str,
    status: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新任务状态"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    task.status = status
    await db.commit()
    await db.refresh(task)
    
    return task


@router.put("/{task_id}/assign", response_model=TaskResponse)
async def assign_task(
    task_id: str,
    assignee_id: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """分配任务"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 检查是否有权限分配（创建者才能分配）
    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="只有任务创建者可以分配任务")
    
    # 检查被分配用户是否存在
    result = await db.execute(select(User).where(User.id == assignee_id))
    assignee = result.scalar_one_or_none()
    if not assignee:
        raise HTTPException(status_code=404, detail="被分配用户不存在")
    
    task.assignee_id = assignee_id
    await db.commit()
    await db.refresh(task)
    
    # 发送通知给被分配的用户
    if assignee_id != current_user.id:
        await notify_task_assigned(
            db=db,
            assignee_id=assignee_id,
            task_title=task.title,
            task_id=task.id,
            assigner_name=current_user.nickname or current_user.email
        )
    
    return task
