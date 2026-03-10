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

**Response:** 任务对象包含 `creator` 和 `assignee` 用户信息

### POST /tasks
创建任务

**Request:**
```json
{
  "title": "任务标题",
  "description": "任务描述",
  "priority": "high",
  "due_date": "2024-01-15T00:00:00Z",
  "assignee_id": "用户ID"
}
```

**注意:** 创建任务时如果指定了 `assignee_id`，会自动发送邮件通知

### GET /tasks/{task_id}
获取任务详情

**Response:** 包含完整的 `creator` 和 `assignee` 用户信息

### PUT /tasks/{task_id}
更新任务

### DELETE /tasks/{task_id}
删除任务

### PUT /tasks/{task_id}/status
更新任务状态

**Query Parameters:**
- `status` - 新状态 (todo/in_progress/done)

### PUT /tasks/{task_id}/assign
分配任务给其他用户

**Query Parameters:**
- `assignee_id` - 被分配用户ID

**注意:** 分配任务会发送邮件通知给被分配人

## 用户接口

### GET /users/me
获取当前用户信息

### PUT /users/me
更新用户信息

### GET /users
获取用户列表（用于任务分配）

### GET /users/{user_id}
获取用户详情

## 通知接口

### GET /notifications
获取通知列表

**Query Parameters:**
- `unread_only` - 仅返回未读通知
- `limit` - 返回数量限制

### GET /notifications/unread-count
获取未读通知数量

### PUT /notifications/{id}/read
标记通知已读

### PUT /notifications/read-all
标记所有通知已读

### DELETE /notifications/{id}
删除通知

## 团队接口

### GET /teams
获取用户所在团队列表

### POST /teams
创建团队

### GET /teams/{team_id}
获取团队详情

### PUT /teams/{team_id}
更新团队信息

### DELETE /teams/{team_id}
解散团队

### POST /teams/{team_id}/invite
邀请成员加入团队

**Request:**
```json
{
  "email": "user@example.com",
  "role": "member"
}
```

### PUT /teams/{team_id}/members/{member_id}
更新成员角色

### DELETE /teams/{team_id}/members/{member_id}
移除成员

### POST /teams/{team_id}/leave
退出团队

## 评论接口

### GET /comments/task/{task_id}
获取任务评论列表

### POST /comments/task/{task_id}
添加评论

**Request:**
```json
{
  "content": "评论内容"
}
```

### DELETE /comments/{comment_id}
删除评论

## 管理接口

### POST /admin/check-due-tasks
手动触发检查到期任务

**说明:** 检查 24 小时内到期的任务，发送邮件提醒
