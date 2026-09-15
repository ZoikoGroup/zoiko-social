/**
 * Copy for the adoption-safety page, taken from the comp.
 */

export type Stage = {
  id: string;
  /** The label on the numbered chip. */
  title: string;
  /** The question the stage answers, shown under the panel heading. */
  question: string;
  doThis: string;
  whyItMatters: string;
  watchFor: string;
  nextStep: string;
};

/** The six numbered chips above the stage panel. */
export const STAGE_TITLES = [
  "Check the source",
  "Review the listing",
  "Communicate carefully",
  "Meet and assess",
  "Confirm fees & records",
  "Transition & follow up",
];

/** Only stage 1 is detailed in the comp. */
export const STAGES: Stage[] = [
  {
    id: "source",
    title: "Check the source",
    question: "Who is offering the animal?",
    doThis:
      "Prefer verified rescue or shelter sources. Open the organization profile and check its verification status.",
    whyItMatters:
      "The source is the foundation of a safe adoption — everything else builds on knowing who you're really dealing with.",
    watchFor:
      "An organization with no verification history, or one that resists sharing basic information about itself.",
    nextStep: "Move to reviewing the listing details once you're confident in the source.",
  },
];

export type GuidanceCard = {
  title: string;
  body: string;
  /** Cards describing a risk are drawn in the caution colours. */
  caution?: boolean;
};

export const BEFORE_YOU_INQUIRE: GuidanceCard[] = [
  {
    title: "Source verification",
    body: "Confirm whether the rescue or shelter has an active Verified status, and open “What this means” to understand it.",
  },
  {
    title: "Listing integrity",
    body: "Check name/species, location or service area, adoption status, source, published/updated dates, and care information for internal consistency.",
  },
  {
    title: "Household readiness",
    body: "Housing rules, household agreement, children or other animals, time, recurring care, accessibility, transport, and long-term responsibility.",
  },
  {
    title: "Cost readiness",
    body: "Prepare for legitimate adoption fees plus ongoing care. We don't publish invented “normal” fee ranges — legitimate fees vary widely.",
  },
  {
    title: "Species / jurisdiction readiness",
    body: "Some animals, locations, or transfers may have local requirements — check with local authority where available.",
  },
  {
    title: "Take time to review",
    body: "A thoughtful review beats urgency or competitive pressure. There's no rush that should override a careful decision.",
  },
];

export const COMMUNICATE_SAFELY: GuidanceCard[] = [
  {
    title: "First inquiry",
    body: "We explain what's necessary to begin and what's optional. Sensitive identity documents don't belong in a general message field.",
  },
  {
    title: "Contact continuity",
    body: "Key platform-mediated messages are kept where supported. If contact moves elsewhere, source and reporting access are preserved.",
  },
  {
    title: "Personal information",
    body: "Avoid exposing home address, government ID, financial credentials, or other sensitive data unless a protected, approved flow specifically requires it.",
  },
  {
    title: "External links",
    body: "Links open with domain/organization context, and we warn if a destination doesn't match an approved organization or provider.",
  },
  {
    title: "Pressure or unusual requests",
    body: "Pressure, secrecy, inconsistent identity, unusual payment requests, or attempts to bypass normal steps: pause and verify.",
    caution: true,
  },
  {
    title: "Minor users",
    body: "Age-appropriate restrictions and guardian involvement apply. A minor is never treated as the sole contracting party.",
  },
  {
    title: "Block & report",
    body: "You can block communications and report suspicious activity without losing the evidence needed for review.",
  },
];

export const MEET_SAFELY: GuidanceCard[] = [
  {
    title: "Meeting arrangement",
    body: "Follow the organization's approved process and an agreed environment. We don't publish private foster-home locations by default.",
  },
  {
    title: "Bring the right people",
    body: "Involve household decision-makers where appropriate, and follow the organization's rules for meeting children or resident animals.",
  },
  {
    title: "Animal handling",
    body: "Follow staff or foster guidance and species-appropriate handling. We don't encourage risky “test” behavior.",
  },
  {
    title: "Questions to ask",
    body: "History known to the organization, daily routine, care needs, behavior observations, medications, compatibility, transition plan, and return policy.",
  },
  {
    title: "Consistency check",
    body: "Confirm the animal, source, fee/terms, and process match the listing and your prior communications.",
  },
  {
    title: "If uncomfortable",
    body: "You can end the interaction, leave, and report later. Guilt about “saving” the animal is never a reason to ignore risk.",
  },
  {
    title: "Immediate danger",
    body: "If there's immediate danger to a person or animal, contact your local emergency or animal-welfare authority rather than waiting on platform review.",
    caution: true,
  },
];

