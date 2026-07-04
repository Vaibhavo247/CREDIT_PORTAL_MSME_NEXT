import React from "react";
import toast from "react-hot-toast";
import { DetailsField } from "./SharedComponents";
import Button from "@/components/ui/Button";

export default function LoanDetails({
  summary,
  eligibilityCriteria,
  selectedPdf,
  setSelectedPdf,
  loading,
  handleUdyamDocSubmit,
  setIsLandmarkModalOpen,
}) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white">
      <div className="bg-linear-to-r from-brand-blue to-[#043662] px-6 py-4 select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Loan Details
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailsField label="Approved Loan Amount" value={summary.approved_loan_amount} />
          <DetailsField label="Requested Loan Amount" value={summary.final_loan_amount} />
          <DetailsField label="BRE Status" value={summary.bre_status || "COMPLETED"} />
          <DetailsField label="BRE Remark" value={summary.loan_rejection_reason} />
          <DetailsField label="Tenure (Months)" value={summary.loan_total_duration_in_months} />
          <DetailsField label="Processing Fee" value={summary.processing_fees} />
          <DetailsField label="First EMI Date" value={summary.loan_first_emi_date} />
          <DetailsField label="EMI Amount" value={summary.monthly_emi_amount} />
          <DetailsField label="Eligibility Criteria" value={eligibilityCriteria} />
          <DetailsField
            label="BRE Execution Time"
            value={summary.bre_executed_on ? new Date(summary.bre_executed_on).toLocaleDateString("en-GB") : "N/A"}
          />

          <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              CRIF Report
            </span>
            <Button
              onClick={() =>
                window.open(
                  `http://MSME.suryodaybank.com/crif_html/bre=MSME/report_id=${summary.application_id}`,
                  "_blank"
                )
              }
              variant="outline"
              className="self-start border-brand-orange text-brand-orange hover:bg-brand-orange/5"
            >
              Open CRIF Bureau Report
            </Button>
          </div>
        </div>

        {/* Landmark and Udyam Document Upload Forms */}
        {summary.credit_status !== "Approved" && summary.loan_status !== "Rejected" && (
          <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Udyam PDF */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-gray-500">
                Upload Udyam Document (PDF)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === "application/pdf") {
                      setSelectedPdf(file);
                    } else {
                      toast.error("Only PDF files are supported.");
                    }
                  }}
                  className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-brand-blue hover:file:bg-gray-200 cursor-pointer"
                />
                {selectedPdf && (
                  <Button
                    onClick={handleUdyamDocSubmit}
                    disabled={loading}
                    variant="success"
                    className="px-3 py-1.5"
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>

            {/* Landmark */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Update Landmark Details
              </span>
              <Button
                onClick={() => setIsLandmarkModalOpen(true)}
                variant="primary"
                className="self-start"
              >
                Edit Landmark
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
