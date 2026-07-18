'use client'

import { useCallback, useState } from 'react'
import { usePagedList } from '@/hooks/use-cache'
import { Img } from '@/components/Img'
import { Header } from '@/components/Header'
import { LocationLink } from '@/components/LocationLink'
import { LocationInput } from '@/components/LocationInput'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  Search, ShieldCheck, BadgeCheck, Dna, PawPrint, Plus, Loader2, X, ImagePlus, Venus, Mars,
} from 'lucide-react'
import { breedingApi, type BreedingProfile, type NewBreedingProfile } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { uploadCommunityImage } from '@/lib/community-image'
import { UserAvatar } from '@/components/UserAvatar'

const SPECIES: { id: string; label: string }[] = [
  { id: 'all',    label: 'All Breeds' },
  { id: 'dog',    label: 'Dogs' },
  { id: 'cat',    label: 'Cats' },
  { id: 'bird',   label: 'Birds' },
  { id: 'rabbit', label: 'Rabbits' },
  { id: 'other',  label: 'Other' },
]

function money(amount: number, currency: string): string {
  const sym = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : ''
  return sym ? `${sym}${amount.toLocaleString()}` : `${amount.toLocaleString()} ${currency}`
}

function SexBadge({ sex }: { sex: string }): React.JSX.Element {
  const female = sex === 'female'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${female ? 'bg-pink-500/10 text-pink-600' : 'bg-blue-500/10 text-blue-600'}`}>
      {female ? <Venus className="w-3 h-3" /> : <Mars className="w-3 h-3" />}{female ? 'Female' : 'Male'}
    </span>
  )
}

export default function BreedingMatchPage(): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  const [species, setSpecies] = useState('all')
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const filters = useCallback(() => ({
    ...(species !== 'all' ? { species } : {}),
    ...(search.trim() ? { q: search.trim() } : {}),
  }), [species, search])

  const listKey = `breeding:${species}:${search.trim()}`
  const {
    items: profiles, isLoading: loading, isRefreshing, hasMore, loadingMore, loadMore, patch: patchProfiles,
  } = usePagedList<BreedingProfile>(listKey, (cursor) => breedingApi.browse(filters(), cursor, 12))

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-2 md:px-5 py-4 flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <QuickLinksWidget />
          </div>

          <div className="lg:col-span-9 space-y-4 pb-20">
            {isRefreshing && !loading && (
              <div className="h-0.5 -mb-3 overflow-hidden rounded-full bg-primary/10">
                <div className="h-full w-1/3 bg-primary/60 animate-pulse rounded-full" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10"><Dna className="w-5 h-5 text-primary" /></span>
                <div>
                  <h1 className="font-headline text-headline-md font-bold text-on-surface">Responsible Breeder Match</h1>
                  <p className="text-label-sm text-outline">Health-tested, ethically-bred companions</p>
                </div>
              </div>
              {isAuthenticated && (
                <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /><span className="hidden sm:inline">List Your Pet</span>
                </button>
              )}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-on-surface-variant leading-snug">
                ZoikoSocial promotes <span className="font-semibold">responsible, health-tested breeding only</span>. Always verify health clearances and meet in person. Report unethical listings.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or breed..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:outline-none rounded-xl text-label-md transition-all placeholder:text-outline/50" />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
              {SPECIES.map((s) => (
                <button key={s.id} onClick={() => setSpecies(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-label-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${species === s.id ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:border-primary/30 hover:text-primary'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => <div key={i} className="h-72 bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-pulse" />)}
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-4"><PawPrint className="w-7 h-7 text-outline" /></div>
                <h3 className="text-label-md font-bold text-on-surface mb-1">No breeding profiles yet</h3>
                <p className="text-label-sm text-outline mb-4">List your health-tested pet for responsible breeding.</p>
                {isAuthenticated && <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg text-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer">List Your Pet</button>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profiles.map((p) => (
                    <Link key={p.id} href={`/breeding-match/${p.id}`} onMouseEnter={() => { void breedingApi.get(p.id).catch(() => {}) }} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className="relative h-40 bg-surface-container overflow-hidden">
                        {p.coverUrl && (
                          <Img src={p.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        )}
                        {p.owner.isVerified && (
                          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-primary text-[10px] font-bold"><BadgeCheck className="w-3 h-3" />Verified Breeder</span>
                        )}
                        <span className="absolute top-2 right-2"><SexBadge sex={p.sex} /></span>
                      </div>
                      <div className="p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">{p.petName}</h3>
                          {p.fee != null && <span className="text-label-sm font-bold text-secondary flex-shrink-0">{money(p.fee, p.currency)}</span>}
                        </div>
                        <p className="text-[12px] text-on-surface-variant">{p.breed}{p.age ? ` · ${p.age}` : ''}</p>
                        {p.location && <LocationLink location={p.location} iconClassName="w-3 h-3" className="text-[11px] text-outline mt-1" />}
                        {p.healthTests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.healthTests.slice(0, 3).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-medium">{t}</span>
                            ))}
                            {p.healthTests.length > 3 && <span className="text-[9px] text-outline">+{p.healthTests.length - 3}</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-outline-variant/10 text-[11px] text-outline min-w-0">
                          <UserAvatar name={p.owner.displayName} image={p.owner.avatarUrl ?? undefined} size="xs" />
                          <span className="truncate">{p.owner.displayName}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center pt-4">
                    <button onClick={loadMore} disabled={loadingMore} className="px-6 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-label-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-all cursor-pointer inline-flex items-center gap-2">
                      {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <MobileTabs currentPage="breeding-match" />

      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} onCreated={(p) => { setCreateOpen(false); patchProfiles((prev) => [p, ...prev]) }} />}
    </>
  )
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: BreedingProfile) => void }): React.JSX.Element {
  const { profile } = useAuth()
  const [petName, setPetName] = useState('')
  const [species, setSpecies] = useState('dog')
  const [breed, setBreed] = useState('')
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('')
  const [location, setLocation] = useState('')
  const [about, setAbout] = useState('')
  const [healthTests, setHealthTests] = useState('')
  const [certifications, setCertifications] = useState('')
  const [fee, setFee] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const valid = petName.trim().length >= 1 && breed.trim().length >= 1

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file || !profile) return
    setUploading(true)
    try { setCoverUrl(await uploadCommunityImage(profile.id, file, 'cover')) } catch { setError('Image upload failed') } finally { setUploading(false) }
  }

  async function submit(): Promise<void> {
    if (!valid || posting) return
    setPosting(true); setError('')
    try {
      const toList = (s: string): string[] => s.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 20)
      const feeNum = parseFloat(fee)
      const input: NewBreedingProfile = {
        petName: petName.trim(), species, breed: breed.trim(), sex,
        ...(age.trim() ? { age: age.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
        ...(about.trim() ? { about: about.trim() } : {}),
        ...(healthTests.trim() ? { healthTests: toList(healthTests) } : {}),
        ...(certifications.trim() ? { certifications: toList(certifications) } : {}),
        ...(fee && !isNaN(feeNum) ? { fee: feeNum } : {}),
        ...(coverUrl ? { coverUrl } : {}),
      }
      onCreated(await breedingApi.create(input))
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to create') } finally { setPosting(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 sticky top-0 bg-surface-container-lowest">
          <h2 className="text-label-md font-bold text-on-surface">List Your Pet for Breeding</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-outline hover:bg-surface-container cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          <label className="block">
            <div className="relative h-36 rounded-xl border border-dashed border-outline-variant/60 bg-surface-container overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-outline text-label-sm">{uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-6 h-6" />}{uploading ? 'Uploading…' : 'Add photo'}</span>
              )}
              <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
            </div>
          </label>
          <div className="flex gap-2">
            <input value={petName} onChange={(e) => setPetName(e.target.value)} maxLength={120} placeholder="Pet name"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-md border border-outline-variant/30 focus:border-primary focus:outline-none" />
            <select value={sex} onChange={(e) => setSex(e.target.value)} className="px-3 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none cursor-pointer">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select value={species} onChange={(e) => setSpecies(e.target.value)} className="px-3 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none cursor-pointer">
              {SPECIES.filter((s) => s.id !== 'all').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <input value={breed} onChange={(e) => setBreed(e.target.value)} maxLength={120} placeholder="Breed"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <input value={age} onChange={(e) => setAge(e.target.value)} maxLength={60} placeholder="Age (e.g. 2 years)"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
            <input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="decimal" placeholder="Stud/fee (optional)"
              className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          </div>
          <LocationInput value={location} onChange={setLocation} maxLength={160} placeholder="Location"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <input value={healthTests} onChange={(e) => setHealthTests(e.target.value)} placeholder="Health tests (comma-separated, e.g. OFA Hips, Cardiac)"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <input value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="Certifications (comma-separated, e.g. AKC Registered)"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none" />
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} maxLength={3000} rows={4} placeholder="About this pet — temperament, lineage, health…"
            className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-label-sm border border-outline-variant/30 focus:border-primary focus:outline-none resize-none" />
          {error && <p className="text-label-sm text-red-500">{error}</p>}
          <button onClick={submit} disabled={!valid || posting || uploading}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2">
            {posting && <Loader2 className="w-4 h-4 animate-spin" />}{posting ? 'Listing…' : 'List Pet'}
          </button>
        </div>
      </div>
    </div>
  )
}
