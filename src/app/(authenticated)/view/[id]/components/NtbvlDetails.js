import React from "react";
import { DetailsField } from "./SharedComponents";

export default function NtbvlDetails({ summary, setIsBusinessModalOpen }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-brand-blue to-[#043662] px-6 py-4 flex items-center justify-between select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Additional details (NTBVL)
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsField label="Prefix" value={summary.prefix} />
          <DetailsField label="Gender" value={summary.gender} />
          <DetailsField label="Father Name" value={summary.father_name} />
          <DetailsField label="Mother Name" value={summary.mother_name} />
          <DetailsField label="Marital Status" value={summary.marital_status} />
          <DetailsField label="Occupation" value={summary.occupation} />
          <DetailsField label="Education" value={summary.qualification} />
          <DetailsField label="Annual Income" value={summary.annual_income} />
          <DetailsField label="Purpose Of Loan" value={summary.purpose_of_loan} />
          <DetailsField label="Employment Status" value={summary.employment_status} />
          <DetailsField label="Application Login" value={summary.created_on} />
          <DetailsField label="Disbursement Date" value={summary.loan_disbusement_on} />
        </div>

        {summary.credit_status !== "Approved" && (
          <button
            onClick={() => setIsBusinessModalOpen(true)}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl self-start transition cursor-pointer"
          >
            UPDATE NTBVL DETAILS
          </button>
        )}
      </div>
    </div>
  );
}
