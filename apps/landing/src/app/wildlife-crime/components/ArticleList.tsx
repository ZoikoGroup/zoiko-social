import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleList = () => {
  return (
    <div className="w-full max-w-[922px] mt-8 mb-20 flex flex-col gap-[36px]">
      {/* Lead Cluster */}
      <ArticleCard
        isLead={true}
        title="Multi-country ivory trafficking network dismantled in coordinated customs operation"
        description="Customs authorities across three countries report a coordinated operation that confiscated ivory shipments and disrupted a regional trafficking network. Enforcement action is confirmed; no individual charges have been publicly filed yet."
        dateStr="Published 2 days ago · Updated 22 minutes ago · Region: Three countries, Southeast Asia (national authorities)"
        imageSrc="/wildlife-crime/seizure-crates.png"
        tags={[
          { label: "Regional Customs Enforcement Bureau · Tier 1", variant: "tier1" },
          { label: "Seizures & Interdictions", variant: "default" },
          { label: "Enforcement action", variant: "warning" },
          { label: "Confiscated", variant: "tier1" }
        ]}
      />

      <div className="flex flex-col gap-9">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Illegal Wildlife Trade</h2>
          </div>
          
          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Online marketplace listings for protected reptile species removed after investigation"
              description="An investigative report found protected reptile species listed for sale on an online marketplace. Listings were removed after the platform confirmed a violation."
              dateStr="Published 1 day ago · Multiple countries (broad)"
              imageSrc="/wildlife-crime/reptile,market,exotic.png"
              tags={[
                { label: "Environmental Reporting Collective · Tier 1", variant: "tier1" },
                { label: "Investigation confirmed", variant: "default" },
                { label: "Investigative reporting", variant: "multi" }
              ]}
            />

            <ArticleCard
              title="Advocacy group reports rise in online exotic pet trade"
              description="An advocacy organization's own report describes a rise in online exotic pet trade activity. This is the organization's statement, not independent reporting."
              dateStr="Published 3 days ago · Global (broad)"
              imageSrc="/wildlife-crime/exotic-parrot.png"
              tags={[
                { label: "Wildlife Trade Watch (organization report) · Tier 2", variant: "tier2" },
                { label: "Organization report", variant: "multi" }
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Poaching</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Anti-poaching patrol reports decline in rhino poaching incidents this quarter"
              description="A national park authority's enforcement record reports a quarterly decline in confirmed rhino poaching incidents across its patrol area."
              dateStr="Published 4 days ago · Southern Africa (national park authority)"
              imageSrc="/wildlife-crime/Background.png"
              tags={[
                { label: "National Park Enforcement Authority · Tier 1", variant: "tier1" },
                { label: "Official enforcement record", variant: "multi" }
              ]}
            />
            
            <ArticleCard
              title="Poaching incident under investigation at protected reserve"
              description="Authorities confirm an investigation into a poaching incident at a protected reserve. Operational and location details remain withheld while the investigation is active."
              dateStr="Published 8 hours ago · Location withheld for operational safety"
              imageSrc="/wildlife-crime/forest-ranger.png"
              isSensitive={true}
              tags={[
                { label: "State Wildlife Enforcement Agency · Tier 1", variant: "tier1" },
                { label: "Investigation confirmed", variant: "default" },
                { label: "Official enforcement record", variant: "multi" }
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Unlawful Capture/Possession</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Man charged after dozens of protected birds found in private collection"
              description="Authorities have filed formal charges after dozens of protected bird species were found in an unlicensed private collection."
              dateStr="Published 2 days ago · Regional court jurisdiction"
              imageSrc="/wildlife-crime/parrot-cage-bird.png"
              tags={[
                { label: "National Enforcement Wire · Tier 1", variant: "tier1" },
                { label: "Charged", variant: "multi" },
                { label: "Court filing", variant: "multi" }
              ]}
            />

            <ArticleCard
              title="Charges dismissed against exotic pet owner citing lack of evidence"
              description="A court has dismissed charges against an exotic pet owner, citing insufficient evidence to proceed. This is a material update to a previously charged case."
              dateStr="Published 6 days ago · District court jurisdiction"
              imageSrc="/wildlife-crime/courthouse.png"
              tags={[
                { label: "District Court Record · Tier 1", variant: "tier1" },
                { label: "Case dismissed", variant: "default" },
                { label: "Court judgment", variant: "multi" }
              ]}
            />
          </div>
        </div>

        {/* New sections from image 3 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Seizures & Interdictions</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Customs seizes major shipment of illegal timber destined for export"
              description="Customs agents have intercepted a large shipment of illegal timber concealed within commercial cargo. The shipment was seized before departure."
              dateStr="Published 2 days ago · Port Authority"
              imageSrc="/wildlife-crime/hero-cargo.png"
              tags={[
                { label: "Port Authority Log · Tier 1", variant: "tier1" },
                { label: "Enforcement action", variant: "multi" }
              ]}
            />
            <ArticleCard
              title="Regional customs agency reports increase in pangolin scale seizures"
              description="A regional customs agency has published a report noting a year-over-year increase in seizures of pangolin scales at major transit hubs."
              dateStr="Published 5 days ago · Regional customs authority"
              imageSrc="/wildlife-crime/seizure-crates.png"
              tags={[
                { label: "Regional Customs Enforcement Bureau · Tier 1", variant: "tier1" },
                { label: "Official enforcement record", variant: "multi" }
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Investigations & Charges</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Architect of smuggling ring pleads guilty after multi-year case"
              description="A defendant identified as a key architect of a wildlife smuggling network has entered a guilty plea following a multi-year investigation."
              dateStr="Published 1 week ago · Federal court record"
              imageSrc="/wildlife-crime/courthouse.png"
              tags={[
                { label: "Federal Court Record · Tier 1", variant: "tier1" },
                { label: "Convicted", variant: "multi" },
                { label: "Court filing", variant: "default" }
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Court Judgments</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="Trafficking network leader sentenced following multi-year investigation"
              description="A court has convicted and sentenced the leader of a wildlife trafficking network following a multi-year investigation and prosecution."
              dateStr="Published 1 week ago · National court jurisdiction"
              imageSrc="/wildlife-crime/courthouse.png"
              tags={[
                { label: "National Court Record · Tier 1", variant: "tier1" },
                { label: "Final judgment", variant: "multi" },
                { label: "Court judgment", variant: "default" }
              ]}
            />
            <ArticleCard
              title="Trial begins for suspects in international wildlife smuggling case"
              description="Court proceedings have commenced for multiple suspects indicted in an international wildlife smuggling case."
              dateStr="Published 2 weeks ago · District court"
              imageSrc="/wildlife-crime/courthouse.png"
              tags={[
                { label: "District Court Record · Tier 1", variant: "tier1" },
                { label: "Case in court", variant: "multi" },
                { label: "Court filing", variant: "default" }
              ]}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-[6px] h-[6px] bg-[#E88924]"></div>
            <h2 className="text-[#073B47] text-[16px] font-extrabold tracking-[-0.01em]">Enforcement Policy</h2>
          </div>

          <div className="flex flex-col gap-6">
            <ArticleCard
              title="New cross-border task force announced to combat wildlife trafficking"
              description="Multiple governments have announced a new cross-border task force focused on disrupting wildlife trafficking networks and coordinating enforcement."
              dateStr="Published 2 days ago · Multi-national (broad)"
              imageSrc="/wildlife-crime/hero-cargo.png"
              tags={[
                { label: "Intergovernmental Wildlife Council · Tier 1", variant: "tier1" },
                { label: "Intergovernmental report", variant: "multi" }
              ]}
            />
            <ArticleCard
              title="Updated sentencing guidelines proposed for wildlife trafficking offenses"
              description="A proposed update to sentencing guidelines for wildlife trafficking offenses has been published for review by the issuing authority."
              dateStr="Published 4 days ago · National authority"
              imageSrc="/wildlife-crime/courthouse.png"
              tags={[
                { label: "National Sentencing Commission · Tier 1", variant: "tier1" },
                { label: "Law or regulation", variant: "multi" }
              ]}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleList;
