'use client'

import { Stethoscope } from 'lucide-react'
import { ServiceDirectory } from '@/components/ServiceDirectory'

export default function VetFinderPage(): React.JSX.Element {
  return (
    <ServiceDirectory
      category="vet"
      title="Vet Finder"
      subtitle="Find trusted vets & clinics near you"
      Icon={Stethoscope}
      serviceTypes={['Veterinary Clinic', 'Emergency Vet', 'Specialist', 'Mobile Vet', 'Dental', 'Other']}
      addLabel="Add a vet"
    />
  )
}
