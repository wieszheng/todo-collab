# 📋 Todo Collab - 待办事项协作平台

一个现代化的待办事项协作平台，支持任务管理、团队协作、实时通知。

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

## 📖 文档

- [产品需求文档](docs/PRD.md)
- [API 设计文档](docs/API.md)
- [数据库设计](docs/DATABASE.md)

## 📅 开发计划

| 阶段 | 时间 | 内容 |
|------|------|------|
| Week 1 | 第1周 | 用户注册登录、数据库设计 |
| Week 2 | 第2周 | 任务 CRUD 核心功能 |
| Week 3 | 第3周 | 任务分配、列表筛选 |
| Week 4 | 第4周 | 邮件通知、到期提醒 |
| Week 5 | 第5周 | UI 优化、Bug 修复 |
| Week 6 | 第6周 | 测试、部署上线 |

## 📄 License

MIT
