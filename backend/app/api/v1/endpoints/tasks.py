"""任务接口"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.schemas.user import TaskCreate, TaskUpdate, TaskResponse, UserResponse
from app.models.models import Task
from app.api.deps import get_current_user
from app.models.models import User
from app.services import task_service
from app.services.notification_service import notify_task_assigned

router = APIRouter()


async def build_task_response(task: Task) -> dict:
    """构建任务响应，包含关联用户信息"""
    response = TaskResponse.model_validate(task)
    if task.creator:
        response.creator = UserResponse.model_validate(task.creator)
    if task.assignee:
        response.assignee = UserResponse.model_validate(task.assignee)
    return response


async def get_task_with_relations(db: AsyncSession, task_id: str) -> Task | None:
    """获取任务并加载关联用户"""
    result = await db.execute(
        select(Task)
        .options(selectinload(Task.creator), selectinload(Task.assignee))
        .where(Task.id == task_id)
    )
    return result.scalar_one_or_none()


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取任务列表"""
    # 使用 service 层获取任务
    tasks = await task_service.get_user_tasks(
        db=db,
        user_id=current_user.id,
        status=status_filter,
        priority=priority,
        assignee_id=assignee_id
    )
    
    # 加载关联用户
    for task in tasks:
        await db.refresh(task, ['creator', 'assignee'])
    
    return [await build_task_response(task) for task in tasks]


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """创建任务"""
    # 使用 service 层创建任务
    task = await task_service.create(db, task_in, current_user.id)
    
    # 加载关联用户
    task = await get_task_with_relations(db, task.id)
    
    # 如果指定了分配人，发送通知
    if task.assignee_id and task.assignee_id != current_user.id:
        await notify_task_assigned(
            db=db,
            assignee_id=task.assignee_id,
            task_title=task.title,
            task_id=task.id,
            assigner_name=current_user.nickname or current_user.email
        )
    
    return await build_task_response(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """获取任务详情"""
    task = await get_task_with_relations(db, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 检查权限
    if task.creator_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="没有权限查看此任务")
    
    return await build_task_response(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新任务"""
    task = await get_task_with_relations(db, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 检查权限
    if task.creator_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="没有权限修改此任务")
    
    # 使用 service 层更新
    task = await task_service.update(db, task_id, task_in)
    task = await get_task_with_relations(db, task_id)
    
    return await build_task_response(task)


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """删除任务"""
    task = await task_service.get(db, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 只有创建者可以删除
    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="只有创建者可以删除任务")
    
    await task_service.delete(db, task_id)
    return {"message": "任务已删除"}


@router.put("/{task_id}/status", response_model=TaskResponse)
async def update_task_status(
    task_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新任务状态"""
    task = await task_service.get(db, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 检查权限
    if task.creator_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="没有权限修改此任务")
    
    # 使用 service 层更新状态
    task = await task_service.update_status(db, task_id, status)
    task = await get_task_with_relations(db, task_id)
    
    return await build_task_response(task)


@router.put("/{task_id}/assign", response_model=TaskResponse)
async def assign_task(
    task_id: str,
    assignee_id: str = Query(..., alias="assignee_id"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """分配任务"""
    task = await task_service.get(db, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    # 只有创建者可以分配
    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="只有创建者可以分配任务")
    
    # 使用 service 层分配
    task = await task_service.assign(db, task_id, assignee_id)
    task = await get_task_with_relations(db, task_id)
    
    # 发送通知
    if assignee_id != current_user.id:
        await notify_task_assigned(
            db=db,
            assignee_id=assignee_id,
            task_title=task.title,
            task_id=task.id,
            assigner_name=current_user.nickname or current_user.email
        )
    
    return await build_task_response(task)
