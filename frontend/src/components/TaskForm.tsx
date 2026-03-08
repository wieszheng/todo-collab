import { useState } from 'react'
import { TaskCreate } from '../types'
import { X, UserPlus, Flag, Calendar, AlertCircle, FileText } from 'lucide-react'
import { useUsers } from '../hooks/useUsers'

interface TaskFormProps {
  initialData?: Partial<TaskCreate>
  onSubmit: (data: TaskCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEdit?: boolean
}

const priorityOptions = [
  { value: 'low', label: '低优先级', icon: Flag, color: 'text-[#636E72]' },
  { value: 'medium', label: '中优先级', icon: Flag, color: 'text-[#FFA07A]' },
  { value: 'high', label: '高优先级', icon: AlertCircle, color: 'text-[#FF6B6B]' },
]

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
    
    await onSubmit({
      title,
      description: description || undefined,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      assignee_id: assigneeId || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gradient flex items-center gap-2">
          {isEdit ? '编辑任务' : '新建任务'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-[#636E72] hover:text-[#2D3436] hover:bg-[#F5F5F5] rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-2">
            <FileText size={16} className="inline mr-1" />
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
          <label className="block text-sm font-medium text-[#2D3436] mb-2">
            任务描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="描述任务详情（可选）"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2D3436] mb-2">
              <Flag size={16} className="inline mr-1" />
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
            <label className="block text-sm font-medium text-[#2D3436] mb-2">
              <Calendar size={16} className="inline mr-1" />
              截止日期
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* 分配给 */}
        <div>
          <label className="block text-sm font-medium text-[#2D3436] mb-2">
            <UserPlus size={16} className="inline mr-1" />
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
          <p className="text-xs text-[#636E72] mt-1">分配后，该成员会收到通知</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E8E8E8]">
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
