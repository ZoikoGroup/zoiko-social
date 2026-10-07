'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import { ConnectedConversationList, type ChatTab } from '@/components/messaging/ConnectedConversationList'
import { MessageConversation } from '@/components/messaging/MessageConversation'
import { NewMessageModal } from '@/components/messaging/NewMessageModal'
import { useAuth } from '@/hooks/use-auth'
import { useMessaging } from '@/hooks/use-messaging'
import { useTranslations } from 'next-intl'


export default function MessagesPage(): React.JSX.Element {
  const t = useTranslations('messaging')
  const { isAuthenticated } = useAuth()
  const { conversations, unreadCount, setActiveConversationId, openConversation } = useMessaging()
  const [activeTab, setActiveTab] = useState<ChatTab>('all')
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('conversation')
    }
    return null
  })
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [taggedProduct, setTaggedProduct] = useState<{ id: string; title: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search)
      const productId = p.get('productId')
      const productTitle = p.get('productTitle')
      if (productId) {
        return { id: productId, title: productTitle ? decodeURIComponent(productTitle) : 'Product Inquiry' }
      }
    }
    return null
  })

  // Handle URL query params for deep linking (conversation ID or user ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const convId = params.get('conversation')
    const userId = params.get('user')
    const prodId = params.get('productId')
    const prodTitle = params.get('productTitle')

    if (prodId && (!taggedProduct || taggedProduct.id !== prodId)) {
      const timer = setTimeout(() => {
        setTaggedProduct({ id: prodId, title: prodTitle ? decodeURIComponent(prodTitle) : 'Product Inquiry' })
      }, 0)
      return () => clearTimeout(timer)
    }

    if (convId && convId !== selectedId) {
      const timer = setTimeout(() => setSelectedId(convId), 0)
      return () => clearTimeout(timer)
    } else if (userId) {
      // Auto-open or create conversation with the specified user
      openConversation(userId).then((createdConvId) => {
        if (createdConvId) {
          setSelectedId(createdConvId)
          const url = new URL(window.location.href)
          url.searchParams.delete('user')
          url.searchParams.set('conversation', createdConvId)
          window.history.replaceState({}, '', url.toString())
        }
      }).catch((e) => console.warn('Failed to open conversation with user', e))
    }
    return undefined
  }, [openConversation, selectedId, taggedProduct])

  // Set conversation as read when selected
  useEffect(() => {
    if (selectedId) {
      setActiveConversationId(selectedId)
    }
  }, [selectedId, setActiveConversationId])

  // Show loading state
  useEffect(() => {
    if (!isAuthenticated) return
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [isAuthenticated])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    // Update URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.set('conversation', id)
    window.history.replaceState({}, '', url.toString())
  }, [])

  const handleBack = useCallback(() => {
    setSelectedId(null)
    setActiveConversationId(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('conversation')
    window.history.replaceState({}, '', url.toString())
  }, [setActiveConversationId])

  const currentConversation = selectedId ? conversations.find((c) => c.id === selectedId) ?? null : null

  const showList = !selectedId
  const showChat = !!selectedId

  return (
    <>
      <div className={showChat ? 'hidden md:block' : ''}>
        <Header />
      </div>
      <main className={`${showChat ? 'pt-0 md:pt-16' : 'pt-16'} h-dvh bg-background flex flex-col overflow-hidden`}>
        {/* Mobile header — only show when viewing conversation list */}
        {showList && (
          <div className="md:hidden flex items-center gap-2 px-margin-mobile py-2.5 border-b border-outline-variant/20 bg-surface-container-lowest flex-shrink-0">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              aria-label={t('backToHome')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-label-md font-semibold text-on-surface">{t('title')}</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 max-w-container-max w-full mx-auto flex overflow-hidden">
          {/* Conversation list — full width on mobile, sidebar on desktop */}
          <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 flex-col overflow-hidden md:border-r md:border-outline-variant/20`}>
            <ConnectedConversationList
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedId={selectedId}
              onSelect={handleSelect}
              onNewMessage={() => setNewMessageOpen(true)}
              unreadCount={unreadCount}
            />
          </div>

          {/* Chat window — full width on mobile, flex on desktop */}
          <div className={`${showList && !showChat ? 'hidden md:flex' : 'flex'} flex-1 overflow-hidden`}>
            <MessageConversation
              conversationId={selectedId}
              onBack={handleBack}
              conversation={currentConversation}
              onNewMessage={() => setNewMessageOpen(true)}
              taggedProduct={taggedProduct}
              onClearTaggedProduct={() => {
                setTaggedProduct(null)
                const url = new URL(window.location.href)
                url.searchParams.delete('productId')
                url.searchParams.delete('productTitle')
                window.history.replaceState({}, '', url.toString())
              }}
            />
          </div>
        </div>
      </main>

      {/* Mobile tabs — hidden when viewing a chat on mobile/tablet */}
      <div className={showChat ? 'hidden md:block' : ''}>
        <MobileTabs currentPage="messages" onNavigate={() => {}} />
      </div>

      {/* New Message Modal */}
      <NewMessageModal open={newMessageOpen} onClose={() => setNewMessageOpen(false)} />

      {/* Loading overlay for initial load */}
      {loading && (
        <div className="fixed inset-0 z-40 bg-surface-container-lowest flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
    </>
  )
}
