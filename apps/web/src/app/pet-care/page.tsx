'use client'

import { HeartHandshake } from 'lucide-react'
import { ServiceDirectory } from '@/components/ServiceDirectory'

export default function PetCarePage(): React.JSX.Element {
  return (
    <ServiceDirectory
      category="pet_care"
      title="Pet Care Services"
      subtitle="Grooming, boarding, walking & more"
      Icon={HeartHandshake}
      serviceTypes={['Grooming', 'Boarding', 'Walking', 'Training', 'Pet Sitting', 'Daycare', 'Other']}
      addLabel="Add a service"
    />
  )
}
