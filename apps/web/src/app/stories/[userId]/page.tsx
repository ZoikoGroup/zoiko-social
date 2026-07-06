'use client'

import { useParams, useRouter } from 'next/navigation'
import { StoryViewer } from '@/components/stories/StoryViewer'

export default function StoryViewerPage(): React.JSX.Element {
  const params = useParams<{ userId: string }>()
  const router = useRouter()

  if (!params?.userId) return <></>

  return (
    <StoryViewer
      initialAuthorId={params.userId}
      onClose={() => router.back()}
    />
  )
}
