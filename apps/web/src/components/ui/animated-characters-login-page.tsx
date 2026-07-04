'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, CheckCircle2, XCircle, Loader2, AtSign } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

// Instagram-style username rules — mirrored by the API and the DB trigger
const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/

type UsernameStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'reserved'

function validateUsernameFormat(username: string): boolean {
  return (
    USERNAME_REGEX.test(username) &&
    !username.startsWith('.') &&
    !username.endsWith('.') &&
    !username.includes('..')
  )
}

const USERNAME_MESSAGES: Record<UsernameStatus, string> = {
  idle: '',
  invalid: '3–30 characters — lowercase letters, numbers, underscores and periods only',
  checking: 'Checking availability…',
  available: 'Username is available',
  taken: 'This username is already taken',
  reserved: 'This username is not available',
}

interface PupilProps {
  size?: number
  maxDistance?: number
  pupilColor?: string
  forceLookX?: number | undefined
  forceLookY?: number | undefined
  mouseX?: number | undefined
  mouseY?: number | undefined
}

function Pupil({
  size = 12,
  maxDistance = 5,
  pupilColor = 'black',
  forceLookX,
  forceLookY,
  mouseX,
  mouseY,
}: PupilProps) {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 })
  const pupilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        setPupilPos({ x: forceLookX, y: forceLookY })
        return
      }
      if (mouseX === undefined || mouseY === undefined) return
      const el = pupilRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = mouseX - centerX
      const deltaY = mouseY - centerY
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
      const angle = Math.atan2(deltaY, deltaX)
      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      })
    }, 0)
    return () => clearTimeout(id)
  }, [forceLookX, forceLookY, maxDistance, mouseX, mouseY])

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

interface EyeBallProps {
  size?: number
  pupilSize?: number
  maxDistance?: number
  eyeColor?: string
  pupilColor?: string
  isBlinking?: boolean
  forceLookX?: number | undefined
  forceLookY?: number | undefined
  mouseX?: number | undefined
  mouseY?: number | undefined
}

function EyeBall({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = 'white',
  pupilColor = 'black',
  isBlinking = false,
  forceLookX,
  forceLookY,
  mouseX,
  mouseY,
}: EyeBallProps) {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 })
  const eyeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        setPupilPos({ x: forceLookX, y: forceLookY })
        return
      }
      if (mouseX === undefined || mouseY === undefined) return
      const el = eyeRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = mouseX - centerX
      const deltaY = mouseY - centerY
      const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
      const angle = Math.atan2(deltaY, deltaX)
      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      })
    }, 0)
    return () => clearTimeout(id)
  }, [forceLookX, forceLookY, maxDistance, mouseX, mouseY])

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  )
}

interface CharacterPositions {
  purplePos: { faceX: number; faceY: number; bodySkew: number }
  blackPos: { faceX: number; faceY: number; bodySkew: number }
  yellowPos: { faceX: number; faceY: number; bodySkew: number }
  orangePos: { faceX: number; faceY: number; bodySkew: number }
}

const defaultPos: CharacterPositions = {
  purplePos: { faceX: 0, faceY: 0, bodySkew: 0 },
  blackPos: { faceX: 0, faceY: 0, bodySkew: 0 },
  yellowPos: { faceX: 0, faceY: 0, bodySkew: 0 },
  orangePos: { faceX: 0, faceY: 0, bodySkew: 0 },
}

interface AnimatedAuthPageProps {
  mode: 'login' | 'signup'
}

