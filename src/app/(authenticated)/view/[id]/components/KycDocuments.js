import React from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";

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
          <Button
            onClick={() => downloadBase64Doc(summary.aadhar_photo, `${summary.full_name}_aadhar.jpg`, "image/jpeg")}
            variant="outline"
            className="w-full justify-center flex gap-2"
          >
            <Download size={14} />
            Download
          </Button>
        </div>

        {/* Card 2 */}
        <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
            Aadhaar Response PDF
          </span>
          <Button
            disabled={!docs.aadhar_response_code}
            onClick={() => downloadBase64Doc(docs.aadhar_response_code, "aadhar_response.pdf")}
            variant="outline"
            className="w-full justify-center flex gap-2"
          >
            <Download size={14} />
            Download
          </Button>
        </div>

        {/* Card 3 */}
        <div className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
            Legaality Signed Doc
          </span>
          <Button
            disabled={!summary.leegality_signed_doc}
            onClick={() => downloadBase64Doc(summary.leegality_signed_doc, "leegality_signed.pdf")}
            variant="outline"
            className="w-full justify-center flex gap-2"
          >
            <Download size={14} />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
