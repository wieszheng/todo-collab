# API 设计文档

## 基础信息

- **Base URL**: `/api/v1`
- **认证方式**: JWT Bearer Token
- **文档地址**: `/docs` (Swagger UI)

## 认证接口

### POST /auth/register
用户注册

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称"
}
```

### POST /auth/login
用户登录

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

## 任务接口

### GET /tasks
获取任务列表

**Query Parameters:**
- `status` - 任务状态筛选
- `priority` - 优先级筛选
- `assignee_id` - 负责人筛选

### POST /tasks
创建任务

**Request:**
```json
{
  "title": "任务标题",
  "description": "任务描述",
  "priority": "high",
  "due_date": "2024-01-15"
}
```

### PUT /tasks/{task_id}
更新任务

### DELETE /tasks/{task_id}
删除任务

### PUT /tasks/{task_id}/status
更新任务状态

### PUT /tasks/{task_id}/assign
分配任务

## 用户接口

### GET /users/me
获取当前用户信息

### PUT /users/me
更新用户信息

## 通知接口

### GET /notifications
获取通知列表

### PUT /notifications/{id}/read
标记通知已读