export const PAYMENTS_FEES: GuidanceCard[] = [
  {
    title: "Fee transparency",
    body: "Shown where the organization supports it — required fee, optional donation, deposit, transport charge, and other costs are distinguished.",
  },
  {
    title: "Recipient identity",
    body: "The payment destination should match the verified organization or an approved payment provider or process.",
  },
  {
    title: "Payment method",
    body: "Favor traceable, policy-approved methods. We warn on unusual requests that bypass the organization's normal process.",
  },
  {
    title: "No surprise escalation",
    body: "Material fee changes after inquiry trigger a “Review changed terms” state and are recorded where supported.",
  },
  {
    title: "Agreement review",
    body: "Before final commitment, review the adoption agreement, return policy, health disclosures, and microchip/registration steps where applicable.",
  },
  {
    title: "Receipt / record",
    body: "You should receive, or the organization should provide, appropriate transaction and adoption records.",
  },
  {
    title: "No pressure",
    body: "No countdowns, “pay now to hold,” or competitive bidding mechanics. Default is prohibited unless narrowly and lawfully approved.",
    caution: true,
  },
];

export const TRANSPORT_SAFETY: GuidanceCard[] = [
  {
    title: "Local-first default",
    body: "Transport isn't implied to be required. We prefer safe, policy-compliant local or regional handoff where possible.",
  },
  {
    title: "Transport identity",
    body: "If transport is involved, it's clear who's responsible — the organization, an approved provider, or another party.",
  },
  {
    title: "Jurisdiction",
    body: "For cross-border movement, health, import/export, species, and documentation requirements may differ by region.",
  },
  {
    title: "Trafficking risk",
    body: "Inconsistent origin/destination, identity mismatch, repeated relisting, or unusual transport requests are flagged for review.",
    caution: true,
  },
  {
    title: "Private location",
    body: "We never reveal precise foster or private-home origin through maps, route previews, metadata, or downloadable documents.",
  },
  {
    title: "Unsupported routes",
    body: "If we can't validate or safely support a transport pattern, we say so clearly rather than improvising advice.",
  },
  {
    title: "Reporting",
    body: "Transport-related concerns stay reportable from the listing, organization, message, and handoff screens.",
  },
];

export const HEALTH_RECORDS: GuidanceCard[] = [
  {
    title: "Health information",
    body: "Shown as organization-disclosed facts with date/source where available — never as a Zoiko Social medical guarantee.",
  },
  {
    title: "Veterinary records",
    body: "We encourage adopters to request and review available veterinary records and understand ongoing care needs.",
  },
  {
    title: "Medications / special care",
    body: "Surfaced clearly before final commitment where disclosed — never hidden in a collapsed, low-priority section.",
  },
  {
    title: "Behavior observations",
    body: "Labeled as observations and context, not guaranteed future behavior — environment can change behavior.",
  },
  {
    title: "Unknown history",
    body: "“Unknown” is an acceptable, explicit value. We never fill gaps in an animal's history with assumptions.",
  },
  {
    title: "Post-adoption care",
    body: "We encourage appropriate veterinary and behavioral follow-up based on your circumstances, without diagnosing or prescribing.",
  },
  {
    title: "Medical emergency",
    body: "Urgent health emergencies need an appropriate veterinary or emergency service — platform support is never a substitute.",
    caution: true,
  },
];

