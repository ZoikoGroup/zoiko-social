/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function MediaInquiryForm() {
  return (
    <section className="bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex flex-col gap-9 px-6 xl:px-20 py-[80px] mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            Submit a media inquiry
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta">
            Have a question, deadline, or interview request? Reach out to the Zoiko Social communications team.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#dce5e8] rounded-[20px] p-10 shadow-sm w-full">
          <form className="flex flex-col gap-6">
            
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Inquiry type *</label>
                <select className="bg-[#efefef] border border-transparent rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879] appearance-none">
                  <option>Select...</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Deadline (if applicable)</label>
                <input 
                  type="datetime-local" 
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
                />
                <span className="text-[#5e7076] text-[12px] font-jakarta">Include timezone if applicable</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Name *</label>
                <input 
                  type="text" 
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Work email *</label>
                <input 
                  type="email" 
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Outlet / Organization *</label>
                <input 
                  type="text" 
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Role / Title</label>
                <input 
                  type="text" 
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex flex-col gap-2">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Subject *</label>
              <input 
                type="text" 
                placeholder="What is your inquiry about?"
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879]"
              />
            </div>

            {/* Row 5 */}
            <div className="flex flex-col gap-2">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Inquiry details *</label>
              <textarea 
                placeholder="Please provide context for your inquiry..."
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[120px] p-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879] resize-y"
              />
              <span className="text-[#5e7076] text-[12px] font-jakarta">Max 5000 characters</span>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Requested topic / spokesperson</label>
                <input 
                  type="text" 
                  placeholder="(Optional) e.g., Trust & Safety, Product, etc."
                  className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#102a32] text-[14px] font-semibold font-jakarta">Country / Region *</label>
                <select className="bg-[#efefef] border border-transparent rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879] appearance-none">
                  <option>Select...</option>
                </select>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <input 
                type="checkbox" 
                className="mt-1 border-[#dce5e8] rounded-[4px] text-[#066879] focus:ring-[#066879] w-4 h-4 cursor-pointer"
              />
              <label className="text-[14px] font-jakarta text-[#102a32]">
                <span className="font-semibold">I agree to the </span>
                <Link href="#" className="text-[#066879] underline">Privacy Notice</Link>
                <span className="font-semibold"> and understand my data will be used to respond to my inquiry. *</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button 
                type="button"
                className="bg-[#066879] text-white font-semibold font-jakarta text-[16px] py-[16px] px-[32px] rounded-[12px] hover:bg-[#055361] transition-colors"
              >
                Send Media Inquiry
              </button>
            </div>
            
          </form>
        </div>

        {/* Large Image Mask */}
        <div className="aspect-[1280/350] relative rounded-[28px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] shrink-0 w-full overflow-hidden mt-6">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#066879] to-[#e88924]" />
          <img 
            src="/company-press-media/media-inquiry-hero.png" 
            alt="Media team reviewing press inquiries" 
            className="absolute h-[243.66%] left-0 max-w-none top-[-86.84%] w-full" 
          />
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col items-start px-[24px] py-[48px] gap-[20px]">
        {/* Header */}
        <div className="flex flex-col gap-[20px] pb-[16px] w-full">
          <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px]">
            Submit a media inquiry
          </h2>
          <p className="text-[#5e7076] text-[17px] font-jakarta leading-[28px]">
            Have a question, deadline, or interview request? Reach out to the Zoiko Social communications team.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#dce5e8] rounded-[20px] p-[24px] shadow-sm w-full">
          <form className="flex flex-col gap-[24px]">
            
            {/* Field: Inquiry type */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Inquiry type *</label>
              <select className="bg-[#efefef] border border-transparent rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879] appearance-none">
                <option>Select...</option>
              </select>
            </div>
            
            {/* Field: Deadline */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Deadline (if applicable)</label>
              <input 
                type="text" 
                placeholder="mm/dd/yyyy, --:-- --"
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
              />
              <span className="text-[#5e7076] text-[12px] font-jakarta leading-normal">Include timezone if applicable</span>
            </div>

            {/* Field: Name */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Name *</label>
              <input 
                type="text" 
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
              />
            </div>
            
            {/* Field: Work email */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Work email *</label>
              <input 
                type="email" 
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
              />
            </div>

            {/* Field: Outlet / Organization */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Outlet / Organization *</label>
              <input 
                type="text" 
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
              />
            </div>
            
            {/* Field: Role / Title */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Role / Title</label>
              <input 
                type="text" 
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta focus:outline-none focus:border-[#066879]"
              />
            </div>

            {/* Field: Subject */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Subject *</label>
              <input 
                type="text" 
                placeholder="What is your inquiry about?"
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879]"
              />
            </div>

            {/* Field: Inquiry details */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Inquiry details *</label>
              <textarea 
                placeholder="Please provide context for your inquiry..."
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[120px] p-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879] resize-y"
              />
              <span className="text-[#5e7076] text-[12px] font-jakarta leading-normal">Max 5000 characters</span>
            </div>

            {/* Field: Requested topic */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Requested topic / spokesperson</label>
              <input 
                type="text" 
                placeholder="(Optional) e.g., Trust & Safety, Pr"
                className="bg-white border border-[#dce5e8] rounded-[12px] h-[44px] px-4 text-[#102a32] text-[14px] font-jakarta placeholder:text-[#5e7076] focus:outline-none focus:border-[#066879]"
              />
            </div>
            
            {/* Field: Country / Region */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[#102a32] text-[14px] font-semibold font-jakarta leading-normal">Country / Region *</label>
              <select className="bg-[#efefef] border border-transparent rounded-[12px] h-[44px] px-4 text-[#5e7076] text-[14px] font-jakarta focus:outline-none focus:border-[#066879] appearance-none">
                <option>Select...</option>
              </select>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-[12px] mt-2">
              <input 
                type="checkbox" 
                className="mt-1 border-[#dce5e8] rounded-[4px] text-[#066879] focus:ring-[#066879] w-4 h-4 cursor-pointer"
              />
              <div className="flex flex-col">
                <div className="text-[14px] font-jakarta">
                  <span className="font-semibold text-[#102a32]">I agree to the </span>
                  <Link href="#" className="text-[#066879] underline font-semibold">Privacy Notice</Link>
                  <span className="font-semibold text-[#102a32]"> and</span>
                </div>
                <div className="text-[14px] font-semibold font-jakarta text-[#102a32]">
                  understand my data will be used to
                </div>
                <div className="text-[14px] font-semibold font-jakarta text-[#102a32]">
                  respond to my inquiry. *
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-2 w-full">
              <button 
                type="button"
                className="w-full bg-[#066879] text-white font-semibold font-jakarta text-[16px] py-[16px] px-[32px] rounded-[12px] hover:bg-[#055361] transition-colors"
              >
                Send Media Inquiry
              </button>
            </div>
            
          </form>
        </div>

        {/* Mobile Image */}
        <div className="w-full relative rounded-[28px] overflow-hidden aspect-[342/350] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)] mt-[4px]">
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#066879] to-[#e88924]" />
          <img 
            src="/company-press-media/mobile-media-inquiry.png" 
            alt="Media team reviewing press inquiries and coordinating responses" 
            className="absolute left-0 top-0 max-w-none w-full h-full" 
          />
        </div>
      </div>
    </section>
  );
}
