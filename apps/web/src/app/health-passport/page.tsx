'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { ProfileCard } from '@/components/ProfileCard'
import { MyPetsWidget } from '@/components/MyPetsWidget'
import { CommunitiesWidget } from '@/components/CommunitiesWidget'
import { QuickLinksWidget } from '@/components/QuickLinksWidget'
import { RightPanel } from '@/components/RightPanel'
import { MobileTabs } from '@/components/MobileTabs'
import Link from 'next/link'
import {
  ChevronLeft, Syringe, Calendar, Heart, Activity,
  ShieldCheck, AlertTriangle, FileText, Plus,
  Download, Share2, Pill, Stethoscope,
  Bone, Eye, CheckCircle2, AlertCircle,
} from 'lucide-react'

type HealthTab = 'vaccinations' | 'visits' | 'medications' | 'allergies' | 'records'

interface PetHealthRecord {
  id: string
  petName: string
  petAvatar: string
  petGradient: string
  species: string
  breed: string
  age: string
  weight: string
  microchip: string
}

interface Vaccination {
  id: string
  name: string
  date: string
  expiryDate: string
  status: 'up-to-date' | 'due-soon' | 'overdue'
  provider: string
  notes: string
}

interface VetVisit {
  id: string
  date: string
  provider: string
  reason: string
  notes: string
  documents: string
  followUp: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  active: boolean
  prescribedBy: string
}

interface Allergy {
  id: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  symptoms: string
  diagnosed: string
}

const PET: PetHealthRecord = {
  id: 'p1', petName: 'Cleo', petAvatar: 'CL',
  petGradient: 'linear-gradient(135deg,#4a6eab,#2a4a80)',
  species: 'Cat', breed: 'Domestic Shorthair', age: '3 years',
  weight: '4.2 kg', microchip: '985112003456789',
}

const VACCINATIONS: Vaccination[] = [
  { id: 'v1', name: 'FVRCP (Distemper Combo)', date: 'Jun 15, 2026', expiryDate: 'Jun 15, 2027', status: 'up-to-date', provider: 'Paw Care Veterinary Clinic', notes: 'Annual booster given. No adverse reactions.' },
  { id: 'v2', name: 'Rabies', date: 'Jun 15, 2026', expiryDate: 'Jun 15, 2027', status: 'up-to-date', provider: 'Paw Care Veterinary Clinic', notes: '3-year vaccine. Last booster was 2024.' },
  { id: 'v3', name: 'FeLV (Feline Leukemia)', date: 'Jun 15, 2025', expiryDate: 'Jun 15, 2026', status: 'due-soon', provider: 'Paw Care Veterinary Clinic', notes: 'Due for annual booster within the next month.' },
  { id: 'v4', name: 'FIV Test', date: 'Dec 10, 2024', expiryDate: 'Dec 10, 2025', status: 'overdue', provider: 'Sacramento Animal Hospital', notes: 'Negative. Recommended annual re-testing for outdoor cats.' },
]

const VET_VISITS: VetVisit[] = [
  { id: 'w1', date: 'Jun 15, 2026', provider: 'Dr. Amara Osei · Paw Care Vet', reason: 'Annual Wellness Exam & Vaccinations', notes: 'Cleo is in excellent health. Weight stable at 4.2 kg. Dental health good. Heart and lungs clear. All vaccines administered.', documents: 'Lab results attached', followUp: 'Annual checkup: June 2027' },
  { id: 'w2', date: 'Mar 8, 2026', provider: 'Dr. James Lee · Midtown Animal Hospital', reason: 'Urinary Tract Infection', notes: 'Presented with frequent urination and discomfort. Urinalysis confirmed UTI. Prescribed 10-day course of Clavamox. Symptoms resolved within 48 hours.', documents: 'Urinalysis report · Prescription record', followUp: 'None needed' },
  { id: 'w3', date: 'Dec 10, 2025', provider: 'Dr. Amara Osei · Paw Care Vet', reason: 'Dental Cleaning & Checkup', notes: 'Professional dental cleaning under light sedation. No extractions needed. Grade 1 tartar removed. Home dental care recommended.', documents: 'Dental chart · Procedure notes', followUp: 'Annual dental check: Dec 2026' },
  { id: 'w4', date: 'Aug 22, 2025', provider: 'Dr. Sarah Chen · VCA Sacramento', reason: 'Allergy Evaluation', notes: 'Presented with mild skin irritation around face and paws. Allergy testing performed. Identified sensitivity to certain proteins in diet.', documents: 'Allergy test results', followUp: 'Dietary trial recommended' },
]

const MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Clavamox (Amoxicillin-Clavulanate)', dosage: '62.5 mg', frequency: 'Twice daily with food', startDate: 'Mar 8, 2026', endDate: 'Mar 18, 2026', active: false, prescribedBy: 'Dr. James Lee' },
  { id: 'm2', name: 'Revolution Plus (Topical)', dosage: '0.5 mL', frequency: 'Monthly', startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026', active: true, prescribedBy: 'Dr. Amara Osei' },
  { id: 'm3', name: 'Omega-3 Fatty Acid Supplement', dosage: '500 mg', frequency: 'Daily with food', startDate: 'Sep 1, 2025', endDate: 'Ongoing', active: true, prescribedBy: 'Dr. Amara Osei' },
]

const ALLERGIES: Allergy[] = [
  { id: 'a1', allergen: 'Chicken protein', severity: 'mild', symptoms: 'Mild skin irritation, occasional scratching around face', diagnosed: 'Aug 2025' },
  { id: 'a2', allergen: 'Pollen (seasonal)', severity: 'mild', symptoms: 'Sneezing, watery eyes during spring months', diagnosed: 'Aug 2025' },
]

function StatusBadge({ status }: { status: Vaccination['status'] }): React.JSX.Element {
  const config = {
    'up-to-date': { label: 'Up to date', classes: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
    'due-soon': { label: 'Due soon', classes: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
    'overdue': { label: 'Overdue', classes: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle },
  }
  const c = config[status]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.classes}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: Allergy['severity'] }): React.JSX.Element {
  const config = { mild: 'bg-green-50 text-green-700', moderate: 'bg-amber-50 text-amber-700', severe: 'bg-red-50 text-red-700' }
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config[severity]}`}>{severity}</span>
}

export default function HealthPassportPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<HealthTab>('vaccinations')

  const TABS: { id: HealthTab; label: string; Icon: typeof Syringe }[] = [
    { id: 'vaccinations', label: 'Vaccinations', Icon: Syringe },
    { id: 'visits',       label: 'Vet Visits',   Icon: Stethoscope },
    { id: 'medications',  label: 'Medications',  Icon: Pill },
    { id: 'allergies',    label: 'Allergies',    Icon: AlertTriangle },
    { id: 'records',      label: 'Records',      Icon: FileText },
  ]

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:grid lg:grid-cols-12 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-gutter hidden lg:block">
            <ProfileCard />
            <MyPetsWidget />
            <CommunitiesWidget />
            <QuickLinksWidget />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6 space-y-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container transition-colors text-outline hover:text-on-surface cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-headline-md font-bold text-on-surface">Health Passport</h1>
                <p className="text-label-sm text-outline">Your pet&apos;s complete health record</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pet Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden">
              <div className="h-20" style={{ background: PET.petGradient }} />
              <div className="px-4 pb-4 -mt-10">
                <div className="flex items-end gap-4 mb-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-headline-md font-bold border-2 border-white shadow-md flex-shrink-0"
                    style={{ background: PET.petGradient }}
                  >
                    {PET.petAvatar}
                  </div>
                  <div className="flex-1 pb-1">
                    <h2 className="text-headline-md font-bold text-on-surface">{PET.petName}</h2>
                    <p className="text-label-sm text-outline">{PET.breed} · {PET.species} · {PET.age}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2.5 rounded-lg bg-surface-container">
                    <Activity className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-label-sm font-bold text-on-surface">{PET.weight}</p>
                    <p className="text-[9px] text-outline">Weight</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-surface-container">
                    <ShieldCheck className="w-4 h-4 text-secondary mx-auto mb-1" />
                    <p className="text-label-sm font-bold text-on-surface">{VACCINATIONS.filter((v) => v.status === 'up-to-date').length}/{VACCINATIONS.length}</p>
                    <p className="text-[9px] text-outline">Vaccines</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-surface-container">
                    <Heart className="w-4 h-4 text-tertiary mx-auto mb-1" />
                    <p className="text-label-sm font-bold text-on-surface">2</p>
                    <p className="text-[9px] text-outline">Allergies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-1 shadow-sm overflow-x-auto no-scrollbar">
              <div className="flex gap-1">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer flex-1 justify-center ${
                        isActive
                          ? 'bg-primary text-white shadow-sm shadow-primary/20'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <tab.Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            {activeTab === 'vaccinations' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-outline">{VACCINATIONS.length} vaccines</p>
                  <button className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    Add Record
                  </button>
                </div>
                {VACCINATIONS.map((v) => (
                  <div key={v.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-label-md font-bold text-on-surface">{v.name}</h3>
                        <p className="text-[11px] text-outline">Given {v.date} · Expires {v.expiryDate}</p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-outline mb-2">
                      <Stethoscope className="w-3 h-3" />
                      {v.provider}
                    </div>
                    <p className="text-[11px] text-on-surface-variant">{v.notes}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-outline">{VET_VISITS.length} visits</p>
                  <button className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    Add Visit
                  </button>
                </div>
                {VET_VISITS.map((v) => (
                  <div key={v.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-label-sm font-semibold text-on-surface">{v.date}</span>
                    </div>
                    <h3 className="text-label-md font-bold text-on-surface mb-1">{v.reason}</h3>
                    <p className="text-[11px] text-outline mb-2">{v.provider}</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">{v.notes}</p>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="text-primary font-medium">{v.documents}</span>
                      <span className="text-outline/40">·</span>
                      <span className="text-outline">Follow-up: {v.followUp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-outline">{MEDICATIONS.length} medications</p>
                  <button className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    Add Medication
                  </button>
                </div>
                {MEDICATIONS.map((m) => (
                  <div key={m.id} className={`bg-surface-container-lowest rounded-xl border p-4 ${m.active ? 'border-outline-variant/30' : 'border-outline-variant/10 opacity-60'}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-label-md font-bold text-on-surface">{m.name}</h3>
                        <p className="text-[11px] text-outline">{m.dosage} · {m.frequency}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${m.active ? 'bg-green-50 text-green-700' : 'bg-surface-container text-outline'}`}>
                        {m.active ? 'Active' : 'Completed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-outline">
                      <Calendar className="w-3 h-3" />
                      {m.startDate} – {m.endDate}
                      <span className="text-outline/40">·</span>
                      <span>Rx: {m.prescribedBy}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'allergies' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-outline">{ALLERGIES.length} allergies</p>
                  <button className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    Add Allergy
                  </button>
                </div>
                {ALLERGIES.map((a) => (
                  <div key={a.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <h3 className="text-label-md font-bold text-on-surface">{a.allergen}</h3>
                        </div>
                      </div>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <p className="text-[11px] text-on-surface-variant mb-1 ml-6">{a.symptoms}</p>
                    <p className="text-[10px] text-outline ml-6">Diagnosed: {a.diagnosed}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-outline">Medical documents</p>
                  <button className="flex items-center gap-1 text-label-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    Upload
                  </button>
                </div>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-sm font-semibold text-on-surface">Microchip Registration</p>
                      <p className="text-[10px] text-outline">PET microchip #: {PET.microchip}</p>
                    </div>
                    <Download className="w-4 h-4 text-outline flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Bone className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-sm font-semibold text-on-surface">Dental Chart — Dec 2025</p>
                      <p className="text-[10px] text-outline">Dr. Amara Osei · Paw Care Vet</p>
                    </div>
                    <Download className="w-4 h-4 text-outline flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 text-tertiary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-label-sm font-semibold text-on-surface">Blood Work Panel — Jun 2026</p>
                      <p className="text-[10px] text-outline">Complete blood count & chemistry</p>
                    </div>
                    <Download className="w-4 h-4 text-outline flex-shrink-0" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-gutter hidden xl:block">
            <RightPanel />
          </div>
        </div>
      </main>

      <MobileTabs currentPage="health-passport" />
    </>
  )
}