export const HANDOFF_FIRST_DAYS: GuidanceCard[] = [
  {
    title: "Before transfer",
    body: "Confirm animal identity, organization, authorized recipient, final agreement, fee/receipt, records, supplies, and transport responsibility.",
  },
  {
    title: "At handoff",
    body: "Receive relevant records, medication/care instructions, microchip/registration steps, organization contact, and return/support process.",
  },
  {
    title: "First 24–72 hours",
    body: "Follow a calm transition plan appropriate to the animal and household — we don't guarantee an adjustment timeline.",
  },
  {
    title: "First weeks",
    body: "Use organization or professional support for questions, keep documents accessible, and update contact/microchip details.",
  },
  {
    title: "Concern discovered",
    body: "Document it, preserve messages/records, contact the organization where appropriate, and use Report a Concern for platform or welfare issues.",
  },
  {
    title: "Severe or immediate welfare issue",
    body: "Use the appropriate local veterinary, animal-welfare, law-enforcement, or emergency channel — don't wait solely for platform response.",
    caution: true,
  },
];

export type Callout = {
  label: string;
  quote: string;
  caution?: boolean;
};

export const CALLOUTS: Callout[] = [
  {
    label: "Before you send a message",
    quote:
      "Share only what is needed for the adoption process. Do not send passwords, banking credentials, or identity documents in a general message.",
  },
  {
    label: "Leaving the platform",
    quote:
      "You're leaving Zoiko Social. Confirm that this contact method belongs to the rescue or shelter before sharing personal information or making a payment.",
  },
  {
    label: "Something feels off",
    quote:
      "Something doesn't match the expected adoption process? Pause, verify the organization, and report the concern if needed.",
    caution: true,
  },
];

/** The checklist in the hero card. The first two start ticked, as in the comp. */
export const CHECKLIST = [
  { id: "profile", label: "I reviewed the organization profile", done: true },
  { id: "status", label: "I understand its verification status", done: true },
  { id: "contact", label: "Contact path matches the organization", done: false },
  { id: "listing", label: "I reviewed the listing details", done: false },
];

/** The full checklist. Sixteen items, matching the comp's "0 of 16 checked". */
export const CHECKLIST_GROUPS: { group: string; items: string[] }[] = [
  {
    group: "Source",
    items: [
      "I reviewed the organization profile",
      "I understand its verification status",
      "The contact path matches the organization",
    ],
  },
  {
    group: "Listing",
    items: ["I reviewed known history, care needs, location, status, and disclosed fees/terms"],
  },
  {
    group: "Household",
    items: [
      "Housing and household decision-makers are aligned",
      "I considered ongoing care and long-term responsibility",
    ],
  },
  {
    group: "Communication",
    items: [
      "I haven't shared unnecessary sensitive information",
      "Any external contact/payment destination matches the organization",
    ],
  },
  {
    group: "Meeting",
    items: [
      "I understand the meeting/handoff plan",
      "I know who I'm meeting and where",
      "I can leave if something feels inconsistent",
    ],
  },
  {
    group: "Fees / records",
    items: [
      "I understand the fee/payment path and agreement",
      "I know what records I'll receive at handoff",
    ],
  },
  {
    group: "Aftercare",
    items: [
      "I know the organization's support/return contact",
      "I know where to seek veterinary/professional help if needed",
      "I understand checking these boxes doesn't guarantee a safe outcome",
    ],
  },
];

export type RedFlag = { title: string; body: string };

export const RED_FLAGS: RedFlag[] = [
  {
    title: "Identity mismatch",
    body: "The organization, contact, or payment recipient doesn't match the known source. Pause, review the source profile, and consider reporting.",
  },
  {
    title: "Unexpected urgency",
    body: "Pressure to pay, travel, or complete handoff immediately without normal checks. There's no urgency that should override the process.",
  },
  {
    title: "Unusual payment request",
    body: "Payment path changes, is inconsistent with the organization, or requires unusual secrecy. Verify before paying.",
  },
  {
    title: "Refusal to provide process clarity",
    body: "You can't get basic information on the source, animal, terms, or handoff. Use the checklist and consider reporting.",
  },
  {
    title: "Listing inconsistency",
    body: "Animal details, photos, location, availability, or organization identity materially conflict. Report as duplicate or misrepresentation.",
  },
  {
    title: "Unusual transport story",
    body: "A third party, route, or fees seem inconsistent or can't be tied to the organization. Ask for clarity, or report.",
  },
  {
    title: "Request for excessive sensitive data",
    body: "A general message asks for banking passwords, credentials, or unrelated identity documents. Don't send it — report instead.",
  },
  {
    title: "Attempt to bypass safeguards",
    body: "A request to avoid verification, reporting, the organization's process, or traceable records. This is a clear reason to pause.",
  },
];

