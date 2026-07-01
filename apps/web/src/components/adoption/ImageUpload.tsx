'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, AlertCircle } from 'lucide-react'

export interface ImageFile {
  file: File
  preview: string
  id: string
}

interface ImageUploadProps {
  images: ImageFile[]
  onChange: (images: ImageFile[]) => void
  maxImages?: number
  accept?: string
  label?: string
  error?: string | undefined
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  accept = 'image/jpeg,image/png,image/webp',
  label = 'Upload Photos',
  error,
}: ImageUploadProps): React.JSX.Element {
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback(
    (files: FileList) => {
      setUploadError(null)
      const remaining = maxImages - images.length
      if (files.length > remaining) {
        setUploadError(`You can only upload ${remaining} more image(s)`)
        return
      }

      const newImages: ImageFile[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]!
        if (!file.type.startsWith('image/')) {
          setUploadError(`${file.name} is not a valid image`)
          continue
        }
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`${file.name} exceeds 10MB limit`)
          continue
        }
        const id = `${Date.now()}-${i}`
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id,
        })
      }
      onChange([...images, ...newImages])
    },
    [images, maxImages, onChange],
  )

  function handleDrop(e: React.DragEvent): void {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  function handleDragOver(e: React.DragEvent): void {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(): void {
    setDragOver(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    e.target.value = ''
  }

  function removeImage(id: string): void {
    const img = images.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.preview)
    onChange(images.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-3">
      <label className="text-label-md font-semibold text-on-surface">
        {label}
        {maxImages > 0 && (
          <span className="text-outline font-normal ml-1">
            ({images.length}/{maxImages})
          </span>
        )}
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className={`w-6 h-6 ${dragOver ? 'text-primary' : 'text-primary'}`} />
          </div>
          <div>
            <p className="text-label-md font-semibold text-on-surface">
              {dragOver ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-label-sm text-outline mt-1">
              or click to browse — JPG, PNG, WEBP (max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Validation errors */}
      {(uploadError || error) && (
        <div className="flex items-center gap-2 text-label-sm text-error bg-error-container/20 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError ?? error}</span>
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-low"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.preview}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-primary/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
