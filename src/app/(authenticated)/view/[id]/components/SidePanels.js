import React from "react";
import { CheckCircle, XCircle, Clock, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { ZoomableImage, SimpleCarousel } from "./SharedComponents";

export default function SidePanels({
  summary,
  businessImages,
  businessImagesList,
  houseImage,
  docs,
  isNtb,
  userRole,
  isBusinessDetailsChecked,
  downloadBase64Doc,
  setIsApproveConfirmOpen,
  setIsPendingConfirmOpen,
  setIsRejectConfirmOpen,
}) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
      {/* Customer Photo Card */}
      <div className="border border-bank-border rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-50 border-b border-bank-border px-6 py-4 text-center select-none">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Customer Photo
          </h4>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-48 h-48 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 shadow-inner">
            {docs?.customer_photo ? (
              <ZoomableImage
                src={docs.customer_photo}
                alt="Customer Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400 font-medium">
                No photo available
              </span>
            )}
          </div>

          <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 px-2 select-none">
            <span>Lat: {summary.latitude || "N/A"}</span>
            <span>Long: {summary.longitude || "N/A"}</span>
          </div>

          {docs?.customer_photo && (
            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={() => downloadBase64Doc(docs.customer_photo, `${summary.full_name}_photo.jpg`, "image/jpeg")}
            >
              <Download size={14} className="mr-2" />
              Download Photo
            </Button>
          )}
        </div>
        <div className="bg-gray-50 border-t border-bank-border px-4 py-3.5 text-center text-xs font-medium text-gray-500 leading-normal select-none">
          Location: {summary.customerLatLong?.display_name || "N/A"}
        </div>
      </div>

      {/* Business Images / House Image Card */}
      <div className="border border-bank-border rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="bg-gray-50 border-b border-bank-border px-6 py-4 text-center select-none">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            {isNtb ? "House Image" : "Business Images"}
          </h4>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          {isNtb ? (
            /* NTBVL single House image */
            <div className="w-48 h-48 border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-50 shadow-inner">
              {houseImage ? (
                <ZoomableImage
                  src={houseImage}
                  alt="House Image"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400 font-medium">
                  No image available
                </span>
              )}
            </div>
          ) : (
            /* MSME multiple Business Images Carousel */
            <div className="w-full">
              {businessImagesList.length > 0 ? (
                <SimpleCarousel images={businessImagesList} />
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-gray-400 font-medium border border-gray-100 rounded-2xl bg-gray-50 shadow-inner">
                  No business images available
                </div>
              )}
            </div>
          )}

          <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 px-2 select-none">
            <span>
              Lat:{" "}
              {summary.business_lat ? String(summary.business_lat).slice(0, 7) : "N/A"}
            </span>
            <span>
              Long:{" "}
              {summary.business_long ? String(summary.business_long).slice(0, 7) : "N/A"}
            </span>
          </div>

          {/* NTBVL single image download */}
          {isNtb && houseImage && (
            <Button
              variant="outline"
              className="w-full text-xs mt-3"
              onClick={() => downloadBase64Doc(houseImage, `${summary.full_name}_house.jpg`, "image/jpeg")}
            >
              <Download size={14} className="mr-2" />
              Download House Image
            </Button>
          )}

          {/* MSME individual image downloads */}
          {!isNtb && businessImagesList.length > 0 && (
            <div className="w-full flex flex-col gap-2 mt-2">
              {businessImagesList.map((img) => (
                <Button
                  key={img.index}
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => downloadBase64Doc(img.src, `${summary.full_name}_business_${img.index}.jpg`, "image/jpeg")}
                >
                  Download Image {img.index}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 border-t border-bank-border px-4 py-3.5 text-center text-xs font-medium text-gray-500 leading-normal select-none">
          Location: {summary.businessLatLong?.display_name || "N/A"}
        </div>
      </div>

      {/* Workflow Action Panel (CREDIT ONLY) */}
      {userRole === "CREDIT" && summary.credit_status?.toLowerCase() !== "approved" && summary.loan_status?.toLowerCase() !== "disbursed" && summary.loan_status?.toLowerCase() !== "rejected" && (
        <div className="border border-bank-border rounded-2xl overflow-hidden shadow-sm bg-white p-6 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">
            Workflow Actions
          </h4>

          <Button
            variant="primary"
            disabled={!isNtb && !isBusinessDetailsChecked}
            className="w-full bg-brand-orange hover:bg-orange-600 shadow-md shadow-brand-orange/20"
            onClick={() => setIsApproveConfirmOpen(true)}
          >
            <CheckCircle size={18} className="mr-2" />
            Approve Case
          </Button>

          <Button
            variant="primary"
            className="w-full bg-brand-blue hover:bg-blue-800 shadow-md shadow-brand-blue/20"
            onClick={() => setIsPendingConfirmOpen(true)}
          >
            <Clock size={18} className="mr-2" />
            Mark as Pending
          </Button>

          <Button
            variant="danger"
            className="w-full"
            onClick={() => setIsRejectConfirmOpen(true)}
          >
            <XCircle size={18} className="mr-2" />
            Reject Case
          </Button>

          {!isNtb && !isBusinessDetailsChecked && (
            <div className="text-[10px] text-amber-600 text-center font-medium mt-1 leading-normal">
              * Verify the mobile checkbox in Business Details to enable Approve.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
