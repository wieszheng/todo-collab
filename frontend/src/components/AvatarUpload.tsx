import { useState, useRef, useCallback } from 'react'
import { Camera, X, Check, RotateCcw } from 'lucide-react'
import { Avatar } from './Avatar'

interface AvatarUploadProps {
  currentAvatar?: string | null
  name?: string
  onUpload: (base64: string) => Promise<void>
  disabled?: boolean
}

export function AvatarUpload({ currentAvatar, name, onUpload, disabled }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 100 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 检查文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImageSrc(result)
      setPreview(result)
      setShowCropper(true)
      setCropArea({ x: 0, y: 0, size: 100 })
    }
    reader.readAsDataURL(file)

    // 清空 input 以便重复选择同一文件
    e.target.value = ''
  }

  const handleCrop = useCallback(() => {
    if (!imageSrc || !imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const minDim = Math.min(img.naturalWidth, img.naturalHeight)
    const scale = img.naturalWidth / img.offsetWidth

    // 输出尺寸
    const outputSize = 200
    canvas.width = outputSize
    canvas.height = outputSize

    // 计算裁剪区域
    const cropSize = Math.min(cropArea.size, minDim / scale)
    const sx = cropArea.x * scale
    const sy = cropArea.y * scale
    const sSize = cropSize * scale

    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize)

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9)
    setPreview(croppedBase64)
    setShowCropper(false)
  }, [imageSrc, cropArea])

  const handleUpload = async () => {
    if (!preview) return

    setIsUploading(true)
    try {
      await onUpload(preview)
      setPreview(null)
      setImageSrc(null)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    setImageSrc(null)
    setShowCropper(false)
  }

  const handleReset = () => {
    if (imageSrc) {
      setPreview(imageSrc)
      setCropArea({ x: 0, y: 0, size: 100 })
    }
  }

  // 简单的拖拽裁剪
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 以点击位置为中心设置裁剪框
    const size = Math.min(rect.width, rect.height) * 0.8
    const newX = Math.max(0, Math.min(x - size / 2, rect.width - size))
    const newY = Math.max(0, Math.min(y - size / 2, rect.height - size))

    setCropArea({ x: newX, y: newY, size })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* 当前头像或预览 */}
        <div className="relative">
          <Avatar src={preview || currentAvatar} name={name} size="lg" />
          {!showCropper && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
              title="更换头像"
            >
              <Camera size={12} />
            </button>
          )}
        </div>

        {/* 提示文字 */}
        {!showCropper && (
          <div className="text-sm">
            <p style={{ color: 'var(--text-secondary)' }}>点击头像更换</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              支持 JPG、PNG，最大 5MB
            </p>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 简易裁剪界面 */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="p-4 rounded-2xl max-w-md w-full mx-4"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              调整头像
            </h3>

            {/* 图片预览 */}
            <div className="relative mb-4">
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg cursor-crosshair"
                onClick={handleImageClick}
                style={{ backgroundColor: 'var(--bg-hover)' }}
              />
              {/* 裁剪框指示器 */}
              <div
                className="absolute border-2 border-white/80 pointer-events-none"
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.size,
                  height: cropArea.size,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                }}
              />
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              点击图片选择裁剪区域，将以正方形裁剪
            </p>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                <RotateCcw size={14} />
                重置
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={14} />
                取消
              </button>
              <button
                onClick={handleCrop}
                className="btn-primary px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
              >
                <Check size={14} />
                确认裁剪
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 上传按钮 */}
      {preview && !showCropper && (
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="btn-primary text-sm px-3 py-1.5"
          >
            {isUploading ? '上传中...' : '保存头像'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="btn-ghost text-sm px-3 py-1.5"
          >
            取消
          </button>
        </div>
      )}
    </div>
  )
}
