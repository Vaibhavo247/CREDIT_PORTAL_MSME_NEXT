import React from "react";
import { Download } from "lucide-react";
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
            <button
              onClick={() => downloadBase64Doc(docs.customer_photo, `${summary.full_name}_photo.jpg`, "image/jpeg")}
              className="w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download size={14} />
              Download Photo
            </button>
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
            <button
              onClick={() => downloadBase64Doc(houseImage, `${summary.full_name}_house.jpg`, "image/jpeg")}
              className="w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download size={14} />
              Download House Image
            </button>
          )}

          {/* MSME individual image downloads */}
          {!isNtb && businessImagesList.length > 0 && (
            <div className="w-full flex flex-col gap-2 mt-2">
              {businessImagesList.map((img) => (
                <button
                  key={img.index}
                  onClick={() => downloadBase64Doc(img.src, `${summary.full_name}_business_${img.index}.jpg`, "image/jpeg")}
                  className="w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 transition text-center cursor-pointer"
                >
                  Download Image {img.index}
                </button>
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

          <button
            disabled={!isNtb && !isBusinessDetailsChecked}
            onClick={() => setIsApproveConfirmOpen(true)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/10 transition cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Approve Case
          </button>

          <button
            onClick={() => setIsPendingConfirmOpen(true)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md shadow-amber-500/10 transition cursor-pointer text-sm"
          >
            Mark as Pending
          </button>

          <button
            onClick={() => setIsRejectConfirmOpen(true)}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md shadow-red-600/10 transition cursor-pointer text-sm"
          >
            Reject Case
          </button>

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
