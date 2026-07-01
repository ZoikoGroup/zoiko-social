'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
        {/* Back button for mobile */}
        <div className="md:hidden flex items-center gap-2 px-margin-mobile py-2 border-b border-outline-variant/20 bg-surface-container-lowest">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <span className="text-label-md font-semibold text-on-surface">Messages</span>
        </div>
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
