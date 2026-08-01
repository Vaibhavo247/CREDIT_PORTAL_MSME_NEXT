"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import Table from "@/components/ui/Table";
import Spinner from "@/components/ui/Spinner";
import PageHeader from "@/components/ui/PageHeader";
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
    <div className="page-container bg-white relative h-full">
      <PageHeader title="One Pager Data" showBack={true} className="border-b border-gray-200">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </PageHeader>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="bg-white flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="msme_identifier"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
