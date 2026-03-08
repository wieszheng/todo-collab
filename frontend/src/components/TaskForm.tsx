import { useState } from 'react'
import { TaskCreate } from '../types'

interface TaskFormProps {
  initialData?: Partial<TaskCreate>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await onSubmit({
      title,
      description: description || undefined,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-bold mb-6">{isEdit ? '编辑任务' : '新建任务'}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务标题 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="输入任务标题"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="描述任务详情（可选）"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截止日期
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? '保存中...' : isEdit ? '保存修改' : '创建任务'}
        </button>
      </div>
    </form>
  )
}
