'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Listing creation now happens via the "List a pet" modal on /adoption.
export default function AdoptionNewRedirect(): React.JSX.Element {
  const router = useRouter()
  useEffect(() => { router.replace('/adoption') }, [router])
  return <div className="min-h-screen bg-background" />
}
