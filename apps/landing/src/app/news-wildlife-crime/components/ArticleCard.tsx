import React from 'react';
import Image from 'next/image';

interface TagProps {
  label: string;
  variant: 'default' | 'tier1' | 'tier2' | 'multi' | 'success' | 'warning' | 'danger';
}

interface ArticleCardProps {
  title: string;
  description: string;
  dateStr: string;
  tags: TagProps[];
  imageSrc?: string;
  imageAlt?: string;
  isLead?: boolean;
  isSensitive?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  description,
  dateStr,
  tags,
  imageSrc,
  imageAlt,
  isLead = false,
  isSensitive = false,
}) => {
  return (
    <div className={`flex flex-col md:flex-row bg-white rounded-[20px] lg:rounded-[28px] border border-[#DCE5E8] overflow-hidden ${isLead ? 'shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]' : ''}`}>
      {/* Image Area */}
      {imageSrc && (
        <div className={`relative ${isLead ? 'w-full md:w-[350px] lg:w-[410px] h-[300px] md:h-auto' : 'w-full md:w-[190px] h-[200px] md:h-auto'} flex-shrink-0 bg-[#F7F9FA]`}>
          <Image 
            src={imageSrc} 
            alt={imageAlt || title}
            fill
            className={`object-cover ${isSensitive ? 'blur-md scale-110' : ''}`}
          />
          {isSensitive && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end pb-5">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-2">
                <path d="M8 1.5L1 14H15L8 1.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="12.5" r="1" fill="white"/>
              </svg>
              <span className="text-white text-[12px] font-semibold">Sensitive — tap to reveal</span>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className={`flex flex-col p-6 lg:p-8 flex-1`}>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <div key={idx} className={`rounded-md px-2.5 py-1 text-[11px] font-bold flex items-center gap-1.5 ${
              tag.variant === 'tier1' ? 'bg-[#EEF8F9] text-[#073B47]' :
              tag.variant === 'tier2' ? 'bg-[#EEF8F9] text-[#073B47]' :
              tag.variant === 'multi' ? 'bg-[#FFF5E8] text-[#C9701A]' :
              tag.variant === 'warning' ? 'bg-[#FFF5E8] text-[#E88924]' :
              'bg-[#F7F9FA] text-[#5E7076]'
            }`}>
              {tag.variant === 'tier1' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4 8L9 2" stroke="#073B47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tag.variant === 'tier2' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4 8L9 2" stroke="#073B47" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tag.variant === 'warning' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="4" stroke="#E88924" strokeWidth="1.5"/>
                  <path d="M5 3V5L6 6" stroke="#E88924" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {tag.variant === 'default' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="4.25" stroke="#5E7076" strokeWidth="1.5"/>
                </svg>
              )}
              {tag.label}
            </div>
          ))}
        </div>

        <h3 className="text-[#102A32] font-extrabold text-[21px] lg:text-[20px] leading-[1.3] tracking-[-0.01em] mb-4">
          {title}
        </h3>

        <p className="text-[#5E7076] text-[13px] leading-[1.6] mb-4">
          {description}
        </p>

        <div className="text-[#5E7076] text-[11.5px] mt-auto">
          {dateStr}
        </div>
        
        {isLead && (
          <p className="text-[#5E7076] text-[11.5px] mt-2 mb-1 leading-[1.5]">
            Enforcement action confirms official activity — it is not a finding of guilt against any individual.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button className="bg-[#073B47] text-white font-semibold text-[13px] rounded-[10px] h-[32px] px-4 flex items-center gap-2">
            Read Story
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="bg-white text-[#102A32] font-semibold text-[13px] rounded-[10px] h-[32px] px-4 border border-[#DCE5E8]">
            Save
          </button>
          {isLead && (
            <button className="bg-white text-[#102A32] font-semibold text-[13px] rounded-[10px] h-[32px] px-4 border border-[#DCE5E8]">
              Track this case
            </button>
          )}
        </div>

        {isLead && (
          <div className="flex items-center gap-6 mt-4 text-[#5E7076] text-[12px] font-medium">
            <button className="hover:text-[#102A32]">Share</button>
            <button className="hover:text-[#102A32]">Follow Seizures & Interdictions</button>
            <button className="hover:text-[#102A32]">Report an inaccuracy</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
