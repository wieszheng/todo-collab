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

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImageSrc(result)
      setShowCropper(true)
      // 重置裁剪区域，等图片加载后再设置
      setCropArea({ x: 0, y: 0, size: 100 })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return
    
    const img = imageRef.current
    const imgWidth = img.offsetWidth
    const imgHeight = img.offsetHeight
    const size = Math.min(imgWidth, imgHeight) * 0.8
    
    // 居中裁剪框
    const x = (imgWidth - size) / 2
    const y = (imgHeight - size) / 2
    
    setCropArea({ x, y, size })
  }, [])

  const handleCrop = useCallback(() => {
    if (!imageSrc || !imageRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = imageRef.current
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight

    const outputSize = 200
    canvas.width = outputSize
    canvas.height = outputSize

    const sx = cropArea.x * scaleX
    const sy = cropArea.y * scaleY
    const sSize = cropArea.size * ((scaleX + scaleY) / 2)

    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize)

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9)
    setPreview(croppedBase64)
    setShowCropper(false)
    setImageSrc(null)
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
    if (imageRef.current) {
      const imgWidth = imageRef.current.offsetWidth
      const imgHeight = imageRef.current.offsetHeight
      const size = Math.min(imgWidth, imgHeight) * 0.8
      setCropArea({ x: (imgWidth - size) / 2, y: (imgHeight - size) / 2, size })
    }
  }

  const handleCropAreaMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!imageRef.current) return
    
    const startX = e.clientX
    const startY = e.clientY
    const startCrop = { ...cropArea }
    const imgWidth = imageRef.current.offsetWidth
    const imgHeight = imageRef.current.offsetHeight

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      const newX = Math.max(0, Math.min(startCrop.x + deltaX, imgWidth - startCrop.size))
      const newY = Math.max(0, Math.min(startCrop.y + deltaY, imgHeight - startCrop.size))
      
      setCropArea({ x: newX, y: newY, size: startCrop.size })
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

        {!showCropper && (
          <div className="text-sm">
            <p style={{ color: 'var(--text-secondary)' }}>点击头像更换</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              支持 JPG、PNG，最大 5MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 裁剪弹窗 */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="p-4 rounded-2xl max-w-md w-full mx-4"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              调整头像
            </h3>

            {/* 图片裁剪区域 */}
            <div className="relative mb-4 bg-black rounded-lg overflow-hidden" style={{ height: '280px' }}>
              {/* 图片容器 - 使用绝对定位让图片和裁剪框在同一坐标系 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative inline-block">
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '280px',
                      display: 'block'
                    }}
                    onLoad={handleImageLoad}
                  />
                  
                  {/* 裁剪框 - 相对于图片定位 */}
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
                </div>
              </div>
            </div>

            <p className="text-xs mb-4 text-center" style={{ color: 'var(--text-muted)' }}>
              拖拽方框调整裁剪区域
            </p>

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
