"""邮件发送服务"""

import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.models import Task, User, Notification


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str = None
) -> bool:
    """
    发送邮件 (使用 SendGrid)
    
    如果未配置 SendGrid API Key，则只打印日志不实际发送
    """
    if not settings.SENDGRID_API_KEY:
        print(f"[Email] 发送邮件到 {to_email}: {subject}")
        print(f"[Email] 内容: {text_content or html_content[:100]}...")
        return True
    
    try:
        import sendgrid
        from sendgrid.helpers.mail import Mail, Email, To, Content
        
        sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        from_email = Email(settings.EMAIL_FROM)
        to_email_obj = To(to_email)
        subject_obj = subject
        content = Content("text/html", html_content)
        mail = Mail(from_email, to_email_obj, subject_obj, content)
        
        response = sg.send(mail)
        return response.status_code in [200, 201, 202]
    except Exception as e:
        print(f"[Email] 发送失败: {e}")
        return False


async def send_task_assigned_email(
    to_email: str,
    assignee_name: str,
    task_title: str,
    task_id: str,
    assigner_name: str
) -> bool:
    """发送任务分配邮件"""
    subject = f"📝 新任务分配: {task_title}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">新任务分配</h2>
        <p>Hi {assignee_name},</p>
        <p><strong>{assigner_name}</strong> 将任务分配给了你：</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h3 style="margin: 0 0 8px 0;">{task_title}</h3>
            <a href="http://localhost:5173/tasks/{task_id}" 
               style="color: #6366f1; text-decoration: none;">查看任务详情 →</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">此邮件由系统自动发送，请勿回复。</p>
    </div>
    """
    text = f"新任务分配: {assigner_name} 将任务「{task_title}」分配给了你"
    return await send_email(to_email, subject, html, text)


async def send_task_due_email(
    to_email: str,
    user_name: str,
    task_title: str,
    task_id: str,
    due_date: datetime
) -> bool:
    """发送任务即将到期提醒邮件"""
    due_str = due_date.strftime("%Y-%m-%d %H:%M")
    subject = f"⏰ 任务即将到期: {task_title}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">任务即将到期提醒</h2>
        <p>Hi {user_name},</p>
        <p>你的任务即将到期：</p>
        <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin: 0 0 8px 0;">{task_title}</h3>
            <p style="margin: 0; color: #92400e;">截止时间: {due_str}</p>
            <a href="http://localhost:5173/tasks/{task_id}" 
               style="color: #6366f1; text-decoration: none; display: inline-block; margin-top: 12px;">查看任务详情 →</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">请及时处理，避免逾期。</p>
    </div>
    """
    text = f"任务「{task_title}」即将在 {due_str} 到期，请及时处理"
    return await send_email(to_email, subject, html, text)


async def check_and_notify_due_tasks(db: AsyncSession) -> List[dict]:
    """
    检查即将到期的任务并发送提醒
    
    返回发送的通知列表
    """
    now = datetime.utcnow()
    tomorrow = now + timedelta(days=1)
    
    # 查找 24 小时内到期的未完成任务
    result = await db.execute(
        select(Task).where(
            and_(
                Task.due_date != None,
                Task.due_date > now,
                Task.due_date <= tomorrow,
                Task.status != "done"
            )
        )
    )
    tasks = list(result.scalars().all())
    
    notifications_sent = []
    
    for task in tasks:
        # 获取负责人
        assignee_id = task.assignee_id or task.creator_id
        if not assignee_id:
            continue
        
        # 检查今天是否已发送过提醒
        existing = await db.execute(
            select(Notification).where(
                and_(
                    Notification.user_id == assignee_id,
                    Notification.related_task_id == task.id,
                    Notification.type == "task_due",
                    Notification.created_at > now - timedelta(hours=24)
                )
            )
        )
        if existing.scalar_one_or_none():
            continue
        
        # 获取用户信息
        user_result = await db.execute(
            select(User).where(User.id == assignee_id)
        )
        user = user_result.scalar_one_or_none()
        if not user:
            continue
        
        # 发送邮件
        await send_task_due_email(
            to_email=user.email,
            user_name=user.nickname or user.email.split("@")[0],
            task_title=task.title,
            task_id=task.id,
            due_date=task.due_date
        )
        
        # 创建站内通知
        from app.services.notification_service import notify_task_due_soon
        await notify_task_due_soon(
            db=db,
            user_id=assignee_id,
            task_title=task.title,
            task_id=task.id,
            due_in=f"将在 {task.due_date.strftime('%m-%d %H:%M')} 到期"
        )
        
        notifications_sent.append({
            "task_id": task.id,
            "task_title": task.title,
            "user_email": user.email
        })
    
    return notifications_sent
