import React from "react";
import { Download } from "lucide-react";

export default function KycDocuments({ summary, docs, downloadBase64Doc }) {
  return (
    <div className="border border-bank-border rounded-2xl overflow-hidden shadow-sm bg-white">
      <div className="bg-gradient-to-r from-brand-blue to-[#043662] px-6 py-4 select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          KYC &amp; Legal Documents
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
            Aadhaar Photo
          </span>
          <button
            onClick={() => downloadBase64Doc(summary.aadhar_photo, `${summary.full_name}_aadhar.jpg`, "image/jpeg")}
            className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Download size={14} />
            Download
          </button>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
            Aadhaar Response PDF
          </span>
          <button
            disabled={!docs.aadhar_response_code}
            onClick={() => downloadBase64Doc(docs.aadhar_response_code, "aadhar_response.pdf")}
            className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Download
          </button>
        </div>

        {/* Card 3 */}
        <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
            Legaality Signed Doc
          </span>
          <button
            disabled={!summary.leegality_signed_doc}
            onClick={() => downloadBase64Doc(summary.leegality_signed_doc, "leegality_signed.pdf")}
            className="w-full py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
