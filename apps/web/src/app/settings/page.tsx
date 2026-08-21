'use client'

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Shield, Lock, Bell, User, Sliders, HelpCircle, LogOut, Globe, Eye, Smartphone, Key, Fingerprint, Mail, CreditCard, Users, Trash2, EyeOff, ExternalLink, ChevronDown, Loader2, Sun, Moon, Monitor, UserX, VolumeX, BadgeCheck } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/use-auth'
import { useCurrency } from '@/hooks/use-currency'
import { useToast } from '@/hooks/use-toast'
import { CURRENCIES } from '@/lib/currency'
import { authApi, profileApi, settingsApi, networkApi, type UserSettings, type UpdateSettingsInput, type BlockedUserItem, type MutedUserItem } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { validatePassword, PASSWORD_MIN, PASSWORD_MAX, PASSWORD_HINT } from '@/lib/password-policy'
import { isValidEmail, EMAIL_INVALID_MESSAGE } from '@/lib/email'
import { DocsHelpLink } from '@/components/DocsHelpLink'
import { VerificationSettings } from '@/components/settings/VerificationSettings'
import { MessagingPrivacySettings } from '@/components/settings/MessagingPrivacySettings'
import { LanguageSwitcher } from '@/components/settings/LanguageSwitcher'
import { useDateFormat } from '@/hooks/use-date-format'
import { PushNotificationSettings } from '@/components/settings/PushNotificationSettings'

type SettingsTab =
  | 'account'
  | 'privacy'
  | 'blocked'
  | 'verification'
  | 'security'
  | 'notifications'
  | 'preferences'
  | 'help'

// Label and description come from the catalog at render time, keyed by id.
interface SettingsSection {
  id: SettingsTab
  icon: typeof User
}

const SECTIONS: SettingsSection[] = [
  { id: 'account',       icon: User },
  { id: 'privacy',       icon: Lock },
  { id: 'blocked',       icon: UserX },
  { id: 'verification',  icon: BadgeCheck },
  { id: 'security',      icon: Shield },
  { id: 'notifications', icon: Bell },
  { id: 'preferences',   icon: Sliders },
  { id: 'help',          icon: HelpCircle },
]

// Where each tab's matching Help Center article lives. 'help' is omitted —
// that tab already links out to the Help Center itself (see HelpSettings).
const SECTION_DOCS_LINK: Partial<Record<SettingsTab, string>> = {
  account: '/docs/profile-and-pets#your-profile',
  privacy: '/docs/notifications-and-settings#privacy-settings',
  blocked: '/docs/safety-and-trust#blocking-and-muting',
  verification: '/docs/safety-and-trust#verified-accounts',
  security: '/docs/notifications-and-settings#security',
  notifications: '/docs/notifications-and-settings#notification-preferences',
  preferences: '/docs/notifications-and-settings#preferences',
}

// ── ACCOUNT ─────────────────────────────────────────────────

