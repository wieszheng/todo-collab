# 📋 Todo Collab - 待办事项协作平台

一个现代化的待办事项协作平台，支持任务管理、团队协作、实时通知。

## ✨ 功能特性

### ✅ 已完成

- **用户系统**
  - 用户注册/登录
  - 个人资料管理
  - JWT 认证

- **任务管理**
  - 创建、编辑、删除任务
  - 任务状态管理 (待办/进行中/已完成)
  - 任务优先级设置 (低/中/高)
  - 截止日期设置
  - 任务分配给团队成员
  - 任务评论功能

- **团队协作**
  - 创建团队
  - 邀请成员加入
  - 角色管理 (创建者/管理员/成员)
  - 成员权限控制

- **通知系统**
  - 站内通知
  - 任务分配通知
  - 任务更新通知
  - 任务到期提醒

- **邮件通知** 🆕
  - 任务分配邮件通知
  - 任务即将到期提醒 (24小时内)
  - 定时任务检查 (每小时)

## 🛠️ 技术栈

### 前端
- **React 18** + TypeScript
- **React Router v6** - 路由管理
- **Zustand** - 全局状态管理
- **React Query** - 服务端状态缓存
- **Tailwind CSS** - 样式方案
- **shadcn/ui** - UI 组件库

### 后端
- **Python 3.11** + FastAPI
- **SQLAlchemy 2.0** - ORM
- **Pydantic v2** - 数据验证
- **PostgreSQL** - 主数据库
- **Redis** - 缓存、会话
- **Celery** - 异步任务
- **SendGrid** - 邮件服务 🆕

## 📁 项目结构

```
todo-collab/
├── frontend/          # React 前端项目
├── backend/           # FastAPI 后端项目
├── docs/              # 项目文档
│   ├── PRD.md         # 产品需求文档
│   ├── API.md         # API 设计文档
│   └── DATABASE.md    # 数据库设计
└── README.md
```

## 🚀 快速开始

### 后端启动

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ 配置说明

### 环境变量

```bash
# 数据库
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/todo_collab

# JWT
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=15

# 邮件 (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@yourdomain.com

# CORS
CORS_ORIGINS=["http://localhost:5173"]
```

## 📖 文档

- [产品需求文档](docs/PRD.md)
- [API 设计文档](docs/API.md)
- [数据库设计](docs/DATABASE.md)

## 📅 最近更新

### v1.1.0 (2026-03-10)
- ✨ 任务响应增加 `creator` 和 `assignee` 用户详细信息
- ✨ 任务详情页支持快速分配任务给其他用户
- ✨ 添加邮件通知服务 (SendGrid)
- ✨ 添加定时任务检查即将到期的任务
- ✨ 任务分配时自动发送邮件通知
- 🔧 优化通知服务，支持邮件推送

## 📄 License

MIT
