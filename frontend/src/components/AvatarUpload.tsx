import { useState, useRef, useCallback, useEffect } from 'react'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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
      setImageLoaded(false)
    }
    reader.readAsDataURL(file)

    // 清空 input 以便重复选择同一文件
    e.target.value = ''
  }

  // 图片加载后初始化裁剪框位置
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    if (imageRef.current && containerRef.current) {
      const imgRect = imageRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      
      // 计算图片在容器中的实际位置和尺寸
      const imgWidth = imageRef.current.offsetWidth
      const imgHeight = imageRef.current.offsetHeight
      const size = Math.min(imgWidth, imgHeight) * 0.8
      
      // 居中裁剪框
      const x = (imgWidth - size) / 2
      const y = (imgHeight - size) / 2
      
      setCropArea({ x, y, size })
    }
  }, [])

  const handleCrop = useCallback(() => {
    if (!imageSrc || !imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight

    // 输出尺寸
    const outputSize = 200
    canvas.width = outputSize
    canvas.height = outputSize

    // 计算裁剪区域（使用 scale 的平均值以保持比例）
    const scale = (scaleX + scaleY) / 2
    const sx = cropArea.x * scaleX
    const sy = cropArea.y * scaleY
    const sSize = cropArea.size * scale

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
    if (imageSrc && imageRef.current) {
      setPreview(imageSrc)
      const imgWidth = imageRef.current.offsetWidth
      const imgHeight = imageRef.current.offsetHeight
      const size = Math.min(imgWidth, imgHeight) * 0.8
      setCropArea({ x: (imgWidth - size) / 2, y: (imgHeight - size) / 2, size })
    }
  }

  // 拖拽裁剪框
  const handleCropAreaMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...cropArea }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!imageRef.current) return
      
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      const imgWidth = imageRef.current.offsetWidth
      const imgHeight = imageRef.current.offsetHeight
      
      // 限制裁剪框在图片范围内
      const newX = Math.max(0, Math.min(startCrop.x + deltaX, imgWidth - startCrop.size))
      const newY = Math.max(0, Math.min(startCrop.y + deltaY, imgHeight - startCrop.size))
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
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

            {/* 图片预览容器 */}
            <div 
              ref={containerRef}
              className="relative mb-4 flex items-center justify-center bg-black rounded-lg overflow-hidden"
              style={{ minHeight: '200px', maxHeight: '300px' }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Preview"
                className="max-w-full max-h-64"
                onLoad={handleImageLoad}
                style={{ display: 'block' }}
              />
              
              {/* 裁剪框 - 只有图片加载后才显示 */}
              {imageLoaded && (
                <>
                  {/* 遮罩层 */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                  />
                  
                  {/* 裁剪框 */}
                  <div
                    className="absolute border-2 border-white cursor-move"
                    style={{
                      left: cropArea.x,
                      top: cropArea.y,
                      width: cropArea.size,
                      height: cropArea.size,
                      boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                    }}
                    onMouseDown={handleCropAreaMouseDown}
                  >
                    {/* 网格线 */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                      <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                      <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <p className="text-xs mb-4 text-center" style={{ color: 'var(--text-muted)' }}>
              拖拽方框调整裁剪区域
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
