import React from "react";
import { DetailsField } from "./SharedComponents";

export default function CustomerDetails({ summary, loadLoanJourney, setIsJourneyOpen }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <div className="bg-linear-to-r from-brand-blue to-[#043662] px-6 py-4 flex items-center justify-between select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Customer Details
        </h3>
        <button
          onClick={() => {
            loadLoanJourney();
            setIsJourneyOpen(true);
          }}
          className="px-3.5 py-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          View Loan Journey
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailsField label="Full Name" value={summary.full_name} />
        <DetailsField label="Date of Birth" value={summary.dob} />
        <DetailsField label="Mobile Number" value={summary.mobile_no} />
        <DetailsField label="Email Address" value={summary.email_address} />
        <DetailsField label="Pan Number" value={summary.pan_no} />
        <DetailsField label="Aadhar Number" value={summary.aadhar_no} />
        <DetailsField label="Aadhar Ref Number" value={summary.aadhar_reference_no} />
        <DetailsField label="Customer ID" value={summary.customer_id} />
        <DetailsField
          label="Agent ID &amp; Name"
          value={`${summary.agent_id || "N/A"} - ${summary.FirstName || ""} ${summary.LastName || ""}`}
        />
        <DetailsField label="Agent Mobile" value={summary.MobileNo} />
        <DetailsField
          label="Current Address"
          value={`${summary.c_address_line1 || ""} ${summary.c_address_line2 || ""} ${summary.c_address_line3 || ""} ${summary.c_address_city || ""} ${summary.c_address_state || ""} PIN: ${summary.c_address_pincode || ""}`}
          className="col-span-1 md:col-span-2"
        />
        <DetailsField
          label="Permanent Address"
          value={`${summary.a_address_line1 || ""} ${summary.a_address_line2 || ""} ${summary.a_address_line3 || ""} ${summary.a_address_city || ""} ${summary.a_address_state || ""} PIN: ${summary.a_address_pincode || ""}`}
          className="col-span-1 md:col-span-2"
        />
        <DetailsField label="Landmark By Agent" value={summary.landmark_by_agent} />
        <DetailsField label="Branch Code" value={summary.branch_code ? `${summary.branch_code} - ${summary.branch_name || ''}` : "N/A"} />
        <DetailsField label="Application Status" value={summary.loan_status} />
        <DetailsField label="Credit Comment" value={summary.credit_comment} className="col-span-1 md:col-span-2" />
        <DetailsField label="Agent Comment" value={summary.agent_comment} className="col-span-1 md:col-span-2" />
      </div>
    </div>
  );
}
