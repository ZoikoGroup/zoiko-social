'use client'

export function ProfileCard(): React.JSX.Element {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
      {/* Cover photo */}
      <div className="h-16 bg-gradient-to-r from-primary/30 via-primary/10 to-secondary/20"></div>
      
      {/* Profile section */}
      <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border-4 border-surface-container-lowest overflow-hidden shadow-md bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-headline text-xl font-bold">AR</span>
        </div>
        <h2 className="mt-3 font-headline text-headline-md text-on-surface">Alex Rivera</h2>
        <p className="text-label-sm text-outline text-center">Pet Nutrition Specialist &amp; Animal Rescue Advocate</p>
        
        <div className="w-full h-[1px] bg-outline-variant/30 my-4"></div>
        
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-label-md">
            <span className="text-on-surface-variant">Profile views</span>
            <span className="text-primary font-bold">142</span>
          </div>
          <div className="flex justify-between items-center text-label-md">
            <span className="text-on-surface-variant">Post impressions</span>
            <span className="text-primary font-bold">2.4k</span>
          </div>
        </div>
      </div>
    </section>
  )
}
