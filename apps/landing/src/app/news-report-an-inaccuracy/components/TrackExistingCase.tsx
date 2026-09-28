export default function TrackExistingCase() {
  return (
    <section id="track-case" className="max-w-6xl mx-auto px-6 pt-16">
      <div className="bg-white rounded-[28px] border border-[#E5E7EB] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h3 className="text-[#073B47] text-lg font-extrabold mb-2">Track an existing case</h3>
          <p className="text-[#5E7076] text-[12.5px]">
            Enter your case ID to see its current public status. Try <span className="text-[#066879] font-bold cursor-pointer">a sample resolved case</span>.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <input 
            type="text" 
            placeholder="e.g. ZS-NC-482910" 
            className="flex-1 md:w-64 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[13.5px] focus:outline-none focus:border-[#066879] focus:ring-1 focus:ring-[#066879]"
          />
          <button className="bg-[#066879] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#055765] transition-colors text-[15px] whitespace-nowrap">
            Check Status
          </button>
        </div>
      </div>
    </section>
  );
}
