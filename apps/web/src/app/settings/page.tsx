'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Shield, Lock, Bell, User, Sliders, HelpCircle, LogOut, Globe, Eye, Smartphone, Key, Fingerprint, Mail, CreditCard, Users, Download, Clock, Trash2, ExternalLink, ChevronDown, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

type SettingsTab =
  | 'account'
  | 'privacy'
  | 'security'
  | 'notifications'
  | 'preferences'
  | 'help'

interface SettingsSection {
  id: SettingsTab
  label: string
  icon: typeof User
  description: string
}

const SECTIONS: SettingsSection[] = [
  { id: 'account',       label: 'Account',       icon: User,      description: 'Profile info, email, password' },
  { id: 'privacy',       label: 'Privacy',        icon: Lock,      description: 'Who can see your activity' },
  { id: 'security',      label: 'Security',       icon: Shield,    description: 'Login, 2FA, active sessions' },
  { id: 'notifications', label: 'Notifications',  icon: Bell,      description: 'Push, email, in-app alerts' },
  { id: 'preferences',   label: 'Preferences',    icon: Sliders,   description: 'Theme, language, accessibility' },
  { id: 'help',          label: 'Help & About',   icon: HelpCircle,description: 'Support, terms, version info' },
]

// ── ACCOUNT ─────────────────────────────────────────────────

function AccountSettings(): React.JSX.Element {
  const [form, setForm] = useState({ name: 'Alex Rivera', email: 'alex@example.com', bio: 'Animal lover & rescue volunteer', phone: '+1 (555) 123-4567' })

  return (
    <div className="space-y-5">
      {/* Profile photo */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-outline-variant">
          AR
        </div>
        <div>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
            Change Photo
          </button>
          <p className="text-[11px] text-outline mt-1">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>

      {/* Form fields */}
      {[
        { label: 'Full Name', key: 'name', type: 'text' as const, value: form.name },
        { label: 'Email Address', key: 'email', type: 'email' as const, value: form.email },
        { label: 'Bio', key: 'bio', type: 'text' as const, value: form.bio, multiline: true },
        { label: 'Phone Number', key: 'phone', type: 'tel' as const, value: form.phone },
      ].map((field) => (
        <div key={field.key}>
          <label className="block text-label-sm font-semibold text-on-surface mb-1.5">{field.label}</label>
          {field.multiline ? (
            <textarea
              value={field.value}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all resize-none"
            />
          ) : (
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all"
            />
          )}
        </div>
      ))}

      <hr className="border-outline-variant/30" />

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <h4 className="text-label-sm font-bold text-red-700 flex items-center gap-2 mb-1">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h4>
        <p className="text-[11px] text-red-500 mb-3">Permanently delete your account and all associated data.</p>
        <button className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-label-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer">
          Delete Account
        </button>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button className="px-6 py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 cursor-pointer">
          Save Changes
        </button>
      </div>
    </div>
  )
}

// ── PRIVACY ──────────────────────────────────────────────────

function PrivacySettings(): React.JSX.Element {
  const [toggles, setToggles] = useState({
    profileVisibility: 'public' as 'public' | 'connections' | 'private',
    showLastActive: true,
    showEmail: false,
    allowTagging: true,
    allowMessaging: 'everyone' as 'everyone' | 'connections' | 'none',
    showLocation: false,
  })

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
              toggles.profileVisibility === opt.value ? 'bg-primary-container/50 border border-primary/20' : 'bg-surface-container hover:bg-surface-container-high'
            }`}>
              <input
                type="radio"
                name="profileVisibility"
                checked={toggles.profileVisibility === opt.value}
                onChange={() => setToggles((t) => ({ ...t, profileVisibility: opt.value }))}
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
            aria-checked={toggles[item.key]}
            onClick={() => setToggles((t) => ({ ...t, [item.key]: !t[item.key] }))}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
              toggles[item.key] ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              toggles[item.key] ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </label>
      ))}
    </div>
  )
}

// ── SECURITY ────────────────────────────────────────────────

function SecuritySettings(): React.JSX.Element {
  const [twoFactor, setTwoFactor] = useState(false)

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
              <p className="text-[11px] text-outline">Last changed 3 months ago</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
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
          <button
            onClick={() => setTwoFactor((t) => !t)}
            role="switch"
            aria-checked={twoFactor}
            className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
              twoFactor ? 'bg-primary' : 'bg-outline-variant'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              twoFactor ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
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
            <p className="text-[11px] text-outline">You&apos;re logged in on 2 devices</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { device: 'Chrome on Windows', location: 'San Francisco, CA', active: 'Active now' },
            { device: 'Safari on iPhone', location: 'San Francisco, CA', active: '2 hours ago' },
          ].map((s) => (
            <div key={s.device} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container">
              <div>
                <p className="text-label-sm font-semibold text-on-surface">{s.device}</p>
                <p className="text-[10px] text-outline">{s.location} · {s.active}</p>
              </div>
              <button className="text-[11px] text-red-500 hover:text-red-600 font-semibold cursor-pointer">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── NOTIFICATION SETTINGS ───────────────────────────────────

function NotificationSettings(): React.JSX.Element {
  const [prefs, setPrefs] = useState({
    likes: true, comments: true, follows: true, mentions: true,
    events: true, communities: true, news: true, promotions: false,
    emailDigest: true, emailMarketing: false, pushEnabled: true,
  })

  function toggle(key: keyof typeof prefs): void {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

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
            { label: 'Likes & Reactions', key: 'likes' as const },
            { label: 'Comments & Replies', key: 'comments' as const },
            { label: 'New Followers', key: 'follows' as const },
            { label: 'Mentions & Tags', key: 'mentions' as const },
            { label: 'Event Invitations', key: 'events' as const },
            { label: 'Community Activity', key: 'communities' as const },
            { label: 'News & Updates', key: 'news' as const },
            { label: 'Promotions & Tips', key: 'promotions' as const },
          ]).map((item) => (
            <label key={item.key} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
              <span className="text-label-sm text-on-surface">{item.label}</span>
              <button
                role="switch"
                aria-checked={prefs[item.key]}
                onClick={() => toggle(item.key)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${prefs[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant/30" />

      {/* Email & Push */}
      <div className="space-y-3">
        {([
          { label: 'Email Digest (weekly)', key: 'emailDigest' as const, desc: 'Receive a weekly summary of your activity' },
          { label: 'Email Marketing', key: 'emailMarketing' as const, desc: 'Product updates, tips, and offers' },
          { label: 'Push Notifications', key: 'pushEnabled' as const, desc: 'Receive notifications on your device' },
        ]).map((item) => (
          <label key={item.key} className="flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <p className="text-label-sm font-semibold text-on-surface">{item.label}</p>
              <p className="text-[11px] text-outline">{item.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={prefs[item.key]}
              onClick={() => toggle(item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${prefs[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </label>
        ))}
      </div>
    </div>
  )
}

// ── PREFERENCES ─────────────────────────────────────────────

function PreferencesSettings(): React.JSX.Element {
  const [prefs, setPrefs] = useState({ darkMode: false, reducedMotion: false, compactView: false })
  const [language, setLanguage] = useState('en')

  function toggle(key: keyof typeof prefs): void {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="space-y-5">
      {/* Language */}
      <div>
        <h4 className="text-label-md font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Language & Region
        </h4>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 focus:border-primary focus:outline-none rounded-lg text-label-md transition-all appearance-none cursor-pointer"
        >
          <option value="en">English (US)</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="pt">Português</option>
        </select>
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
            { label: 'Dark Mode', key: 'darkMode' as const, desc: 'Use dark theme across the platform' },
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
                aria-checked={prefs[item.key]}
                onClick={() => toggle(item.key)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${prefs[item.key] ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── HELP ────────────────────────────────────────────────────

function HelpSettings(): React.JSX.Element {
  return (
    <div className="space-y-5">
      {[
        { icon: HelpCircle, title: 'Help Center', desc: 'Find answers to common questions', color: 'text-primary' },
        { icon: Users, title: 'Community Guidelines', desc: 'Our principles for a safe platform', color: 'text-secondary' },
        { icon: Mail, title: 'Contact Support', desc: 'Get in touch with our team', color: 'text-tertiary' },
        { icon: CreditCard, title: 'Billing & Subscriptions', desc: 'Manage your Premium plan', color: 'text-primary' },
        { icon: Download, title: 'Download Your Data', desc: 'Request an export of all your data', color: 'text-secondary' },
        { icon: ExternalLink, title: 'Terms of Service', desc: 'Read our terms and conditions', color: 'text-tertiary' },
        { icon: Lock, title: 'Privacy Policy', desc: 'How we handle your data', color: 'text-primary' },
        { icon: Clock, title: 'Version History', desc: 'ZoikoSocial v1.0 — June 2026', color: 'text-secondary' },
      ].map((item) => (
        <button key={item.title} className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 hover:shadow-sm transition-all text-left cursor-pointer group">
          <div className={`w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
            <p className="text-[11px] text-outline">{item.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
        </button>
      ))}

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 text-center border border-outline-variant/20 mt-4">
        <p className="text-label-md font-bold text-on-surface mb-1">ZoikoSocial</p>
        <p className="text-[11px] text-outline">Version 1.0 (Build 2026.06)</p>
        <p className="text-[11px] text-outline">Zoiko Media Corp · Sacramento, CA</p>
      </div>
    </div>
  )
}

