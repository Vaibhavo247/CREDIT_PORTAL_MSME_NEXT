"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Table from "@/components/ui/Table";
import Spinner from "@/components/ui/Spinner";
import { fetchPdfDataAction } from "@/app/actions";
import toast from "react-hot-toast";

export default function OnePagerClient({ initialData = [] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(null);

  const filteredData = useMemo(() => {
    if (!search) return data;
    const lowerSearch = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, search]);

  const handleDownloadClick = async (msmeId, appId, record) => {
    setLoadingPdf(appId);
    toast.loading("Generating PDF on server...", { id: `pdf-${appId}` });
    
    try {
      const response = await fetch("/api/generate-onepager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msmeId, appId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Read the binary response as a Blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${record?.full_name || "OnePager"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("PDF Downloaded Successfully!", { id: `pdf-${appId}` });
    } catch (error) {
      console.error("PDF generation API failed:", error);
      toast.error("Failed to generate PDF.", { id: `pdf-${appId}` });
    } finally {
      setLoadingPdf(null);
    }
  };

  const columns = [
    {
      title: "Application ID",
      dataIndex: "application_id",
      key: "application_id",
      fixed: "left",
      width: 150,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
    },
    {
      title: "Udyam No",
      dataIndex: "udhyam_no",
    },
    {
      title: "Mobile number",
      dataIndex: "mobile_no",
    },
    {
      title: "Business name",
      dataIndex: "udyam_name",
    },
    {
      title: "Pan number",
      dataIndex: "pan_no",
    },
    {
      title: "Download PDF",
      key: "download_pdf",
      fixed: "right",
      width: 200,
      render: (_, record) => {
        const appId = record?.application_id;
        const isGenerating = loadingPdf === appId;

        if (isGenerating) {
          return (
            <div className="flex items-center justify-center gap-2 text-brand-orange text-sm font-medium w-full">
              <Spinner size="small" />
              Generating...
            </div>
          );
        }

        return (
          <button
            onClick={() => handleDownloadClick(record?.msme_identifier, appId, record)}
            className="w-full px-3 py-1.5 rounded-lg bg-brand-blue text-white font-medium text-xs hover:bg-brand-blue-hover transition-colors cursor-pointer"
          >
            Download PDF
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-brand-orange transition-colors mb-2 cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <h1 className="text-xl font-bold text-brand-orange">One Pager Data</h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate and download one-pager PDFs for all cases.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex-1">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="msme_identifier"
          pageSize={10}
        />
      </div>
    </div>
  );
}