export function AnimatedAuthPage({ mode }: AnimatedAuthPageProps) {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [registered] = useState<boolean>(() => {
    if (typeof window === 'undefined' || mode !== 'login') return false
    return new URLSearchParams(window.location.search).get('registered') === 'true'
  })
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
  const [isBlackBlinking, setIsBlackBlinking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurplePeeking, setIsPurplePeeking] = useState(false)
  const [charPositions, setCharPositions] = useState<CharacterPositions>(defaultPos)
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const purpleRef = useRef<HTMLDivElement>(null)
  const blackRef = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      const calcPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 3
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const faceX = Math.max(-15, Math.min(15, deltaX / 20))
        const faceY = Math.max(-10, Math.min(10, deltaY / 30))
        const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120))
        return { faceX, faceY, bodySkew }
      }
      setCharPositions({
        purplePos: calcPosition(purpleRef),
        blackPos: calcPosition(blackRef),
        yellowPos: calcPosition(yellowRef),
        orangePos: calcPosition(orangeRef),
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true)
        setTimeout(() => {
          setIsPurpleBlinking(false)
          scheduleBlink()
        }, 150)
      }, getRandomBlinkInterval())
      return blinkTimeout
    }
    const timeout = scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true)
        setTimeout(() => {
          setIsBlackBlinking(false)
          scheduleBlink()
        }, 150)
      }, getRandomBlinkInterval())
      return blinkTimeout
    }
    const timeout = scheduleBlink()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => {
      if (isTyping) {
        setIsLookingAtEachOther(true)
        timers.push(setTimeout(() => setIsLookingAtEachOther(false), 800))
      } else {
        setIsLookingAtEachOther(false)
      }
    }, 0))
    return () => timers.forEach(t => clearTimeout(t))
  }, [isTyping])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => {
      if (password.length > 0 && showPassword) {
        timers.push(setTimeout(() => {
          setIsPurplePeeking(true)
          timers.push(setTimeout(() => setIsPurplePeeking(false), 800))
        }, Math.random() * 3000 + 2000))
      } else {
        setIsPurplePeeking(false)
      }
    }, 0))
    return () => timers.forEach(t => clearTimeout(t))
  }, [password, showPassword])

  // Debounced Instagram-style username availability check (signup only)
  useEffect(() => {
    if (mode !== 'signup') return
    let cancelled = false
    const value = username

    const timer = setTimeout(async () => {
      if (cancelled) return
      if (value.length === 0) {
        setUsernameStatus('idle')
        return
      }
      if (!validateUsernameFormat(value)) {
        setUsernameStatus('invalid')
        return
      }
      setUsernameStatus('checking')
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profiles/username-available?username=${encodeURIComponent(value)}`,
        )
        const json = await res.json()
        const result = json?.data?.data ?? json?.data
        if (cancelled) return
        if (result?.available) {
          setUsernameStatus('available')
        } else if (result?.reason === 'reserved') {
          setUsernameStatus('reserved')
        } else if (result?.reason === 'taken') {
          setUsernameStatus('taken')
        } else {
          setUsernameStatus('invalid')
        }
      } catch {
        // API unreachable — don't block signup; the DB trigger enforces uniqueness
        if (!cancelled) setUsernameStatus('idle')
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [username, mode])

  // Clean ?registered=true from the URL after reading it (no setState — state is set via initializer)
  useEffect(() => {
    if (registered) {
      const url = new URL(window.location.href)
      url.searchParams.delete('registered')
      window.history.replaceState({}, '', url.toString())
    }
  }, [registered])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (mode === 'login') {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else {
        router.push('/')
      }
    } else {
      if (!validateUsernameFormat(username)) {
        setError('Please choose a valid username (3–30 characters: lowercase letters, numbers, underscores and periods).')
        setIsLoading(false)
        return
      }
      if (usernameStatus === 'taken' || usernameStatus === 'reserved') {
        setError('That username is not available. Please pick another one.')
        setIsLoading(false)
        return
      }
      const result = await signUp(email, password, displayName || undefined, username)
      if (result.error) {
        setError(result.error)
        setIsLoading(false)
      } else if (result.data?.session) {
        // Email confirmation disabled — session granted immediately, go straight to app
        router.push('/')
      } else {
        // Email confirmation required — ask them to check their inbox
        router.push('/login?registered=true')
      }
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed')
      setGoogleLoading(false)
    }
  }

  const { purplePos, blackPos, yellowPos, orangePos } = charPositions

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Animated Characters */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 text-primary-foreground">
        <div className="relative z-20">
          <div className="flex items-center">
            <Image
              src="/zoikosocial-logo.png"
              alt="ZoikoSocial"
              height={28}
              width={130}
              priority
              className="h-7 w-auto object-contain brightness-0 invert"
            />
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative" style={{ width: '550px', height: '400px' }}>
            {/* Purple tall rectangle character — Back layer */}
            <div
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: isTyping || (password.length > 0 && !showPassword) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '10px 10px 0 0',
                zIndex: 1,
                transform:
                  password.length > 0 && showPassword
                    ? 'skewX(0deg)'
                    : isTyping || (password.length > 0 && !showPassword)
                      ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                      : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? '20px'
                      : isLookingAtEachOther
                        ? '55px'
                        : `${45 + purplePos.faceX}px`,
                  top:
                    password.length > 0 && showPassword
                      ? '35px'
                      : isLookingAtEachOther
                        ? '65px'
                        : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? isPurplePeeking ? 4 : -4
                      : isLookingAtEachOther ? 3 : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? isPurplePeeking ? 5 : -4
                      : isLookingAtEachOther ? 4 : undefined
                  }
                />
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? isPurplePeeking ? 4 : -4
                      : isLookingAtEachOther ? 3 : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? isPurplePeeking ? 5 : -4
                      : isLookingAtEachOther ? 4 : undefined
                  }
                />
              </div>
            </div>

            {/* Black tall rectangle character — Middle layer */}
            <div
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0',
                zIndex: 2,
                transform:
                  password.length > 0 && showPassword
                    ? 'skewX(0deg)'
                    : isLookingAtEachOther
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                      : isTyping || (password.length > 0 && !showPassword)
                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                        : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? '10px'
                      : isLookingAtEachOther
                        ? '32px'
                        : `${26 + blackPos.faceX}px`,
                  top:
                    password.length > 0 && showPassword
                      ? '28px'
                      : isLookingAtEachOther
                        ? '12px'
                        : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther ? 0 : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther ? -4 : undefined
                  }
                />
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther ? 0 : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther ? -4 : undefined
                  }
                />
              </div>
            </div>

            {/* Orange semi-circle character — Front left */}
            <div
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform:
                  password.length > 0 && showPassword
                    ? 'skewX(0deg)'
                    : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? '50px'
                      : `${82 + (orangePos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? '85px'
                      : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
              </div>
            </div>

            {/* Yellow tall rectangle character — Front right */}
            <div
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform:
                  password.length > 0 && showPassword
                    ? 'skewX(0deg)'
                    : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? '20px'
                      : `${52 + (yellowPos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? '35px'
                      : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
                <Pupil
                  size={12}
                  maxDistance={5}
                  pupilColor="#2D2D2D"
                  mouseX={mousePos.x}
                  mouseY={mousePos.y}
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
              </div>
              <div
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? '10px'
                      : `${40 + (yellowPos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? '88px'
                      : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-primary-foreground/60">
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Contact
          </a>
        </div>

        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-12">
            <Image
              src="/zoikosocial-logo.png"
              alt="ZoikoSocial"
              height={32}
              width={140}
              priority
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-on-surface">
              {mode === 'login' ? 'Welcome back!' : 'Create an account'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === 'login'
                ? 'Please enter your details'
                : 'Start connecting with fellow animal lovers'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="off"
                    className="h-12 bg-background border-border/60 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="yourname"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                      autoComplete="off"
                      required
                      maxLength={30}
                      className={`h-12 pl-9 pr-10 bg-background border-border/60 focus:border-primary ${
                        usernameStatus === 'available'
                          ? 'border-green-500 focus:border-green-500'
                          : usernameStatus === 'taken' || usernameStatus === 'reserved' || usernameStatus === 'invalid'
                            ? 'border-red-400 focus:border-red-400'
                            : ''
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                      {usernameStatus === 'available' && <CheckCircle2 className="size-4 text-green-600" />}
                      {(usernameStatus === 'taken' || usernameStatus === 'reserved' || usernameStatus === 'invalid') && (
                        <XCircle className="size-4 text-red-500" />
                      )}
                    </span>
                  </div>
                  {usernameStatus !== 'idle' && (
                    <p
                      className={`text-xs ${
                        usernameStatus === 'available'
                          ? 'text-green-600'
                          : usernameStatus === 'checking'
                            ? 'text-muted-foreground'
                            : 'text-red-500'
                      }`}
                    >
                      {USERNAME_MESSAGES[usernameStatus]}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {mode === 'login' ? 'Email, username or phone' : 'Email'}
              </Label>
              <Input
                id="email"
                type={mode === 'login' ? 'text' : 'email'}
                placeholder={mode === 'login' ? 'Enter your email, username or phone' : 'Enter your email'}
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="h-12 bg-background border-border/60 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min 8 characters)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'signup' ? 8 : undefined}
                  className="h-12 pr-10 bg-background border-border/60 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c === true)} />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember for 30 days
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {registered && (
              <div className="p-4 text-sm text-on-surface bg-surface-container-low border border-primary/30 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Account created successfully!</p>
                  <p className="text-muted-foreground mt-0.5">Check your email to confirm your account, then sign in.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              size="lg"
              disabled={isLoading || (mode === 'signup' && usernameStatus !== 'available' && usernameStatus !== 'idle')}
            >
              {isLoading
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Log in'
                  : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full h-12 bg-background border-border/60 hover:bg-accent"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="mr-2 size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
              ) : (
                <Mail className="mr-2 size-5" />
              )}
              {mode === 'login' ? 'Log in with Google' : 'Sign up with Google'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="text-foreground font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-foreground font-medium hover:underline"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
