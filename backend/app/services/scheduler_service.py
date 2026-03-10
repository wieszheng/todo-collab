"""定时任务服务"""

import asyncio
from datetime import datetime
from typing import Optional

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.services.email_service import check_and_notify_due_tasks


class TaskScheduler:
    """任务调度器"""
    
    def __init__(self):
        self.running = False
        self.engine = None
        self.async_session = None
    
    async def start(self):
        """启动调度器"""
        if self.running:
            return
        
        self.engine = create_async_engine(settings.DATABASE_URL, echo=False)
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )
        self.running = True
        
        # 启动后台任务
        asyncio.create_task(self._run_scheduler())
        print("[Scheduler] 调度器已启动")
    
    async def stop(self):
        """停止调度器"""
        self.running = False
        if self.engine:
            await self.engine.dispose()
        print("[Scheduler] 调度器已停止")
    
    async def _run_scheduler(self):
        """运行调度循环"""
        while self.running:
            try:
                await self._check_due_tasks()
            except Exception as e:
                print(f"[Scheduler] 错误: {e}")
            
            # 每小时检查一次
            await asyncio.sleep(60 * 60)
    
    async def _check_due_tasks(self):
        """检查即将到期的任务"""
        async with self.async_session() as db:
            notifications = await check_and_notify_due_tasks(db)
            if notifications:
                print(f"[Scheduler] 发送了 {len(notifications)} 条到期提醒")


# 全局调度器实例
scheduler: Optional[TaskScheduler] = None


async def start_scheduler():
    """启动调度器"""
    global scheduler
    scheduler = TaskScheduler()
    await scheduler.start()


async def stop_scheduler():
    """停止调度器"""
    global scheduler
    if scheduler:
        await scheduler.stop()
        scheduler = None
