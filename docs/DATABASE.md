# 数据库设计

## 核心表结构

### users (用户表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | VARCHAR(255) | 邮箱，唯一 |
| password_hash | VARCHAR(255) | 密码哈希 |
| nickname | VARCHAR(100) | 昵称 |
| avatar_url | TEXT | 头像URL |
| status | VARCHAR(20) | 状态 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### tasks (任务表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | VARCHAR(255) | 标题 |
| description | TEXT | 描述 |
| status | VARCHAR(20) | 状态 (todo/in_progress/done) |
| priority | VARCHAR(20) | 优先级 (low/medium/high) |
| due_date | TIMESTAMPTZ | 截止日期 |
| creator_id | UUID | 创建者ID |
| assignee_id | UUID | 负责人ID |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

### notifications (通知表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户ID |
| type | VARCHAR(50) | 通知类型 |
| title | VARCHAR(255) | 标题 |
| content | TEXT | 内容 |
| is_read | BOOLEAN | 是否已读 |
| related_task_id | UUID | 关联任务ID |
| created_at | TIMESTAMPTZ | 创建时间 |

## ER 图

```
┌─────────┐       ┌─────────┐
│  users  │       │  tasks  │
├─────────┤       ├─────────┤
│ id      │◄──────│creator_id│
│ email   │       │assignee_id│
│ nickname│       │ title   │
└─────────┘       │ status  │
                  └─────────┘
```
