import { useRef } from 'react'
import { Paperclip } from 'lucide-react'
import { Button } from './Button'

interface FileInputProps {
  label: string
  accept: string
  fileName?: string
  onFileSelected: (fileName: string) => void
}

export function FileInput({ label, accept, fileName, onFileSelected }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelected(file.name)
        }}
      />
      <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
        <Paperclip size={14} />
        {label}
      </Button>
      {fileName && <span className="truncate text-xs text-text-muted">{fileName}</span>}
    </div>
  )
}
