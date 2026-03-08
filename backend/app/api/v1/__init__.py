"""API 路由"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, tasks, teams, comments, notifications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["任务"])
api_router.include_router(teams.router, prefix="/teams", tags=["团队"])
api_router.include_router(comments.router, prefix="/comments", tags=["评论"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["通知"])