function AccountSettings({ autoOpenPassword = false, onAutoOpenHandled }: {
  autoOpenPassword?: boolean
  onAutoOpenHandled?: () => void
} = {}): React.JSX.Element {
  const t = useTranslations('settings')
  const { profile, user, updateEmail, changePassword, signOut } = useAuth()
  // Deactivation revokes sessions, so this should normally be 'active' whenever
  // settings is reachable. Read anyway: an access token outlives the revoke, and
  // offering "disable" on an already-disabled account is how the loop appeared.
  const isDeactivated = profile?.state === 'deactivated'
  const isPendingDeletion = profile?.state === 'pending_deletion'

  // ── Delete state
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const [deactivateError, setDeactivateError] = useState<string | null>(null)

  // ── Temporarily disable
  const handleDeactivate = async (): Promise<void> => {
    setDeactivating(true)
    setDeactivateError(null)
    try {
      await profileApi.deactivate()
      // Revoking server-side only kills the refresh token; the access token in
      // this browser stays valid until it expires, so without clearing the local
      // session the visitor still looks signed in, can walk back into settings,
      // and is offered "Temporarily Disable" on an account that is already
      // disabled. signOut also drops the socket and the cached profile.
      await signOut()
      window.location.href = '/'
    } catch (err) {
      setDeactivateError(err instanceof Error ? err.message : 'Failed to disable account')
    } finally {
      setDeactivating(false)
    }
  }

  // ── Email change state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  // ── Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(autoOpenPassword)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordDone, setPasswordDone] = useState(false)

  const displayName = profile?.displayName ?? ''
  const email = user?.email ?? ''
  const initials = displayName
    ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (email[0] ?? '?').toUpperCase()

  // ── Delete
  const handleDeleteAccount = async (): Promise<void> => {
    if (deleteConfirmText !== profile?.username) {
      setDeleteError('Please type your username to confirm')
      return
    }
    setDeleting(true)
    setDeleteError(null)
    try {
      await profileApi.deleteAccount()
      window.location.href = '/'
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  // ── Email change
  const handleEmailChange = async (): Promise<void> => {
    const trimmed = newEmail.trim()
    // Was only checking for an "@", so "a@b" passed and the confirmation mail
    // could never arrive.
    if (!isValidEmail(trimmed)) {
      setEmailError(EMAIL_INVALID_MESSAGE)
      return
    }
    if (trimmed === email) {
      setEmailError('New email is the same as your current email')
      return
    }
    if (!emailPassword) {
      setEmailError('Please enter your current password to confirm')
      return
    }
    setEmailSaving(true)
    setEmailError(null)

    // Re-authenticate first, then update email
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: emailPassword,
    })
    if (signInError) {
      setEmailError('Current password is incorrect')
      setEmailSaving(false)
      return
    }

    const result = await updateEmail(trimmed)
    if (result.error) {
      setEmailError(result.error)
      setEmailSaving(false)
      return
    }

    setEmailSent(true)
    setEmailSaving(false)
  }

  // ── Password change
  const handlePasswordChange = async (): Promise<void> => {
    if (!currentPassword) {
      setPasswordError('Please enter your current password')
      return
    }
    const policyError = validatePassword(newPassword)
    if (policyError) {
      setPasswordError(policyError)
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    setPasswordSaving(true)
    setPasswordError(null)

    // Re-authenticate with current password
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    })
    if (signInError) {
      setPasswordError('Current password is incorrect')
      setPasswordSaving(false)
      return
    }

    const result = await changePassword(newPassword)
    if (result.error) {
      setPasswordError(result.error)
      setPasswordSaving(false)
      return
    }

    setPasswordDone(true)
    setPasswordSaving(false)
  }

  // ── Shared modal backdrop click
  const closeAllModals = (): void => {
    onAutoOpenHandled?.()
    setShowDeleteConfirm(false)
    setShowDeactivateConfirm(false)
    setShowEmailModal(false)
    setShowPasswordModal(false)
  }

  return (
    <div className="space-y-5">
      {/* Profile photo */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-outline-variant flex-shrink-0 overflow-hidden">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-label-md font-bold text-on-surface">{displayName}</p>
          <p className="text-[11px] text-outline">@{profile?.username}</p>
        </div>
      </div>

      {/* Profile info */}
      <div className="space-y-3">
        <div>
          <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Display Name</label>
          <p className="px-3.5 py-2.5 bg-surface-container-low rounded-lg text-label-md">{displayName || 'Not set'}</p>
        </div>

        {/* Email — clickable to change */}
        <button
          onClick={() => { setShowEmailModal(true); setNewEmail(''); setEmailPassword(''); setEmailError(null); setEmailSent(false) }}
          className="w-full text-left cursor-pointer group"
        >
          <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Email Address</label>
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-container-low rounded-lg text-label-md group-hover:bg-surface-container transition-colors">
            <span>{email}</span>
            <span className="text-[11px] text-primary font-semibold">Change</span>
          </div>
        </button>

        <div>
          <label className="block text-label-sm font-semibold text-on-surface mb-1.5">Bio</label>
          <p className="px-3.5 py-2.5 bg-surface-container-low rounded-lg text-label-md text-outline">{profile?.bio || 'No bio yet'}</p>
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Password card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-label-md font-semibold text-on-surface">Password</h4>
              <p className="text-[11px] text-outline">Change your account password</p>
            </div>
          </div>
          <button
            onClick={() => { setShowPasswordModal(true); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordError(null); setPasswordDone(false) }}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Danger zone */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
        <h4 className="text-label-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h4>
        <p className="text-[11px] text-red-500 dark:text-red-400/70 mb-3">
          Take a break by hiding your account, or schedule it for deletion. Both are reversible by signing back in.
        </p>
        {/* Says what the account already is instead of offering the same action
            again. Signing in is what restores it, so there is nothing to press
            here — an enabled "Temporarily Disable" on a disabled account only
            invites a second attempt the guard would reject. */}
        {(isDeactivated || isPendingDeletion) && (
          <p className="mb-3 text-[11px] font-semibold text-red-600 dark:text-red-400">
            {isDeactivated
              ? t('account.alreadyDisabled')
              : t('account.pendingDeletion')}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {!isDeactivated && !isPendingDeletion && (
            <button
              onClick={() => { setShowDeactivateConfirm(true); setDeactivateError(null) }}
              className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-label-sm font-semibold hover:bg-surface-container transition-colors cursor-pointer"
            >
              Temporarily Disable
            </button>
          )}
          <button
            onClick={() => { setShowDeleteConfirm(true); setDeleteError(null); setDeleteConfirmText('') }}
            className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-label-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ── MODAL: Temporarily disable ── */}
      {showDeactivateConfirm && (
        <ModalOverlay onClose={closeAllModals}>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4">
            <EyeOff className="w-6 h-6 text-on-surface-variant" />
          </div>
          <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Temporarily Disable Account?</h3>
          <p className="text-label-sm text-outline text-center mb-2">
            Your profile, posts, comments and pets will be hidden until you come back. Nothing is deleted.
          </p>
          <p className="text-label-sm text-outline text-center mb-5">
            You&apos;ll be signed out on every device. <strong className="text-on-surface">Sign in again</strong> whenever
            you want your account back.
          </p>
          {deactivateError && <p className="text-[11px] text-red-500 mb-3 text-center">{deactivateError}</p>}
          <div className="flex gap-3">
            <button onClick={closeAllModals} className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">Cancel</button>
            <button
              onClick={() => void handleDeactivate()}
              disabled={deactivating}
              className="flex-1 px-4 py-2.5 rounded-xl bg-on-surface text-surface-container-lowest text-label-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deactivating ? <><Loader2 className="w-4 h-4 animate-spin" /> Disabling…</> : 'Disable Account'}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* ── MODAL: Delete confirmation ── */}
      {showDeleteConfirm && (
        <ModalOverlay onClose={closeAllModals}>
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Delete Your Account?</h3>
          <p className="text-label-sm text-outline text-center mb-2">
            Your account will be hidden straight away and permanently deleted in{' '}
            <strong className="text-on-surface">30 days</strong>, along with your profile, posts and messages.
          </p>
          <p className="text-label-sm text-outline text-center mb-5">
            <strong className="text-on-surface">Changed your mind?</strong> Just sign back in before then and
            nothing is lost.
          </p>
          <div className="space-y-1 mb-5">
            <p className="text-label-sm font-semibold text-on-surface">
              Type <span className="font-mono text-red-600 dark:text-red-400">{profile?.username}</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(null) }}
              placeholder="Enter your username"
              autoFocus
              className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-red-500 focus:outline-none rounded-lg text-label-md transition-all"
            />
          </div>
          {deleteError && <p className="text-[11px] text-red-500 mb-3 text-center">{deleteError}</p>}
          <div className="flex gap-3">
            <button onClick={closeAllModals} className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">Cancel</button>
            <button
              onClick={() => void handleDeleteAccount()}
              disabled={deleting || deleteConfirmText !== profile?.username}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-label-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling…</> : 'Schedule Deletion'}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* ── MODAL: Change email ── */}
      {showEmailModal && (
        <ModalOverlay onClose={closeAllModals}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          {emailSent ? (
            <>
              <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Confirmation Sent</h3>
              <p className="text-label-sm text-outline text-center mb-5">
                We sent a confirmation email to <strong className="text-on-surface">{newEmail.trim()}</strong>. Please check your inbox and click the link to complete the change. A notification was also sent to your current address.
              </p>
              <button onClick={closeAllModals} className="w-full px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Done</button>
            </>
          ) : (
            <>
              <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Change Email Address</h3>
              <p className="text-label-sm text-outline text-center mb-5">Enter your new email and confirm with your current password.</p>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">Current Email</label>
                  <p className="px-3.5 py-2.5 bg-surface-container-low rounded-lg text-label-md">{email}</p>
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">New Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setEmailError(null) }}
                    placeholder="new@example.com"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">Current Password</label>
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => { setEmailPassword(e.target.value); setEmailError(null) }}
                    placeholder="Enter your current password"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
                  />
                </div>
              </div>
              {emailError && <p className="text-[11px] text-red-500 mb-3 text-center">{emailError}</p>}
              <div className="flex gap-3">
                <button onClick={closeAllModals} className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">Cancel</button>
                <button
                  onClick={() => void handleEmailChange()}
                  disabled={emailSaving || !newEmail.trim() || !emailPassword}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {emailSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Confirmation'}
                </button>
              </div>
            </>
          )}
        </ModalOverlay>
      )}

      {/* ── MODAL: Change password ── */}
      {showPasswordModal && (
        <ModalOverlay onClose={closeAllModals}>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          {passwordDone ? (
            <>
              <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Password Changed</h3>
              <p className="text-label-sm text-outline text-center mb-5">Your password has been updated successfully.</p>
              <button onClick={closeAllModals} className="w-full px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">Done</button>
            </>
          ) : (
            <>
              <h3 className="text-label-lg font-bold text-on-surface text-center mb-2">Change Password</h3>
              <p className="text-label-sm text-outline text-center mb-5">Enter your current password and a new password.</p>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(null) }}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null) }}
                    minLength={PASSWORD_MIN}
                    maxLength={PASSWORD_MAX}
                    placeholder={`${PASSWORD_MIN}–${PASSWORD_MAX} characters`}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
                  />
                  {/* Stated up front rather than only on failure — the rules were
                      previously invisible until a submit was rejected. */}
                  <p className="mt-1 text-[11px] text-outline">{PASSWORD_HINT}</p>
                </div>
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null) }}
                    minLength={PASSWORD_MIN}
                    maxLength={PASSWORD_MAX}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
                  />
                </div>
              </div>
              {passwordError && <p className="text-[11px] text-red-500 mb-3 text-center">{passwordError}</p>}
              <div className="flex gap-3">
                <button onClick={closeAllModals} className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant/50 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">Cancel</button>
                <button
                  onClick={() => void handlePasswordChange()}
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : 'Update Password'}
                </button>
              </div>
            </>
          )}
        </ModalOverlay>
      )}
    </div>
  )
}

