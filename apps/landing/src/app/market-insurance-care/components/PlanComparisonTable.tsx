import React from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";

export default function PlanComparisonTable() {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-10 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Filter Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-500 mb-4 tracking-wide">
            Find plans for your pet
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter 1 */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                LOCATION / JURISDICTION
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white">
                <span>All supported regions</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filter 2 */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                PET TYPE
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white">
                <span>All species</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filter 3 */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                PLAN TYPE
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white">
                <span>All types</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filter 4 */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                COVERAGE FOCUS
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white">
                <span>All categories</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 px-2">
          <span>Comparing 4 plans</span>
          <span className="text-xs text-gray-400 mt-1 sm:mt-0">
            Desktop view: scroll right to see all terms
          </span>
        </div>

        {/* Comparison Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-[#F7F9FA] border-gray-100">
                  <th className="p-5 w-1/5"></th>
                  <th className="p-5 w-1/5 align-top">
                    <div className="font-bold text-[#1a2d37] text-base mb-1">
                      PetGuard Insurance
                    </div>
                    <div className="text-[10px] font-bold tracking-wider text-orange-500 uppercase">
                      INSURANCE
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Accident &amp; Illness
                    </div>
                  </th>
                  <th className="p-5 w-1/5 align-top">
                    <div className="font-bold text-[#1a2d37] text-base mb-1">
                      WellnessPlus Care Plan
                    </div>
                    <div className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">
                      CARE PLAN
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Subscription
                    </div>
                  </th>
                  <th className="p-5 w-1/5 align-top">
                    <div className="font-bold text-[#1a2d37] text-base mb-1">
                      BestCare Insurance
                    </div>
                    <div className="text-[10px] font-bold tracking-wider text-orange-500 uppercase">
                      INSURANCE
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Comprehensive
                    </div>
                  </th>
                  <th className="p-5 w-1/5 align-top">
                    <div className="font-bold text-[#1a2d37] text-base mb-1">
                      HealthGuard Wellness
                    </div>
                    <div className="text-[10px] font-bold tracking-wider text-teal-600 uppercase">
                      CARE PLAN
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Preventive
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-[#334155]">
                {/* Row: Monthly Cost */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Monthly Cost (Adult Dog)
                  </td>
                  <td className="p-5 text-gray-400">-</td>
                  <td className="p-5 font-semibold text-gray-900">$29</td>
                  <td className="p-5 font-semibold text-gray-900">$48-$68</td>
                  <td className="p-5 font-semibold text-gray-900">$22</td>
                </tr>

                {/* Row: Deductible */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">Deductible</td>
                  <td className="p-5">($500 annual</td>
                  <td className="p-5">$0 (subscription model)</td>
                  <td className="p-5">$250-$1000 per year</td>
                  <td className="p-5">$0 (preventive focus)</td>
                </tr>

                {/* Row: Accident & Illness Reimbursement */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Accident &amp; Illness Reimbursement
                  </td>
                  <td className="p-5">70% after deductible</td>
                  <td className="p-5 text-gray-400">Not covered</td>
                  <td className="p-5">80% after deductible</td>
                  <td className="p-5 text-gray-400">Not covered</td>
                </tr>

                {/* Row: Routine/Wellness Covered */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Routine/Wellness Covered
                  </td>
                  <td className="p-5">Optional rider: +$15/mo</td>
                  <td className="p-5">Yes, exams + vaccines</td>
                  <td className="p-5">Optional add-on: +$20/mo</td>
                  <td className="p-5">Yes, preventive only</td>
                </tr>

                {/* Row: Annual Benefit Limit */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Annual Benefit Limit
                  </td>
                  <td className="p-5">$10,000</td>
                  <td className="p-5 text-gray-500">N/A (capped benefits)</td>
                  <td className="p-5">$20,000</td>
                  <td className="p-5 text-gray-500">N/A (fixed benefits)</td>
                </tr>

                {/* Row: Waiting Period (Accidents) */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Waiting Period (Accidents)
                  </td>
                  <td className="p-5">24 hours</td>
                  <td className="p-5">None (subscription)</td>
                  <td className="p-5">7 days</td>
                  <td className="p-5">None (subscription)</td>
                </tr>

                {/* Row: Waiting Period (Illness) */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Waiting Period (Illness)
                  </td>
                  <td className="p-5">14 days</td>
                  <td className="p-5 text-gray-400">N/A</td>
                  <td className="p-5">30 days</td>
                  <td className="p-5 text-gray-400">N/A</td>
                </tr>

                {/* Row: Exclusions */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">Exclusions</td>
                  <td className="p-5">See terms</td>
                  <td className="p-5">Pre-existing, non-routine</td>
                  <td className="p-5">See terms</td>
                  <td className="p-5">Pre-existing, major illness</td>
                </tr>

                {/* Row: Maximum Age Enrollment */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Maximum Age Enrollment
                  </td>
                  <td className="p-5">8 years</td>
                  <td className="p-5">No age limit</td>
                  <td className="p-5">10 years</td>
                  <td className="p-5">Senior plans available</td>
                </tr>

                {/* Row: Provider Network */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Provider Network
                  </td>
                  <td className="p-5">All licensed vets</td>
                  <td className="p-5">Preferred network</td>
                  <td className="p-5">All licensed vets</td>
                  <td className="p-5">Preferred network</td>
                </tr>

                {/* Row: Cancellation */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Cancellation
                  </td>
                  <td className="p-5">Anytime, 30-day notice</td>
                  <td className="p-5">Anytime, end of billing cycle</td>
                  <td className="p-5">Anytime, 30-day notice</td>
                  <td className="p-5">Anytime, end of month</td>
                </tr>

                {/* Row: Effective Date (New Plans) */}
                <tr>
                  <td className="p-5 bg-[#F7F9FA] font-medium text-gray-700">
                    Effective Date (New Plans)
                  </td>
                  <td className="p-5">30 days from enrollment</td>
                  <td className="p-5">Upon payment received</td>
                  <td className="p-5">14 days from enrollment</td>
                  <td className="p-5">Upon payment received</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Disclaimer Box */}
        <div className="bg-[#FFF5E8] border border-[#E88924] rounded-2xl p-6 text-xs text-[#7c4a17] space-y-3">
          <div className="flex items-center space-x-2 font-bold text-[#b45309] text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Important: Read the full terms before enrolling</span>
          </div>

          <p className="leading-relaxed text-[#102A32]">
            This comparison shows key points but is not a complete policy
            summary. All plans have specific exclusions, limitations, and
            conditions that matter to your decision.
          </p>

          <div className="font-semibold text-[#7c4a17]">You must:</div>

          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[#102A32]">
            <li>Review the complete policy/plan documents</li>
            <li>Understand waiting periods and exclusions</li>
            <li>
              Verify coverage applies to your pet&apos;s age, breed, and health
              status
            </li>
            <li>Check what happens when you cancel or change plans</li>
            <li>Confirm provider/vet network for your area</li>
          </ul>

          <p className="text-[11px] text-[#7c4a17]/75 pt-1">
            Zoiko Social does not guarantee claim approval, savings, or coverage
            of specific conditions. Your actual claim payout depends on the
            plan&apos;s terms, your pet&apos;s eligibility, and the claim
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