export type ReportRoute = {
  title: string;
  note: string;
  action: string;
  /** Emergency routes are drawn in the danger palette. */
  emergency?: boolean;
  /** Support sits apart from the reporting routes. */
  support?: boolean;
};

export const REPORT_ROUTES: ReportRoute[] = [
  {
    title: "Suspicious listing, organization, or message",
    note: "Doesn't match the expected process",
    action: "Report a Concern",
  },
  {
    title: "Possible animal welfare abuse or exploitation",
    note: "Signs of neglect, mistreatment, or exploitation",
    action: "Report a Concern",
  },
  {
    title: "Possible fraud or impersonation",
    note: "Identity, payment, or contact mismatch",
    action: "Report a Concern",
  },
  {
    title: "Immediate danger to an animal or person",
    note: "This is not an emergency response service",
    action: "Contact local emergency / animal-welfare authority",
    emergency: true,
  },
  {
    title: "Veterinary emergency",
    note: "Platform content is not a substitute for clinical care",
    action: "Contact a veterinary / emergency service",
    emergency: true,
  },
  {
    title: "Billing or payment issue with a Zoiko Social product",
    note: "Kept separate from adoption disputes",
    action: "Contact Support",
    support: true,
  },
];

/**
 * The comp draws these collapsed and supplies no answers, so the answers are
 * written from the guidance on this page and keep its limits: verification
 * reduces risk, it never guarantees an outcome.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I know if a rescue or shelter is verified?",
    a: "Open the organization's profile and check whether it has an active Verified status, then open “What this means” to see what was checked. Verification is a trust signal about the organization — it is not a judgement about any single listing.",
  },
  {
    q: "Is it safe to adopt an animal online?",
    a: "It can be, when the source is verified and the process is followed: check the source, review the listing, communicate carefully, meet and assess, confirm fees and records, then plan the transition. Verification and platform safeguards reduce risk, but no online process can guarantee a specific adoption outcome or future conduct.",
  },
  {
    q: "What are common adoption red flags?",
    a: "Identity mismatch, unexpected urgency, unusual payment requests, refusal to give basic process clarity, listing inconsistencies, an unusual transport story, requests for excessive sensitive data, and any attempt to bypass safeguards. None of these is proof of wrongdoing on its own — each is a reason to slow down and check.",
  },
  {
    q: "Should I pay before meeting an animal?",
    a: "Be cautious. Payment should follow the organization's normal process, use traceable and policy-approved methods, and go to a destination that matches the verified organization or an approved provider. Pressure to pay immediately, “pay now to hold” mechanics, and requests for secrecy are red flags.",
  },
  {
    q: "Does Zoiko verification guarantee an adoption is safe?",
    a: "No. Verification and moderation are separate trust signals, never a safety guarantee. They reduce risk and make the source clearer, but they cannot guarantee an outcome or anyone's future conduct — which is why the checklist and red flags on this page still matter.",
  },
  {
    q: "What should I receive at adoption handoff?",
    a: "Relevant records, medication and care instructions, microchip and registration steps, a contact at the organization, and the return or support process. You should also receive appropriate transaction and adoption records, or the organization should provide them.",
  },
  {
    q: "What if I think a listing is fraudulent or harmful?",
    a: "Document what you saw, preserve the messages and records, and use Report a Concern — it stays available from the listing, organization, message, and handoff screens. You can block communications without losing the evidence needed for review. If an animal or person is in immediate danger, contact your local emergency or animal-welfare authority first.",
  },
  {
    q: "Can I adopt across state, province, or country borders?",
    a: "Sometimes, but transport is never assumed to be required — a safe local or regional handoff is preferred. For cross-border movement, health, import and export, species, and documentation requirements differ by region, so check with your local authority. Where a transport pattern can't be validated or safely supported, we say so rather than improvising advice.",
  },
];
