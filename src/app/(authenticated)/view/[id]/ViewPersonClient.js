"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, FileText, Download, Upload, Eye, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import {
  approveCase,
  pendingCase,
  rejectCase,
  fetchLoanJourney,
  fetchHouseImage,
  updateSectorSubsectorCase,
  landmarkByAgent,
  updateUdyamDocs,
  fetchBreReportData,
} from "@/app/actions";

// Import modular sub-components
import CustomerDetails from "./components/CustomerDetails";
import BusinessDetails from "./components/BusinessDetails";
import NtbvlDetails from "./components/NtbvlDetails";
import LoanDetails from "./components/LoanDetails";
import KycDocuments from "./components/KycDocuments";
import SidePanels from "./components/SidePanels";
import Modals from "./components/Modals";

// Sub-components have been extracted to the components folder

export default function ViewPersonClient({
  id,
  source,
  userId,
  userRole,
  initialSummary = {},
  initialDocs = {},
  initialStaticDetails = [],
  sectorSubsector = [],
  initialBusinessImages = {},
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initialSummary);
  
  // Debug log for summary data
  useEffect(() => {
    console.log("=== API SUMMARY DATA ===", summary);
  }, [summary]);

  const [docs] = useState(initialDocs);
  const [staticDetails, setStaticDetails] = useState(initialStaticDetails);
  const [businessImages, setBusinessImages] = useState(initialBusinessImages);

  // Client-side report metrics state
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [googleData, setGoogleData] = useState({});
  const [branchData, setBranchData] = useState({});
  const [bureauData, setBureauData] = useState({});
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    console.log("=== BUSINESS IMAGES === ", businessImages);
    if (businessImages?.customer_photo && businessImages?.business_image) {
      console.log("Are they exactly the same string?", businessImages.customer_photo === businessImages.business_image);
    }
  }, [businessImages]);

  const [loading, setLoading] = useState(false);
  const [isBusinessDetailsChecked, setIsBusinessDetailsChecked] = useState(false);

  // Sub-sections states
  const [houseImage, setHouseImage] = useState(null);
  const [eligibilityCriteria, setEligibilityCriteria] = useState("N/A");
  const [loanJourney, setLoanJourney] = useState([]);
  const [isLoanJourneyLoading, setIsLoanJourneyLoading] = useState(false);

  // Modals state
  const [isJourneyOpen, setIsJourneyOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isLandmarkModalOpen, setIsLandmarkModalOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isPendingConfirmOpen, setIsPendingConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  // Update business detail form state
  const [formSector, setFormSector] = useState(summary.sector || "");
  const [formSubsector, setFormSubsector] = useState(summary.subsector || "");
  const [formEntityType, setFormEntityType] = useState(summary.udyam_entity_type || "");
  const [formBusinessName, setFormBusinessName] = useState(summary.business_name_byuser || "");
  const [formBusinessIncorp, setFormBusinessIncorp] = useState(summary.business_incorp_date ? summary.business_incorp_date.split("-").reverse().join("-") : "");
  const [formUdyamIncorp, setFormUdyamIncorp] = useState(summary.udyam_incorp_date ? summary.udyam_incorp_date.split("-").reverse().join("-") : "");

  // Landmark form state
  const [landmarkText, setLandmarkText] = useState(summary.landmark_by_agent || "");

  // Udyam Document upload state
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Rejection/Pending reason states
  const [rejectReason, setRejectReason] = useState("");
  const [pendingComment, setPendingComment] = useState("");
  const [selectedPendingReasons, setSelectedPendingReasons] = useState([]);

  const pendingReasonsList = [
    "Re-upload Business Image",
    "Re-upload Business Multiple Images",
    "Update Udyam document and Business details",
    "Update Current Address",
  ];

  // Fetch loan journey
  const loadLoanJourney = async () => {
    setIsLoanJourneyLoading(true);
    try {
      const resp = await fetchLoanJourney(summary.application_id);
      if (resp.success && resp.data?.recordset) {
        const apiRecords = resp.data.recordset;
        const importantStatuses = new Set([
          "CustomerImages",
          "AddressDetails",
          "Pre BRE",
          "Udyam",
          "AccountAgreegator",
          "BRE",
          "LoanOffer",
          "PersonalDetails",
          "VkycStart",
          "Insurance",
          "Agreement",
          "CreditPending",
          "CreditRevertTime",
          "Disbursed",
          "Approved",
          "SalesRevertTime",
        ]);

        const sortedRecords = apiRecords
          .filter((record) => importantStatuses.has(record.loan_status))
          .sort((a, b) => new Date(a.instance_date_time) - new Date(b.instance_date_time));

        const journey = sortedRecords.map((record) => {
          let stageName = record.loan_status;
          let status = "Completed";
          let comment = record.credit_comment || record.agent_comment || "No comment provided";

          switch (record.loan_status) {
            case "AddressDetails":
              stageName = "Address Details";
              break;
            case "Pre BRE":
              stageName = "Pre-BRE";
              break;
            case "AccountAgreegator":
              stageName = "Account Aggregator";
              break;
            case "LoanOffer":
              stageName = "Loan Offer";
              break;
            case "PersonalDetails":
              stageName = "Personal Details";
              break;
            case "VkycStart":
              stageName = "VKYC Started";
              break;
            case "CreditPending":
              stageName = "Pending with Credit";
              status = "Pending";
              break;
            case "CreditRevertTime":
              stageName = "Reverted to Sales";
              status = "Reverted";
              break;
            case "Disbursed":
              stageName = "Loan Disbursed";
              break;
            case "Approved":
              stageName = "Final Approval";
              status = "Approved";
              break;
            case "SalesRevertTime":
              stageName = "Reverted to Sales";
              status = "Reverted";
              break;
          }

          return {
            stage: stageName,
            date: new Date(record.instance_date_time).toUTCString(),
            status,
            user: record.agent_id || "N/A",
            comment,
          };
        });
        setLoanJourney(journey);
      }
    } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
      console.error(error);
    } finally {
      setIsLoanJourneyLoading(false);
    }
  };

  // Fetch house image (for NTBVL) and CRIF eligibility on mount
  useEffect(() => {
    if (summary.case_type === "NTBVL") {
      fetchHouseImage(summary.msme_identifier).then((resp) => {
        if (resp.success && resp.data?.[0]?.ao_business_image) {
          setHouseImage(`data:image/jpeg;base64,${resp.data[0].ao_business_image}`);
        }
      });
    }

    if (summary.application_id) {
      setIsReportLoading(true);
      
      // TEMPORARY: Hardcode an application ID here that you know has data
      // For example: const testAppId = "APP123456789";
      const testAppId = "MSME1212002100"; 
      const appIdToFetch = testAppId || summary.application_id;
      
      fetchBreReportData(appIdToFetch).then((resp) => {
        console.log(`=== MSME REPORT API RESPONSE FOR ${appIdToFetch} ===`, resp);
        const reportData = resp.data;
        if (resp.success && reportData) {
          
          const safeExtract = (obj) => {
            if (!obj) return {};
            if (Array.isArray(obj)) return obj[0] || {};
            return obj;
          };

          const extractedBureau = safeExtract(reportData.BUREAU_DATA);
          setBureauData(extractedBureau);
          if (extractedBureau.ELIGIBILITY_CRITERIA) {
            setEligibilityCriteria(extractedBureau.ELIGIBILITY_CRITERIA);
          }
          
          setGoogleData(safeExtract(reportData.GOOGLE_DATA));
          setBranchData(safeExtract(reportData.BRANCH_DATA));
          setCustomerData(safeExtract(reportData.CUSTOMER_DATA));
        }
      }).catch(err => {
        console.error("Failed to fetch msme report", err);
      }).finally(() => {
        setIsReportLoading(false);
      });
    } else {
      setIsReportLoading(false);
    }
  }, [summary]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Business detail modal submit
  const handleBusinessDetailsSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        id,
        sector: formSector,
        subsector: formSubsector,
        udyamEntityType: formEntityType,
        businessName: formBusinessName,
        business_incorp_date: formBusinessIncorp,
        udyam_incorp_date: formUdyamIncorp,
      };

      const resp = await updateSectorSubsectorCase(payload);
      if (resp.success) {
        setIsBusinessModalOpen(false);
        router.refresh();
      } else {
        toast.error(resp.error || "Failed to update business details.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Landmark modal submit
  const handleLandmarkSubmit = async () => {
    setLoading(true);
    try {
      const resp = await landmarkByAgent({ id, landmark_by_agent: landmarkText });
      if (resp.success) {
        setIsLandmarkModalOpen(false);
        router.refresh();
      } else {
        toast.error(resp.error || "Failed to update landmark.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Udyam Document upload submit
  const handleUdyamDocSubmit = async () => {
    if (!selectedPdf) return;
    setLoading(true);
    try {
      const base64 = await convertToBase64(selectedPdf);
      const resp = await updateUdyamDocs({ id, udyam_doc: base64 });
      if (resp.success) {
        toast.success("Udyam document uploaded successfully!");
        router.refresh();
      } else {
        toast.error(resp.error || "Failed to upload document.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Case decision actions
  const handleApproveAction = async () => {
    setLoading(true);
    try {
      const resp = await approveCase(id, userId, source);
      if (resp.success) {
        router.push(source === "ftcash" ? "/dashboard" : "/about");
      } else {
        toast.error(resp.error || "Failed to approve the case.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePendingAction = async () => {
    if (selectedPendingReasons.length === 0) {
      toast.error("Please select at least one pending reason");
      return;
    }
    setLoading(true);
    try {
      const reasonsString = selectedPendingReasons.join(", ");
      const resp = await pendingCase(id, reasonsString, pendingComment.trim(), userId);
      if (resp.success) {
        router.push("/about");
      } else {
        toast.error(resp.error || "Failed to submit pending request.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAction = async () => {
    if (!rejectReason.trim()) {
      toast.error("Reason is required!");
      return;
    }
    setLoading(true);
    try {
      const resp = await rejectCase(id, rejectReason.trim(), userId);
      if (resp.success) {
        router.push("/about");
      } else {
        toast.error(resp.error || "Failed to reject case.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Base64 document download helper
  const downloadBase64Doc = (base64String, filename, type = "application/pdf") => {
    if (!base64String) return;
    try {
      // If it already has data uri prefix
      const hasPrefix = base64String.startsWith("data:");
      const link = document.createElement("a");
      link.href = hasPrefix ? base64String : `data:${type};base64,${base64String}`;
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const businessImagesList = [
    businessImages?.business_image && { src: businessImages.business_image, index: 1 },
    (businessImages?.business_image_1 || summary?.business_image_1) && { src: businessImages?.business_image_1 || summary?.business_image_1, index: 2 },
    (businessImages?.business_image_2 || summary?.business_image_2) && { src: businessImages?.business_image_2 || summary?.business_image_2, index: 3 },
    (businessImages?.business_image_3 || summary?.business_image_3) && { src: businessImages?.business_image_3 || summary?.business_image_3, index: 4 },
    (businessImages?.business_image_4 || summary?.business_image_4) && { src: businessImages?.business_image_4 || summary?.business_image_4, index: 5 },
  ].filter(Boolean);

  const isNtb = summary.case_type === "NTBVL";
  // Extract mapping from dedicated states
  const distanceVal = branchData.DISTANCE_TO_NEAREST_BRANCH_KM;
  const branchNameVal = branchData.NEAREST_BRANCH_NAME;
  const googleBizName = googleData.GOOGLE_BUSINESS_NAME;
  const googleAddress = googleData.GOOGLE_BUSINESS_ADDRESS;
  const googlePhone = googleData.GOOGLE_PHONE_NUMBER;
  const googleStatus = googleData.BUSINESS_STATUS;
  const googleRating = googleData.GOOGLE_OVERALL_REVIEW_RATING;
  
  // App counts mapped from CUSTOMER_DATA
  const appCountSameMobile = customerData.DISTINCT_APP_COUNT_BY_MOBILE_NO;
  const distinctApps100m = customerData.NEARBY_APP_COUNT;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-orange transition-colors cursor-pointer select-none"
        >
          <ChevronLeft size={16} />
          Back to list
        </button>

        <h1 className="text-base md:text-lg font-bold text-brand-blue select-none">
          Application: <span className="text-brand-orange">{summary.application_id}</span>
        </h1>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Detail sections */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <CustomerDetails
            summary={summary}
            loadLoanJourney={loadLoanJourney}
            setIsJourneyOpen={setIsJourneyOpen}
          />

          {!isNtb ? (
            <BusinessDetails
              id={id}
              summary={summary}
              isReportLoading={isReportLoading}
              distanceVal={distanceVal}
              branchNameVal={branchNameVal}
              googleBizName={googleBizName}
              googleAddress={googleAddress}
              googlePhone={googlePhone}
              googleStatus={googleStatus}
              googleRating={googleRating}
              appCountSameMobile={appCountSameMobile}
              distinctApps100m={distinctApps100m}
              isBusinessDetailsChecked={isBusinessDetailsChecked}
              setIsBusinessDetailsChecked={setIsBusinessDetailsChecked}
              setIsBusinessModalOpen={setIsBusinessModalOpen}
            />
          ) : (
            <NtbvlDetails
              summary={summary}
              setIsBusinessModalOpen={setIsBusinessModalOpen}
            />
          )}

          <LoanDetails
            summary={summary}
            eligibilityCriteria={eligibilityCriteria}
            selectedPdf={selectedPdf}
            setSelectedPdf={setSelectedPdf}
            loading={loading}
            handleUdyamDocSubmit={handleUdyamDocSubmit}
            setIsLandmarkModalOpen={setIsLandmarkModalOpen}
          />

          <KycDocuments
            summary={summary}
            docs={docs}
            downloadBase64Doc={downloadBase64Doc}
          />
        </div>

        <SidePanels
          summary={summary}
          docs={docs}
          businessImages={businessImages}
          businessImagesList={businessImagesList}
          houseImage={houseImage}
          isNtb={isNtb}
          userRole={userRole}
          isBusinessDetailsChecked={isBusinessDetailsChecked}
          downloadBase64Doc={downloadBase64Doc}
          setIsApproveConfirmOpen={setIsApproveConfirmOpen}
          setIsPendingConfirmOpen={setIsPendingConfirmOpen}
          setIsRejectConfirmOpen={setIsRejectConfirmOpen}
        />
      </div>

      
      {/* Workflow Action Horizontal Footer (CREDIT ONLY) */}
      {userRole === "CREDIT" && summary.credit_status?.toLowerCase() !== "approved" && summary.loan_status?.toLowerCase() !== "disbursed" && summary.loan_status?.toLowerCase() !== "rejected" && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:left-64 flex flex-col sm:flex-row items-center justify-end gap-4 transition-all duration-300">
          <div className="mr-auto hidden sm:block"></div>

          <Button
            variant="primary"
            disabled={!isNtb && !isBusinessDetailsChecked}
            className="px-8 py-2 bg-green-600 hover:bg-green-700 border-green-600 text-white w-full sm:w-auto font-semibold"
            onClick={() => setIsApproveConfirmOpen(true)}
          >
            <CheckCircle size={18} className="mr-2" />
            Approve Case
          </Button>

          <Button
            variant="outline"
            className="px-6 py-2 text-brand-blue border-brand-blue hover:bg-blue-50 w-full sm:w-auto"
            onClick={() => setIsPendingConfirmOpen(true)}
          >
            <Clock size={18} className="mr-2" />
            Mark as Pending
          </Button>

          <Button
            variant="outline"
            className="px-6 py-2 text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto"
            onClick={() => setIsRejectConfirmOpen(true)}
          >
            <XCircle size={18} className="mr-2" />
            Reject Case
          </Button>
        </div>
      )}

      <Modals
        isJourneyOpen={isJourneyOpen}
        setIsJourneyOpen={setIsJourneyOpen}
        isBusinessModalOpen={isBusinessModalOpen}
        setIsBusinessModalOpen={setIsBusinessModalOpen}
        isLandmarkModalOpen={isLandmarkModalOpen}
        setIsLandmarkModalOpen={setIsLandmarkModalOpen}
        isApproveConfirmOpen={isApproveConfirmOpen}
        setIsApproveConfirmOpen={setIsApproveConfirmOpen}
        isPendingConfirmOpen={isPendingConfirmOpen}
        setIsPendingConfirmOpen={setIsPendingConfirmOpen}
        isRejectConfirmOpen={isRejectConfirmOpen}
        setIsRejectConfirmOpen={setIsRejectConfirmOpen}
        handleBusinessDetailsSubmit={handleBusinessDetailsSubmit}
        handleLandmarkSubmit={handleLandmarkSubmit}
        handleApproveAction={handleApproveAction}
        handlePendingAction={handlePendingAction}
        handleRejectAction={handleRejectAction}
        isNtb={isNtb}
        isLoanJourneyLoading={isLoanJourneyLoading}
        loanJourney={loanJourney}
        sectorSubsector={sectorSubsector}
        formSector={formSector}
        setFormSector={setFormSector}
        formSubsector={formSubsector}
        setFormSubsector={setFormSubsector}
        formEntityType={formEntityType}
        setFormEntityType={setFormEntityType}
        formBusinessName={formBusinessName}
        setFormBusinessName={setFormBusinessName}
        formBusinessIncorp={formBusinessIncorp}
        setFormBusinessIncorp={setFormBusinessIncorp}
        formUdyamIncorp={formUdyamIncorp}
        setFormUdyamIncorp={setFormUdyamIncorp}
        landmarkText={landmarkText}
        setLandmarkText={setLandmarkText}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        pendingComment={pendingComment}
        setPendingComment={setPendingComment}
        pendingReasonsList={pendingReasonsList}
        setSelectedPendingReasons={setSelectedPendingReasons}
      />
    </div>
  );
}
