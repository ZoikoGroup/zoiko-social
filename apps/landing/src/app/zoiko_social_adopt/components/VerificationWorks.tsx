import React from "react";

export default function VerificationWorks() {
  const steps = [
    {
      num: "1",
      title: "Organization identity",
      description: "The organization establishes its identity and authorization to represent the rescue or shelter."
    },
    {
      num: "2",
      title: "Operational legitimacy",
      description: "Zoiko Social checks the organization against defined participation requirements."
    },
    {
      num: "3",
      title: "Jurisdiction & policy",
      description: "Applicable location and policy requirements are considered where relevant."
    },
    {
      num: "4",
      title: "Review outcome",
      description: "Approved organizations receive a visible verified status. Rejected or pending statuses are handled privately."
    },
    {
      num: "5",
      title: "Ongoing integrity",
      description: "Verification may be reviewed again if material information changes or concerns arise."
    }
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6 pt-10">
      <div className="flex flex-col gap-2 text-center">
        <div className="text-cyan-950 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-[33px]">
          How verification works
        </div>
        <div className="text-teal-950 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
          A verified badge means Zoiko Social has completed its defined verification process — it isn't a guarantee of every future action or outcome.
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-4">
            <div className="w-[34px] h-[34px] bg-cyan-800 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-[15px] font-bold font-['Plus_Jakarta_Sans']">{step.num}</span>
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <div className="text-cyan-950 text-base font-bold font-['Plus_Jakarta_Sans']">
                {step.title}
              </div>
              <div className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-snug">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
