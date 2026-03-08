"""任务接口"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services import task_service
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee_id: Optional[str] = Query(None),
    current_user = Depends(get_current_user)
):
    """获取任务列表"""
    tasks = await task_service.get_user_tasks(
        user_id=current_user.id,
        status=status,
        priority=priority,
        assignee_id=assignee_id
    )
    return tasks


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    current_user = Depends(get_current_user)
):
    """创建任务"""
    task = await task_service.create(task_in, creator_id=current_user.id)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    current_user = Depends(get_current_user)
):
    """获取任务详情"""
    task = await task_service.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user = Depends(get_current_user)
):
    """更新任务"""
    task = await task_service.update(task_id, task_in)
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return task


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user = Depends(get_current_user)
):
    """删除任务"""
    await task_service.delete(task_id)
    return {"message": "删除成功"}


@router.put("/{task_id}/status")
async def update_task_status(
    task_id: str,
    status: str,
    current_user = Depends(get_current_user)
):
    """更新任务状态"""
    task = await task_service.update_status(task_id, status)
    return task


@router.put("/{task_id}/assign")
async def assign_task(
    task_id: str,
    assignee_id: str,
    current_user = Depends(get_current_user)
):
    """分配任务"""
    task = await task_service.assign(task_id, assignee_id)
    return task
