'use client'

import { useState } from 'react'
import { Send, Paperclip, Smile, Phone, Video, MoreHorizontal, ArrowLeft, Info, UserPlus, Bell, LogOut, Shield } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

interface Message {
  id: string
  sender: string
  text: string
  time: string
  isMine: boolean
}

const MESSAGES: Message[] = [
  { id: '1', sender: 'Dr. Sarah Vance', text: "Hi Alex! Just checking in — how is Luna doing after the dietary switch?",              time: '9:41 AM', isMine: false },
  { id: '2', sender: 'Me',             text: "She's doing so much better! The coat looks healthier already after just two weeks.",    time: '9:43 AM', isMine: true  },
  { id: '3', sender: 'Dr. Sarah Vance', text: "That's wonderful to hear. The omega-3 supplement should really help with the shedding too.", time: '9:44 AM', isMine: false },
  { id: '4', sender: 'Me',             text: "Yes I noticed that too. When should I schedule her next check-up?",                     time: '9:45 AM', isMine: true  },
  { id: '5', sender: 'Dr. Sarah Vance', text: "I'll send the lab results shortly and we can book from there. Looking good overall!",   time: '9:48 AM', isMine: false },
]

interface ChatWindowProps {
  conversationId: string | null
  onBack?: () => void
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps): React.JSX.Element {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(MESSAGES)
  const [showInfo, setShowInfo] = useState(false)

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low text-center p-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Send className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-headline text-headline-md text-on-surface mb-2">Your messages</h3>
        <p className="text-label-md text-outline max-w-xs">Select a conversation to start messaging, or connect with professionals in your network.</p>
      </div>
    )
  }

  function sendMessage(): void {
    if (!input.trim()) return
    setMessages((prev) => [...prev, {
      id: String(prev.length + 1),
      sender: 'Me',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    }])
    setInput('')
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/20 flex-shrink-0">
          {onBack && (
            <button onClick={onBack} className="mr-1 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <UserAvatar name="Dr. Sarah Vance" size="md" verified />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-label-md text-on-surface">Dr. Sarah Vance</p>
            <p className="text-[11px] text-green-600 font-medium">Active now</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowInfo((s) => !s)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${showInfo ? 'text-primary bg-primary/10' : 'text-outline hover:text-on-surface hover:bg-surface-container'}`}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} gap-2`}>
              {!msg.isMine && <UserAvatar name={msg.sender} size="sm" className="mt-auto flex-shrink-0" />}
              <div className={`max-w-[72%] ${msg.isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-label-md leading-relaxed ${
                  msg.isMine
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-surface-container text-on-surface rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-outline px-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 bg-surface-container-lowest border-t border-outline-variant/20 flex items-end gap-3 flex-shrink-0">
          <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Type a message…"
              rows={1}
              className="w-full px-4 py-2.5 bg-surface-container rounded-xl text-label-md border border-transparent focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
          <button className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer flex-shrink-0">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="w-72 flex-shrink-0 border-l border-outline-variant/20 bg-surface-container-lowest overflow-y-auto">
          <div className="p-5 flex flex-col items-center text-center border-b border-outline-variant/20">
            <UserAvatar name="Dr. Sarah Vance" size="xl" verified />
            <h3 className="font-headline text-headline-md text-on-surface mt-3">Dr. Sarah Vance</h3>
            <p className="text-label-sm text-outline mt-0.5">Veterinary Surgeon · Paws Clinic</p>
            <p className="text-[11px] text-green-600 font-medium mt-1">Active now</p>
          </div>
          <div className="p-4 space-y-1">
            {[
              { Icon: UserPlus,  label: 'View profile'       },
              { Icon: Bell,      label: 'Mute notifications' },
              { Icon: Shield,    label: 'Block contact'      },
              { Icon: LogOut,    label: 'Delete conversation', danger: true },
            ].map(({ Icon, label, danger }) => (
              <button key={label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-label-md transition-colors cursor-pointer ${danger ? 'text-red-500 hover:bg-red-50' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