// ── RENDER SWITCH ───────────────────────────────────────────

const SETTINGS_COMPONENTS: Record<SettingsTab, () => React.JSX.Element> = {
  account: AccountSettings,
  privacy: PrivacySettings,
  security: SecuritySettings,
  notifications: NotificationSettings,
  preferences: PreferencesSettings,
  help: HelpSettings,
}

export default function SettingsPage(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState<SettingsTab>('account')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const { signOut } = useAuth()

  const handleSignOut = async (): Promise<void> => {
    if (signingOut) return
    setSigningOut(true)
    await signOut() // redirects to /login when done
  }

  const SettingsComponent = SETTINGS_COMPONENTS[activeSection]
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
                    {activeSectionMeta.label}
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
                          onClick={() => { setActiveSection(section.id); setMobileMenuOpen(false) }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                            isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                          }`}
                        >
                          <section.icon className="w-4 h-4" />
                          <div>
                            <p className={`text-label-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                              {section.label}
                            </p>
                            <p className="text-[10px] text-outline">{section.description}</p>
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
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 cursor-pointer group ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-2 border-primary'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <section.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-outline group-hover:text-on-surface'}`} />
                      <div>
                        <p className={`text-label-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                          {section.label}
                        </p>
                        <p className="text-[10px] text-outline">{section.description}</p>
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
                    {signingOut ? 'Signing out…' : 'Sign Out'}
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
                    <div>
                      <h2 className="text-label-md font-bold text-on-surface">{activeSectionMeta.label}</h2>
                      <p className="text-[11px] text-outline">{activeSectionMeta.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <SettingsComponent />
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
