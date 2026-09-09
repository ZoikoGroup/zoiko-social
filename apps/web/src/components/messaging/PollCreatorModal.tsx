'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface PollCreatorModalProps {
  onClose: () => void
  onSend: (poll: { question: string; options: string[] }) => void
}

export function PollCreatorModal({ onClose, onSend }: PollCreatorModalProps): React.JSX.Element {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, ''])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const isValid = question.trim().length > 0 && options.filter(o => o.trim().length > 0).length >= 2

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 flex-shrink-0">
          <h3 className="text-base font-semibold text-foreground">Create Poll</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="size-8 rounded-full">
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Question</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              maxLength={255}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  maxLength={100}
                />
                {options.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(i)} className="size-8 flex-shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            {options.length < 10 && (
              <Button variant="outline" size="sm" onClick={handleAddOption} className="w-full gap-2 mt-2">
                <Plus className="size-4" /> Add Option
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/20 flex justify-end gap-2 flex-shrink-0 bg-surface-container-lowest">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!isValid}
            onClick={() => {
              if (isValid) {
                onSend({ question: question.trim(), options: options.map(o => o.trim()).filter(Boolean) })
              }
            }}
          >
            Send Poll
          </Button>
        </div>
      </div>
    </div>
  )
}
