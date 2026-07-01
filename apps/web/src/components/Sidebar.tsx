'use client'

const NAV_SECTIONS = [
  {
    label: 'Home',
    items: [
      { page: 'feed', icon: 'home', label: 'Feed' },
      { page: 'notifications', icon: 'bell', label: 'Notifications' },
      { page: 'messages', icon: 'mail', label: 'Messages' },
    ],
  },
  {
    label: 'Discover',
    items: [
      { page: 'explore', icon: 'compass', label: 'Explore' },
      { page: 'news', icon: 'file', label: 'News' },
      { page: 'communities', icon: 'users', label: 'Communities' },
      { page: 'events', icon: 'calendar', label: 'Events' },
    ],
  },
  {
    label: 'My Pets',
    items: [
      { page: 'petdiary', icon: 'heart', label: 'Pet Diary' },
      { page: 'health', icon: 'activity', label: 'Health Passport' },
      { page: 'vetfinder', icon: 'map-pin', label: 'Vet Finder' },
    ],
  },
  {
    label: 'Services',
    items: [
      { page: 'petcare', icon: 'user-check', label: 'Pet Care' },
      { page: 'products', icon: 'shopping-cart', label: 'Products' },
      { page: 'breeding', icon: 'chevrons-down', label: 'Breeding Match' },
    ],
  },
  {
    label: 'Help & Safety',
    items: [
      { page: 'lostandfound', icon: 'clock', label: 'Lost & Found' },
      { page: 'adoption', icon: 'heart', label: 'Adoption & Rescue' },
    ],
  },
]

const ICONS: Record<string, React.JSX.Element> = {
  home: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5A1 1 0 003.5 15h13a1 1 0 00.87-1.5L16 11V8a6 6 0 00-6-6z" /><path d="M10 18a2 2 0 01-2-2h4a2 2 0 01-2 2z" /></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 3V5a1 1 0 011-1z" /></svg>,
  compass: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7" /><path d="M13 7l-2 4-4 2 2-4 4-2z" /></svg>,
  file: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="14" height="12" rx="1" /><path d="M7 8h6M7 11h4" /></svg>,
  users: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="7" cy="8" r="3" /><circle cx="14" cy="7" r="2.5" /><path d="M1 17c0-3 2-5 5-5h4c3 0 5 2 5 5" /><path d="M14 12c2 0 4 1.5 4 4" /></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="14" height="12" rx="1" /><path d="M7 3v4M13 3v4M3 9h14" /></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 3C7 3 4 6 4 9c0 4 6 9 6 9s6-5 6-9c0-3-2.7-6-6-6z" /><circle cx="10" cy="9" r="2.5" fill="currentColor" opacity="0.3" /></svg>,
  activity: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 16s-7-5-7-9a5 5 0 0110 0c0 4-3 9-3 9z" /><path d="M8 7h4M10 5v4" /></svg>,
  'map-pin': <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 2a5 5 0 015 5c0 2.7-2 5.5-5 8.5C6 12.5 4 9.7 4 7a5 5 0 015-5z" /><path d="M7 7h4M9 5v4" /></svg>,
  'user-check': <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="8" r="3.5" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="5" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" /></svg>,
  'shopping-cart': <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3h2l2 8h8l2-6H7" /><circle cx="9" cy="17" r="1" /><circle cx="15" cy="17" r="1" /></svg>,
  'chevrons-down': <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 10c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" /><path d="M7 13l3 3 3-3" /></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l2.5 2.5" /><circle cx="10" cy="10" r="1" fill="currentColor" /></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="2" /><path d="M10 3v2M10 15v2M3 10h2M15 10h2M5.6 5.6l1.4 1.4M13 13l1.4 1.4M5.6 14.4l1.4-1.4M13 7l1.4-1.4" /></svg>,
}

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps): React.JSX.Element {
  return (
    <nav
      className="fixed top-14 bottom-0 left-0 w-[240px] bg-gradient-to-b from-teal-deep to-[#0A2422] overflow-y-auto overflow-x-hidden flex flex-col z-30 scrollbar-thin max-md:w-[52px] border-r border-[#1a3d39]"
      aria-label="Main navigation"
    >
      {NAV_SECTIONS.map((section) => (
        <div key={section.label} className="py-[14px] pb-0.5">
          <div className="text-[0.6rem] font-bold tracking-[0.12em] uppercase text-teal-muted/50 px-[18px] pb-2 max-md:hidden">
            {section.label}
          </div>
          {section.items.map((item) => {
            const isActive = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={[
                  'w-full flex items-center gap-3 px-[18px] py-[7px] cursor-pointer text-sm font-medium whitespace-nowrap relative',
                  'transition-all duration-150 ease-out',
                  isActive
                    ? 'text-amber-light'
                    : 'text-[#a0b8b5] hover:text-white hover:bg-white/[0.06]',
                ].join(' ')}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-amber-light rounded-r-full shadow-[0_0_6px_rgba(244,168,32,0.4)]" />
                )}
                <span className={[
                  'w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center transition-transform duration-150',
                  isActive ? 'scale-110' : '',
                ].join(' ')}>
                  <span className={isActive ? 'drop-shadow-[0_0_3px_rgba(244,168,32,0.3)]' : ''}>
                    {ICONS[item.icon] ?? null}
                  </span>
                </span>
                <span className="max-md:hidden">{item.label}</span>
              </button>
            )
          })}
        </div>
      ))}

      {/* Bottom section */}
      <div className="mt-auto pt-2 pb-4 border-t border-white/[0.06] mx-[18px]">
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-0 py-[7px] cursor-pointer text-sm font-medium text-[#a0b8b5] hover:text-white transition-colors duration-150"
        >
          <span className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center">
            {ICONS.settings}
          </span>
          <span className="max-md:hidden">Settings</span>
        </button>

        {/* Premium banner */}
        <div className="mt-3 rounded-xl p-3.5 pb-3 bg-gradient-to-br from-[#e09518]/90 via-[#F4A820]/80 to-[#f9c65a]/70 text-white max-md:hidden border border-white/10 shadow-[0_4px_16px_rgba(244,168,32,0.15)]">
          <h4 className="text-xs font-bold mb-1 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1L13 7l7 1-5 5 1.5 7L10 16l-6.5 4L5 13 0 8l7-1L10 1z" />
            </svg>
            Go Premium
          </h4>
          <p className="text-[0.68rem] text-white/80 mb-3 leading-relaxed">
            Ad-free, enhanced privacy, bigger group calls and more.
          </p>
          <button className="w-full h-7 rounded-lg border-0 bg-white/20 text-white text-[0.72rem] font-semibold cursor-pointer hover:bg-white/30 transition-all duration-200 active:scale-[0.97] backdrop-blur-sm">
            Upgrade Now
          </button>
        </div>
      </div>
    </nav>
  )
}
