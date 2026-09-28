export default function EditorialCorrectionReport() {
  return (
    <section id="submit-report" className="max-w-6xl mx-auto px-6 pt-10">
      <h2 className="text-[#073B47] text-3xl font-extrabold text-center mb-10">Editorial Correction Report</h2>
      
      <div className="bg-white rounded-[32px] border border-[#E5E7EB] p-8 md:p-10">
        {/* Progress Bar */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mb-16 overflow-x-auto pb-4 gap-4 px-2">
           {[
             {id: 1, label: "Target", active: true},
             {id: 2, label: "Issue", active: false},
             {id: 3, label: "Element", active: false},
             {id: 4, label: "Explain", active: false},
             {id: 5, label: "Evidence", active: false},
             {id: 6, label: "Contact", active: false},
             {id: 7, label: "Review", active: false},
           ].map((step, i) => (
              <div key={step.id} className="flex items-center min-w-[max-content]">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.active ? 'bg-white border-2 border-[#066879] text-[#073B47] ring-4 ring-[#EEF8F9]' : 'bg-[#F7F9FA] border-2 border-[#E5E7EB] text-[#5E7076]'}`}>
                    {step.id}
                  </div>
                  <span className={`text-[10.5px] font-semibold ${step.active ? 'text-[#102A32]' : 'text-[#5E7076]'}`}>{step.label}</span>
                </div>
                {i < 6 && <div className="h-[2px] w-12 sm:w-20 bg-[#E5E7EB] mx-2 sm:mx-4 mt-[-20px]" />}
              </div>
           ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-[#073B47] text-xl font-extrabold mb-2">Which story is this about?</h3>
          <p className="text-[#5E7076] text-sm mb-6">Search by headline, source, or paste a Zoiko Social News link.</p>
          
          <div className="mb-8">
            <label className="block text-[#102A32] font-bold text-[13px] mb-2">Story headline, source, or link</label>
            <input 
              type="text" 
              placeholder="e.g. Wildlife Trade Enforcement, or paste a link" 
              className="w-full bg-[#F7F9FA] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879]"
            />
            <p className="text-[#5E7076] text-xs mt-3">We resolve this to the exact published story — you&apos;ll confirm it before continuing.</p>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] flex gap-4">
            <button className="bg-white border border-[#E5E7EB] text-[#102A32] font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button className="flex-1 bg-[#066879] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#055765] transition-colors">
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
