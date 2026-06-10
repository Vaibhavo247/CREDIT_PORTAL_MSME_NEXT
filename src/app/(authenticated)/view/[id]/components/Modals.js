import React from "react";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { AlertCircle, AlertTriangle } from "lucide-react";

export default function Modals({
  // Modals state flags
  isJourneyOpen,
  setIsJourneyOpen,
  isBusinessModalOpen,
  setIsBusinessModalOpen,
  isLandmarkModalOpen,
  setIsLandmarkModalOpen,
  isApproveConfirmOpen,
  setIsApproveConfirmOpen,
  isPendingConfirmOpen,
  setIsPendingConfirmOpen,
  isRejectConfirmOpen,
  setIsRejectConfirmOpen,
  
  // Handlers
  handleBusinessDetailsSubmit,
  handleLandmarkSubmit,
  handleApproveAction,
  handlePendingAction,
  handleRejectAction,
  
  // Conditionals
  isNtb,
  isLoanJourneyLoading,
  loanJourney,
  sectorSubsector,
  
  // State values and setters
  formSector,
  setFormSector,
  formSubsector,
  setFormSubsector,
  formEntityType,
  setFormEntityType,
  formBusinessName,
  setFormBusinessName,
  formBusinessIncorp,
  setFormBusinessIncorp,
  formUdyamIncorp,
  setFormUdyamIncorp,
  landmarkText,
  setLandmarkText,
  rejectReason,
  setRejectReason,
  pendingComment,
  setPendingComment,
  pendingReasonsList,
  setSelectedPendingReasons
}) {
  return (
    <>
      {/* Loan Journey Timeline Modal */}
      <Modal
        isOpen={isJourneyOpen}
        onClose={() => setIsJourneyOpen(false)}
        title="Applicant Loan Journey"
        width="max-w-xl"
      >
        {isLoanJourneyLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner text="Loading journey history..." />
          </div>
        ) : loanJourney.length === 0 ? (
          <p className="text-center py-6 text-gray-400 font-medium">
            No history timeline records found.
          </p>
        ) : (
          <div className="relative border-l-2 border-brand-orange/20 ml-4 py-2 space-y-6">
            {loanJourney.map((step, idx) => (
              <div key={idx} className="relative pl-6">
                {/* Dot marker */}
                <span className={`absolute -left-1.75 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                  step.status === "Approved" ? "bg-emerald-500" :
                  step.status === "Pending" ? "bg-amber-500" :
                  step.status === "Reverted" ? "bg-red-500" : "bg-brand-blue"
                }`} />
                <div className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm font-bold text-gray-800">{step.stage}</span>
                    <span className="text-[10px] font-medium text-gray-400">{step.date}</span>
                  </div>
                  <div className="text-gray-500 font-medium mt-0.5">
                    Updated By Agent: <strong className="text-brand-blue font-semibold">{step.user}</strong>
                  </div>
                  {step.comment && (
                    <div className="mt-1.5 p-2.5 bg-gray-50 border border-gray-150 rounded-xl text-gray-600 italic">
                      &ldquo;{step.comment}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Business Details Edit Modal */}
      <Modal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        title={isNtb ? "UPDATE NTBVL DETAILS" : "UPDATE BUSINESS DETAILS"}
        okText="Submit Details"
        onOk={handleBusinessDetailsSubmit}
        width="max-w-lg"
      >
        <div className="flex flex-col gap-4 text-xs font-semibold text-gray-500">
          {/* Sector Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Sector</label>
            <select
              value={formSector}
              onChange={(e) => setFormSector(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            >
              <option value="">Select Sector</option>
              {sectorSubsector
                .filter((item) => item.SET === "SECTOR")
                .map((item) => (
                  <option key={item.Value} value={item.Value}>
                    {item.Value}
                  </option>
                ))}
            </select>
          </div>

          {/* Subsector Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Subsector</label>
            <select
              value={formSubsector}
              onChange={(e) => setFormSubsector(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            >
              <option value="">Select Subsector</option>
              {sectorSubsector
                .filter((item) => item.SET === "SUBSECTOR")
                .map((item) => (
                  <option key={item.Value} value={item.Value}>
                    {item.Value}
                  </option>
                ))}
            </select>
          </div>

          {/* Entity Type Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Entity Type</label>
            <select
              value={formEntityType}
              onChange={(e) => setFormEntityType(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            >
              <option value="">Select Entity Type</option>
              {[
                "Proprietorship",
                "Partnership",
                "Hindu Undivided Family",
                "Limited Liability Partnership",
                "Private Limited Company",
                "Public Limited Company",
                "Self Help Group",
              ].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Business Name Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Business Name</label>
            <input
              type="text"
              value={formBusinessName}
              onChange={(e) => {
                // Alphanumeric, spaces, commas, hyphens, underscores matching original code validation
                const val = e.target.value;
                if (/^[a-zA-Z0-9\s,_-]*$/.test(val)) {
                  setFormBusinessName(val);
                }
              }}
              placeholder="Enter Business Name"
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            />
          </div>

          {/* Date Picker Incorporation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Business Incorporation Date</label>
            <input
              type="date"
              value={formBusinessIncorp}
              onChange={(e) => setFormBusinessIncorp(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            />
          </div>

          {/* Date Picker Udyam Incorporation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-gray-400">Udyam Incorporation Date</label>
            <input
              type="date"
              value={formUdyamIncorp}
              onChange={(e) => setFormUdyamIncorp(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700"
            />
          </div>
        </div>
      </Modal>

      {/* Landmark Update Modal */}
      <Modal
        isOpen={isLandmarkModalOpen}
        onClose={() => setIsLandmarkModalOpen(false)}
        title="Update Landmark details"
        okText="Submit"
        onOk={handleLandmarkSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Landmark</label>
          <input
            type="text"
            placeholder="Enter Landmark details"
            value={landmarkText}
            onChange={(e) => {
              // Letters, numbers, spaces, commas, periods, hyphens, colons matching original code
              const val = e.target.value;
              if (/^[a-zA-Z0-9\s,.\-:_]*$/.test(val)) {
                setLandmarkText(val);
              }
            }}
            className="w-full px-3 py-2 border border-bank-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700 font-medium"
          />
        </div>
      </Modal>

      {/* Approve Confirm Modal */}
      <Modal
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        title="Approval Confirmation"
        okText="Confirm Approve"
        onOk={handleApproveAction}
      >
        <p className="text-sm text-gray-600 font-medium leading-relaxed flex items-center gap-3">
          <AlertCircle size={32} className="text-emerald-600 shrink-0" />
          Are you sure you want to approve this MSME Credit applicant? This process is audited and irreversible.
        </p>
      </Modal>

      {/* Pending Reasons Modal */}
      <Modal
        isOpen={isPendingConfirmOpen}
        onClose={() => setIsPendingConfirmOpen(false)}
        title="Select Pending Reasons"
        okText="Submit Pending"
        onOk={handlePendingAction}
        width="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            {pendingReasonsList.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 select-none">
                <input
                  type="checkbox"
                  id={`pend-${idx}`}
                  value={reason}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPendingReasons((prev) => [...prev, e.target.value]);
                    } else {
                      setSelectedPendingReasons((prev) => prev.filter((r) => r !== e.target.value));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange accent-brand-orange mt-0.5 cursor-pointer"
                />
                <label htmlFor={`pend-${idx}`} className="text-xs font-semibold text-gray-600 leading-normal cursor-pointer">
                  {reason}
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="pend-comm" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Additional comments:
            </label>
            <textarea
              id="pend-comm"
              rows={4}
              placeholder="Enter additional explanations here..."
              value={pendingComment}
              onChange={(e) => setPendingComment(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700 leading-normal"
            />
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectConfirmOpen}
        onClose={() => setIsRejectConfirmOpen(false)}
        title="Reject Application"
        okText="Confirm Reject"
        onOk={handleRejectAction}
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs font-medium text-red-600 flex items-center gap-2 select-none">
            <AlertTriangle size={18} className="shrink-0" />
            Warning: You are rejecting this loan application. An official audit reason must be supplied.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="rej-reason" className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Audit Rejection Reason:
            </label>
            <textarea
              id="rej-reason"
              rows={4}
              required
              placeholder="Enter detailed reason for rejection (required)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-bank-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white text-gray-700 leading-normal"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