// ── Reusable modal overlay ─────────────────────────────────

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ── SHARED SETTINGS HOOK ────────────────────────────────────

interface SettingsContextValue {
  settings: UserSettings | null
  loading: boolean
  patch: (update: UpdateSettingsInput) => void
}

/** Shared settings state lifted to the parent so Privacy + Notifications share one fetch + debounce. */
function useSharedSettings(): SettingsContextValue {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<UpdateSettingsInput>({})
  const mountedRef = useRef(true)

  // Fetch on mount
  useEffect(() => {
    mountedRef.current = true
    settingsApi.get()
      .then((s) => {
        if (mountedRef.current) setSettings(s)
      })
      .catch(() => { /* leave default null state */ })
      .finally(() => {
        if (mountedRef.current) setLoading(false)
      })
    return () => {
      mountedRef.current = false
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const patch = useCallback((update: UpdateSettingsInput) => {
    // Merge into pending accumulator so rapid toggles don't overwrite each other
    Object.assign(pendingRef.current, update)

    // Optimistically update local state from the full pending set
    setSettings((prev) => {
      if (!prev) return prev
      return { ...prev, ...pendingRef.current }
    })

    // Debounce save — flush the full accumulator on timer fire
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const merged = { ...pendingRef.current }
      pendingRef.current = {}
      try {
        await settingsApi.update(merged)
      } catch {
        // Silently fail — the UI stays optimistic
      }
      timerRef.current = null
    }, 800)
  }, [])

  return { settings, loading, patch }
}

// ── PRIVACY ──────────────────────────────────────────────────

function PrivacySettings({ settings, loading, patch }: SettingsContextValue): React.JSX.Element {
  const { profile } = useAuth()
  // Only the pending local choice is stored; the profile is the source of truth
  // until the member changes it. Deriving avoids syncing a prop into state.
  const [pendingVisibility, setPendingVisibility] = useState<string | null>(null)
  const profileVisibility = pendingVisibility ?? (profile?.isPrivate ? 'private' : 'public')
  const setProfileVisibility = setPendingVisibility

  const handleProfileVisibilityChange = (value: string): void => {
    setProfileVisibility(value)
    // Persist private/public immediately via profile API
    void profileApi.update({ isPrivate: value === 'private' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-outline" />
      </div>
    )
  }

  const toggles = settings ?? {
    showLastActive: true,
    showEmail: false,
    allowTagging: true,
    showLocation: false,
    allowMessaging: 'everyone' as const,
  }

  return (
    <div className="space-y-5">
      {/* Profile visibility */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3">Profile Visibility</h4>
        <div className="space-y-2">
          {[
            { value: 'public' as const, label: 'Public', desc: 'Anyone on ZoikoSocial can see your profile' },
            { value: 'connections' as const, label: 'Connections only', desc: 'Only your followers and people you follow' },
            { value: 'private' as const, label: 'Private', desc: 'Only you can see your full profile' },
          ].map((opt) => (
            <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
              profileVisibility === opt.value ? 'bg-primary-container/50 border border-primary/20' : 'bg-surface-container hover:bg-surface-container-high'
            }`}>
              <input
                type="radio"
                name="profileVisibility"
                checked={profileVisibility === opt.value}
                onChange={() => handleProfileVisibilityChange(opt.value)}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="text-label-sm font-semibold text-on-surface">{opt.label}</p>
                <p className="text-[11px] text-outline">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Toggle switches */}
      <hr className="border-outline-variant/30" />
      {([
        { label: 'Show last active status', key: 'showLastActive' as const, desc: 'Let others see when you were last online' },
        { label: 'Show email address', key: 'showEmail' as const, desc: 'Display your email on your profile' },
        { label: 'Allow tagging', key: 'allowTagging' as const, desc: 'Others can tag you in posts and comments' },
        { label: 'Show location', key: 'showLocation' as const, desc: 'Display your general location on your profile' },
      ]).map((item) => (
        <label key={item.key} className="flex items-center justify-between gap-4 cursor-pointer">
          <div>
            <p className="text-label-sm font-semibold text-on-surface">{item.label}</p>
            <p className="text-[11px] text-outline">{item.desc}</p>
          </div>
          <button
            role="switch"
            aria-checked={!!(toggles as Record<string, unknown>)[item.key]}
            onClick={() => patch({ [item.key]: !(toggles as Record<string, unknown>)[item.key] } as UpdateSettingsInput)}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
              (toggles as Record<string, unknown>)[item.key] ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              (toggles as Record<string, unknown>)[item.key] ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </label>
      ))}

      {/* Message privacy was enforced server-side but had no controls at all,
          so every account sat on the defaults. */}
      <div className="pt-2 border-t border-outline-variant/20">
        <p className="text-label-md font-semibold text-on-surface mb-0.5">Messages</p>
        <p className="text-[11px] text-outline mb-3">Who can reach you, and what they can see.</p>
        <MessagingPrivacySettings />
      </div>
    </div>
  )
}

// ── SECURITY ────────────────────────────────────────────────

/**
 * Everything here used to be a mock: the Change button had no handler, "Last
 * changed 3 months ago" was a literal, and the two sessions — "Chrome on
 * Windows", "Safari on iPhone", both in San Francisco — were a hardcoded array
 * whose Revoke buttons had no handler either. Nothing was wired to anything.
 *
 * What the backend actually supports is all-or-nothing: admin.signOut(userId)
 * ends every session for the account. There is no per-session listing or
 * per-session revoke, so this offers the real capability instead of inventing
 * devices to list.
 */
function SecuritySettings({ onChangePassword }: { onChangePassword: () => void }): React.JSX.Element {
  const toast = useToast()
  const [signingOutAll, setSigningOutAll] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const handleSignOutEverywhere = async (): Promise<void> => {
    setSigningOutAll(true)
    setSignOutError(null)
    try {
      await authApi.logoutEverywhere()
      toast.success('Signed out everywhere', 'All devices have been signed out.')
      // This device included — the token here is revoked too.
      window.location.href = '/login'
    } catch (err) {
      setSignOutError(err instanceof Error ? err.message : 'Could not sign out other devices')
      setSigningOutAll(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Password */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-label-md font-semibold text-on-surface">Password</h4>
              {/* No "last changed" line: nothing records when a password was
                  last set, so the old text was a fixed string that read
                  "3 months ago" the moment after you changed it. */}
              <p className="text-[11px] text-outline">Change the password you use to sign in</p>
            </div>
          </div>
          <button
            onClick={onChangePassword}
            className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      {/* Two-factor */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
              <Fingerprint className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-label-md font-semibold text-on-surface">Two-Factor Authentication</h4>
              <p className="text-[11px] text-outline">Add an extra layer of security to your account</p>
            </div>
          </div>
          {/* Was a toggle backed only by local state — it moved, persisted
              nothing, and left the impression 2FA was on. Nothing in the API
              enrols or verifies a second factor, so it says so rather than
              pretending. */}
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-outline flex-shrink-0">
            Not available yet
          </span>
        </div>
      </div>

      {/* Active sessions */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-label-md font-semibold text-on-surface">Active Sessions</h4>
            <p className="text-[11px] text-outline">
              Signed out somewhere you no longer use? End every session at once.
            </p>
          </div>
        </div>
        {signOutError && (
          <p className="mb-2 text-[11px] text-red-500">{signOutError}</p>
        )}
        <button
          onClick={() => void handleSignOutEverywhere()}
          disabled={signingOutAll}
          className="w-full px-4 py-2 rounded-lg border border-outline-variant text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {signingOutAll && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{signingOutAll ? 'Signing out…' : 'Sign out of all devices'}</span>
        </button>
        <p className="mt-2 text-[10px] text-outline">
          This signs out this device too, so you will need to sign in again.
        </p>
      </div>
    </div>
  )
}

// ── NOTIFICATION SETTINGS ───────────────────────────────────

function NotificationSettings({ settings, loading, patch }: SettingsContextValue): React.JSX.Element {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-outline" />
      </div>
    )
  }

  const prefs = settings ?? {
    notifLikes: true,
    notifComments: true,
    notifFollows: true,
    notifMentions: true,
    notifEvents: true,
    notifCommunities: true,
    notifNews: true,
    notifPromotions: false,
    notifMessages: true,
    notifAdoption: true,
    notifAccountGuidance: true,
    emailDigest: true,
    emailMarketing: false,
    pushEnabled: true,
  }

  const s = prefs as unknown as Record<string, boolean>

  return (
    <div className="space-y-5">
      {/* In-app notifications */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          In-App Notifications
        </h4>
        <div className="space-y-1">
          {([
            { label: 'Likes & Reactions', key: 'notifLikes' },
            { label: 'Comments & Replies', key: 'notifComments' },
            { label: 'New Followers', key: 'notifFollows' },
            { label: 'Mentions & Tags', key: 'notifMentions' },
            { label: 'Event Invitations', key: 'notifEvents' },
            { label: 'Community Activity', key: 'notifCommunities' },
            { label: 'News & Updates', key: 'notifNews' },
            { label: 'Messages & Calls', key: 'notifMessages' },
            { label: 'Adoption Enquiries', key: 'notifAdoption' },
            { label: 'Getting Started Tips', key: 'notifAccountGuidance' },
            { label: 'Promotions & Tips', key: 'notifPromotions' },
          ]).map((item) => (
            <label key={item.key} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
              <span className="text-label-sm text-on-surface">{item.label}</span>
              <button
                role="switch"
                aria-checked={s[item.key]}
                onClick={() => patch({ [item.key]: !s[item.key] })}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${s[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Email & Push */}
      <div className="space-y-3">
        {([
          { label: 'Email Digest (weekly)', key: 'emailDigest', desc: 'Receive a weekly summary of your activity' },
          { label: 'Email Marketing', key: 'emailMarketing', desc: 'Product updates, tips, and offers' },
          // Still the master switch for push, and now actually read when one is
          // sent. It stays above the per-device section because it applies to
          // every device, not just this browser.
          { label: 'Push Notifications', key: 'pushEnabled', desc: 'Allow notifications on your devices' },
        ]).map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-label-sm font-semibold text-on-surface">{item.label}</p>
              <p className="text-[11px] text-outline">{item.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={s[item.key]}
              onClick={() => patch({ [item.key]: !s[item.key] })}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${s[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${s[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </label>
        ))}
      </div>

      <hr className="border-outline-variant/30" />

      <PushNotificationSettings />

      {/*
        No Quiet Hours control here yet, deliberately. The columns and the API
        accept a window (migration 064), but honouring it means *holding* mail
        until the window closes, which needs the deferred queue that orchestration
        builds. A switch reading "hold non-urgent email until morning" that
        silently changed nothing would be the same dead control this module was
        written to fix. It goes in with the enforcement.
      */}
    </div>
  )
}

// ── PREFERENCES ─────────────────────────────────────────────

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const

// `true` only after client mount — server and first client render return `false`
// so theme highlighting stays hydration-safe without a setState-in-effect.
const emptySubscribe = (): (() => void) => () => {}

function PreferencesSettings({ settings, patch }: SettingsContextValue): React.JSX.Element {
  const { date } = useDateFormat()
  const { theme, setTheme } = useTheme()
  const { currency, setCurrency, ratesLive, ratesUpdatedAt } = useCurrency()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  // The language state and its handler lived here only to drive the picker
  // below. Nothing read the stored value, so both went with it.

  const activeTheme = mounted ? theme ?? 'system' : undefined

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-primary" />
          Appearance
        </h4>
        <p className="text-[11px] text-outline mb-3">Choose how ZoikoSocial looks. &ldquo;System&rdquo; follows your device settings.</p>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon
            const selected = activeTheme === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-label-sm font-semibold transition-all ${
                  selected
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-container hover:border-outline-variant'
                }`}
              >
                <Icon className="w-5 h-5" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Language */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Language & Region
        </h4>
        <LanguageSwitcher />
      </div>

      <hr className="border-outline-variant/30" />

      {/* Currency */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          Currency
        </h4>
        <p className="text-[11px] text-outline mb-3">Prices across ZoikoSocial (adoption, breeding, vet & pet care) display in this currency. Converted amounts are approximate.</p>
        <select
          value={mounted ? currency : 'INR'}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all appearance-none cursor-pointer"
        >
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>)}
        </select>
        <p className="text-[11px] text-outline mt-2">
          {mounted && ratesLive && ratesUpdatedAt
            ? `Live exchange rates · updated ${date(ratesUpdatedAt, 'dayMonthYearTime')}`
            : 'Using approximate exchange rates (offline or unavailable).'}
        </p>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Display preferences */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          Display
        </h4>
        <div className="space-y-1">
          {([
            { label: 'Reduced Motion', key: 'reducedMotion' as const, desc: 'Minimize animations and transitions' },
            { label: 'Compact View', key: 'compactView' as const, desc: 'Show more content in less space' },
          ]).map((item) => (
            <label key={item.key} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
              <div>
                <p className="text-label-sm font-semibold text-on-surface">{item.label}</p>
                <p className="text-[11px] text-outline">{item.desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={!!(settings as unknown as Record<string, boolean>)?.[item.key]}
                onClick={() => patch({ [item.key]: !(settings as unknown as Record<string, boolean>)?.[item.key] } as UpdateSettingsInput)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${(settings as unknown as Record<string, boolean>)?.[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${(settings as unknown as Record<string, boolean>)?.[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── BLOCKED & MUTED ─────────────────────────────────────────

function BlockedAndMutedSettings(): React.JSX.Element {
  const [blocked, setBlocked] = useState<BlockedUserItem[] | null>(null)
  const [muted, setMuted] = useState<MutedUserItem[] | null>(null)
  const [tab, setTab] = useState<'blocked' | 'muted'>('blocked')
  const [busyId, setBusyId] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    void networkApi.getBlocked().then(setBlocked).catch(() => setBlocked([]))
    void networkApi.getMuted().then(setMuted).catch(() => setMuted([]))
  }, [])

  async function unblock(userId: string, name: string): Promise<void> {
    if (busyId) return
    setBusyId(userId)
    try {
      await networkApi.unblock(userId)
      setBlocked((list) => list?.filter((u) => u.id !== userId) ?? list)
      toast.success('Unblocked', `${name} can see your profile and message you again.`)
    } catch (e) {
      toast.error('Action failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setBusyId(null)
    }
  }

  async function unmute(userId: string, name: string): Promise<void> {
    if (busyId) return
    setBusyId(userId)
    try {
      await networkApi.unmute(userId)
      setMuted((list) => list?.filter((u) => u.id !== userId) ?? list)
      toast.success('Unmuted', `You'll see posts from ${name} again.`)
    } catch (e) {
      toast.error('Action failed', e instanceof Error ? e.message : 'Please try again')
    } finally {
      setBusyId(null)
    }
  }

  const list = tab === 'blocked' ? blocked : muted
  const loading = list === null

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-surface-container rounded-xl">
        {(['blocked', 'muted'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-label-sm font-semibold capitalize transition-colors cursor-pointer ${
              tab === t ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-outline hover:text-on-surface'
            }`}
          >
            {t} {t === 'blocked' ? `(${blocked?.length ?? 0})` : `(${muted?.length ?? 0})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-14 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 text-center">
          {tab === 'blocked' ? <UserX className="w-8 h-8 text-outline mx-auto mb-2" /> : <VolumeX className="w-8 h-8 text-outline mx-auto mb-2" />}
          <p className="text-label-md text-on-surface font-semibold">No {tab} accounts</p>
          <p className="text-label-sm text-outline mt-0.5">
            {tab === 'blocked'
              ? 'Accounts you block will show up here so you can unblock them anytime.'
              : 'Accounts you mute will show up here so you can unmute them anytime.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {u.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-label-md font-bold text-primary">{u.displayName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md font-semibold text-on-surface truncate">{u.displayName}</p>
                <p className="text-[11px] text-outline truncate">
                  @{u.username}
                  {tab === 'blocked' && (u as BlockedUserItem).reason ? ` · ${(u as BlockedUserItem).reason}` : ''}
                </p>
              </div>
              <button
                onClick={() => void (tab === 'blocked' ? unblock(u.id, u.displayName) : unmute(u.id, u.displayName))}
                disabled={busyId === u.id}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-outline-variant/40 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50"
              >
                {busyId === u.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{tab === 'blocked' ? 'Unblock' : 'Unmute'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── HELP ────────────────────────────────────────────────────

function HelpSettings(): React.JSX.Element {
  return (
    <div className="space-y-5">
      {/*
        Every row here must have an href. Four rows used to sit in this list with
        no destination — Contact Support, Billing & Subscriptions, Download Your
        Data and Version History — rendering as buttons that did nothing when
        tapped. Billing has no product behind it, there is no data-export
        endpoint, there is no support address yet, and the version is already
        shown in the card below this list. A control that does nothing reads as a
        broken app, so they are gone until there is something to point them at.
      */}
      {[
        { icon: HelpCircle, title: 'Help Center', desc: 'Find answers to common questions', color: 'text-primary', href: '/docs' },
        { icon: Users, title: 'Community Guidelines', desc: 'Our principles for a safe platform', color: 'text-secondary', href: '/docs/safety-and-trust' },
        { icon: ExternalLink, title: 'Terms of Service', desc: 'Read our terms and conditions', color: 'text-tertiary', href: '/terms' },
        { icon: Lock, title: 'Privacy Policy', desc: 'How we handle your data', color: 'text-primary', href: '/privacy' },
      ].map((item) => {
        const rowClassName = 'w-full flex items-center gap-4 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 hover:shadow-sm transition-all text-left cursor-pointer group'
        const rowContent = (
          <>
            <div className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
              <p className="text-[11px] text-outline">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
          </>
        )
        // Always a Link, never a button: this way TypeScript rejects any row
        // added above without an href, instead of silently rendering a dead one.
        return (
          <Link key={item.title} href={item.href} className={rowClassName}>
            {rowContent}
          </Link>
        )
      })}

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 text-center border border-outline-variant/20 mt-4">
        <p className="text-label-md font-bold text-on-surface mb-1">ZoikoSocial</p>
        <p className="text-[11px] text-outline">Version 1.0 (Build 2026.06)</p>
        <p className="text-[11px] text-outline">Zoiko Media Corp · Sacramento, CA</p>
      </div>
    </div>
  )
}

// ── RENDER SWITCH ───────────────────────────────────────────

export default function SettingsPage(): React.JSX.Element {
  const t = useTranslations('settings')
  // Kept in the URL so it survives leaving the page. Help & About links out to
  // real routes (/privacy, /terms, /docs); coming back with the browser's back
  // button remounts settings, and with the section held only in state it always
  // came back on Account rather than the tab that was open.
  const [activeSection, setActiveSection] = useState<SettingsTab>(() => {
    if (typeof window === 'undefined') return 'account'
    const requested = new URLSearchParams(window.location.search).get('section')
    return SECTIONS.some((s) => s.id === requested) ? (requested as SettingsTab) : 'account'
  })

  // replaceState rather than push: switching tabs should not make the back
  // button walk through every tab visited before leaving the page.
  const selectSection = useCallback((id: SettingsTab): void => {
    setActiveSection(id)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('section', id)
      window.history.replaceState(window.history.state, '', url)
    }
  }, [])
  // Security's Change button lives in a different section from the modal that
  // does the work, so it switches tabs and asks Account to open it.
  const [openPasswordOnAccount, setOpenPasswordOnAccount] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const { signOut } = useAuth()
  const sharedSettings = useSharedSettings()

  const handleSignOut = async (): Promise<void> => {
    if (signingOut) return
    setSigningOut(true)
    await signOut() // redirects to /login when done
  }

  const renderActiveSection = (): React.JSX.Element => {
    switch (activeSection) {
      case 'account':
        return (
          <AccountSettings
            autoOpenPassword={openPasswordOnAccount}
            onAutoOpenHandled={() => setOpenPasswordOnAccount(false)}
          />
        )
      case 'privacy':
        return <PrivacySettings {...sharedSettings} />
      case 'blocked':
        return <BlockedAndMutedSettings />
      case 'verification':
        return <VerificationSettings />
      case 'security':
        return (
          <SecuritySettings
            onChangePassword={() => { setOpenPasswordOnAccount(true); selectSection('account') }}
          />
        )
      case 'notifications':
        return <NotificationSettings {...sharedSettings} />
      case 'preferences':
        return <PreferencesSettings {...sharedSettings} />
      case 'help':
        return <HelpSettings />
    }
  }

  const activeSectionMeta = SECTIONS.find((s) => s.id === activeSection)!

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-headline-md font-bold text-on-surface">Settings</h1>
              <p className="text-label-sm text-outline">Manage your account, privacy, and preferences</p>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
            {/* Left sidebar */}
            <div className="lg:col-span-3">
              {/* Mobile section selector */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-label-md font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <activeSectionMeta.icon className="w-4 h-4 text-primary" />
                    {t(`sections.${activeSectionMeta.id}`)}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileMenuOpen && (
                  <div className="mt-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-lg">
                    {SECTIONS.map((section) => {
                      const isActive = activeSection === section.id
                      return (
                        <button
                          key={section.id}
                          onClick={() => { selectSection(section.id); setMobileMenuOpen(false) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                            isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <section.icon className="w-4 h-4" />
                          <div>
                            <p className={`text-label-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                              {t(`sections.${section.id}`)}
                            </p>
                            <p className="text-[10px] text-outline">{t(`sections.${section.id}Desc`)}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Desktop sidebar */}
              <div className="hidden lg:block bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm sticky top-24">
                <div className="p-3 border-b border-outline-variant/20">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-outline">Settings</p>
                </div>
                {SECTIONS.map((section) => {
                  const isActive = activeSection === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => selectSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <section.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-outline group-hover:text-on-surface'}`} />
                      <div>
                        <p className={`text-label-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                          {t(`sections.${section.id}`)}
                        </p>
                        <p className="text-[10px] text-outline">{t(`sections.${section.id}Desc`)}</p>
                      </div>
                    </button>
                  )
                })}

                <div className="border-t border-outline-variant/20 p-3 mt-1">
                  <button
                    onClick={() => void handleSignOut()}
                    disabled={signingOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-label-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                  >
                    {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    <span>{signingOut ? 'Signing out…' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-9">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hidden sm:flex">
                      <activeSectionMeta.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-label-md font-bold text-on-surface">{t(`sections.${activeSectionMeta.id}`)}</h2>
                      <p className="text-[11px] text-outline">{t(`sections.${activeSectionMeta.id}Desc`)}</p>
                    </div>
                    {SECTION_DOCS_LINK[activeSection] && (
                      <DocsHelpLink href={SECTION_DOCS_LINK[activeSection]!} />
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {renderActiveSection()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileTabs currentPage="settings" />
    </>
  )
}
