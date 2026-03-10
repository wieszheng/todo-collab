"""
Todo Collab - 待办事项协作平台
FastAPI 后端服务
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings
from app.core.database import init_db
from app.services.scheduler_service import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    await init_db()
    # 启动定时任务调度器
    await start_scheduler()
    print("🚀 Todo Collab 服务已启动")
    yield
    # 关闭时清理资源
    await stop_scheduler()
    print("👋 Todo Collab 服务已关闭")


app = FastAPI(
    title="Todo Collab API",
    description="待办事项协作平台 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Todo Collab API", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
