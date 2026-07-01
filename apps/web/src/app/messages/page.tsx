'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { ConversationList, type ChatTab } from '@/components/ConversationList'
import { ChatWindow } from '@/components/ChatWindow'

export default function MessagesPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ChatTab>('chats')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const showList = !selectedId
  const showChat = !!selectedId

  return (
    <>
      <Header />
      <main className="pt-16 h-screen bg-background flex flex-col overflow-hidden">
        <div className="flex-1 max-w-container-max w-full mx-auto flex overflow-hidden">

          {/* Conversation list — hidden on mobile when chat is open */}
          <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 flex-col overflow-hidden border-r border-outline-variant/20`}>
            <ConversationList
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Chat window — full width on mobile when open */}
          <div className={`${showList && !showChat ? 'hidden md:flex' : 'flex'} flex-1 overflow-hidden`}>
            <ChatWindow
              conversationId={selectedId}
              onBack={() => setSelectedId(null)}
            />
          </div>
        </div>
      </main>
      <MobileTabs currentPage="messages" onNavigate={() => {}} />
    </>
  )
}
