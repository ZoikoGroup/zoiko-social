'use client'

import { Search, Users, Radio } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

export type ChatTab = 'chats' | 'groups' | 'communities'

interface Conversation {
  id: string
  name: string
  lastMessage: string
  time: string
  unread?: number
  online?: boolean
  verified?: boolean
  type: 'dm' | 'group' | 'community'
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Dr. Sarah Vance',       lastMessage: "I'll send the lab results shortly.",          time: '2m',   unread: 3, online: true,  verified: true,  type: 'dm'        },
  { id: '2', name: 'Mark Thompson',         lastMessage: 'Great session yesterday with Bruno!',          time: '15m',  unread: 0, online: false, verified: false, type: 'dm'        },
  { id: '3', name: 'Emergency Rescuers',    lastMessage: 'Ravi: Urgent — found 3 kittens near the …',   time: '1h',   unread: 7, online: false, verified: true,  type: 'group'     },
  { id: '4', name: 'Vet Professionals SG',  lastMessage: 'You: Thanks for the article link!',            time: '3h',   unread: 0, online: false, verified: false, type: 'group'     },
  { id: '5', name: 'Pet Care Updates',      lastMessage: 'New post: Heatstroke prevention guide…',      time: 'Yesterday', unread: 1, online: false, verified: true, type: 'community' },
  { id: '6', name: 'Holistic Nutrition',    lastMessage: 'Weekly digest: 5 new resources shared',       time: 'Yesterday', unread: 0, online: false, verified: false, type: 'community' },
  { id: '7', name: 'Elena Vasquez',         lastMessage: 'Can we schedule a call this week?',            time: '2d',   unread: 0, online: true,  verified: true,  type: 'dm'        },
  { id: '8', name: 'K9 Handlers Network',   lastMessage: 'James: Event this Sunday at Orchard Park',    time: '2d',   unread: 0, online: false, verified: false, type: 'group'     },
]

const TAB_ICONS = {
  chats:       null,
  groups:      Users,
  communities: Radio,
}

interface ConversationListProps {
  activeTab: ChatTab
  onTabChange: (tab: ChatTab) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ activeTab, onTabChange, selectedId, onSelect }: ConversationListProps): React.JSX.Element {
  const filtered = CONVERSATIONS.filter((c) => {
    if (activeTab === 'chats')       return c.type === 'dm'
    if (activeTab === 'groups')      return c.type === 'group'
    if (activeTab === 'communities') return c.type === 'community'
    return true
  })

  const TABS: { id: ChatTab; label: string }[] = [
    { id: 'chats',       label: 'Chats'       },
    { id: 'groups',      label: 'Groups'      },
    { id: 'communities', label: 'Communities' },
  ]

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border-r border-outline-variant/20">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant/20">
        <h2 className="font-headline text-headline-md text-on-surface mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
          <input
            placeholder="Search conversations…"
            className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg text-label-md border border-transparent focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/20">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-label-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-outline text-label-md">No {activeTab} yet.</div>
        ) : (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10 transition-colors cursor-pointer text-left ${
                selectedId === conv.id ? 'bg-primary/5' : 'hover:bg-surface-container'
              }`}
            >
              <div className="relative flex-shrink-0">
                <UserAvatar name={conv.name} size="md" verified={conv.verified} />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-label-md truncate ${conv.unread ? 'font-bold text-on-surface' : 'font-semibold text-on-surface'}`}>
                    {conv.name}
                  </p>
                  <span className="text-[10px] text-outline flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-outline truncate">{conv.lastMessage}</p>
                  {conv.unread ? (
                    <span className="flex-shrink-0 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
