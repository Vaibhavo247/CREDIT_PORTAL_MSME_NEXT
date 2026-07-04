import React from "react";
import { Download } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { DetailsField } from "./SharedComponents";

export default function BusinessDetails({
  id,
  summary,
  isReportLoading,
  distanceVal,
  branchNameVal,
  googleBizName,
  googleAddress,
  googlePhone,
  googleStatus,
  googleRating,
  appCountSameMobile,
  distinctApps100m,
  isBusinessDetailsChecked,
  setIsBusinessDetailsChecked,
  setIsBusinessModalOpen,
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <div className="bg-linear-to-r from-brand-blue to-[#043662] px-6 py-4 flex items-center justify-between select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Business Details
        </h3>

        <div className="flex gap-2">
          <a
            href={`/api/download/pdf/${id}`}
            target="_blank"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={12} />
            PDF Summary
          </a>
          <a
            href={`/api/download/excel/${id}`}
            target="_blank"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={12} />
            Excel Summary
          </a>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsField label="Udyam Number" value={summary.udhyam_no} />
          <DetailsField label="Business Name (Udyam)" value={summary.udyam_name} />
          <DetailsField label="Incorporation Date" value={summary.business_incorp_date} />
          <DetailsField label="Udyam Registration Date" value={summary.udyam_incorp_date} />
          <DetailsField label="Udyam Entity Type" value={summary.udyam_entity_type} />
          <DetailsField label="Business Mobile" value={summary.business_phone} />
          <DetailsField label="Business Mail ID" value={summary.business_email} />
          <DetailsField label="Business Address" value={summary.business_address} />
          <DetailsField label="Business State" value={summary.business_state} />
          <DetailsField label="Business Pincode" value={summary.business_pincode} />
          <DetailsField label="Sector" value={summary.sector} />
          <DetailsField label="Subsector" value={summary.subsector} />
          <DetailsField label="Business Name (By User)" value={summary.business_name_byuser} />
          
          {isReportLoading ? (
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-2xl border border-gray-100 mt-2">
              <Spinner size="md" />
              <p className="mt-3 text-sm font-medium text-gray-500 animate-pulse">Fetching live business data...</p>
            </div>
          ) : (
            <>
              <DetailsField
                label="Distance to nearest branch (KM)"
                value={(distanceVal !== undefined && distanceVal !== null && distanceVal !== "N/A") ? Number(distanceVal).toFixed(2) : "N/A"}
              />
              <DetailsField label="Nearest Branch Name" value={branchNameVal} />
              <DetailsField label="Google Business Name" value={googleBizName} />
              <DetailsField label="Google Business Address" value={googleAddress} />
              <DetailsField label="Google Phone Number" value={googlePhone} />
              <DetailsField label="Google Business Status" value={googleStatus} />
              <DetailsField label="Google Review Rating" value={googleRating} />
              <DetailsField label="App Count (Same Mobile)" value={appCountSameMobile} />
              <DetailsField label="Distinct Apps (100m Lat/Long)" value={distinctApps100m} />
            </>
          )}
        </div>

        {/* Mobile Authentication Checkbox */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3 mt-2">
          <input
            type="checkbox"
            id="mobile-auth-check"
            checked={isBusinessDetailsChecked}
            onChange={(e) => setIsBusinessDetailsChecked(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-brand-orange focus:ring-brand-orange accent-brand-orange shrink-0 cursor-pointer mt-0.5"
          />
          <label htmlFor="mobile-auth-check" className="text-xs text-amber-900 leading-relaxed font-semibold cursor-pointer select-none">
            I/We have authenticated the mobile number mentioned on the Shop board and the business mobile number entered by the sales is same.
          </label>
        </div>

        {/* Update Details Trigger */}
        {summary.credit_status !== "Approved" && summary.loan_status !== "Rejected" && (
          <button
            onClick={() => setIsBusinessModalOpen(true)}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl self-start transition cursor-pointer"
          >
            UPDATE BUSINESS DETAILS
          </button>
        )}
      </div>
    </div>
  );
}
