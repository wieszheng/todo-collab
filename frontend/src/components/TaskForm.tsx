import { useState } from 'react'
import { TaskCreate, Task } from '../types'
import { X, UserPlus, Flag, Calendar, FileText } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'

interface TaskFormProps {
  initialData?: Partial<TaskCreate> | Task
  onSubmit: (data: TaskCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

export default function TaskForm({ initialData, onSubmit, onCancel, isLoading, isEdit }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialData?.priority || 'medium')
  const [dueDate, setDueDate] = useState(
    initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : ''
  )
  const [assigneeId, setAssigneeId] = useState(initialData?.assignee_id || '')

  const { data: users = [] } = useUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: any = {
      title,
      priority,
    }
    
    // 只在有值时才添加可选字段
    if (description) data.description = description
    if (dueDate) data.due_date = new Date(dueDate).toISOString()
    if (assigneeId) data.assignee_id = assigneeId
    
    console.log('[TaskForm] Submitting data:', data)
    
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gradient flex items-center gap-1.5">
          {isEdit ? '编辑任务' : '新建任务'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-neutral-warm dark:text-neutral-light hover:text-neutral-charcoal dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">
            <FileText size={14} className="inline mr-1" />
            任务标题 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
            placeholder="输入任务标题"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">
            任务描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="input resize-none"
            placeholder="描述任务详情（可选）"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">
              <Flag size={14} className="inline mr-1" />
              优先级
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="input"
            >
              <option value="low">低优先级</option>
              <option value="medium">中优先级</option>
              <option value="high">高优先级</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">
              <Calendar size={14} className="inline mr-1" />
              截止日期
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                console.log('[TaskForm] Date input onChange, value:', e.target.value)
                setDueDate(e.target.value)
              }}
              onBlur={() => {
                console.log('[TaskForm] Date input onBlur, dueDate state:', dueDate)
              }}
              className="input"
            />
            {dueDate && <p className="text-xs text-green-600 mt-1">已选择: {dueDate}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-charcoal dark:text-white mb-1">
            <UserPlus size={14} className="inline mr-1" />
            分配给
          </label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="input"
          >
            <option value="">不分配</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nickname || user.email}
              </option>
            ))}
          </select>
          <p className="text-xs text-neutral-warm dark:text-neutral-light mt-0.5">分配后，该成员会收到通知</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? '保存中...' : isEdit ? '保存修改' : '创建任务'}
        </button>
      </div>
    </form>
  )
}
