"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/Table";

export default function SimpleStatusTableClient({ initialData = [], title = "APPLICATIONS", columnsConfig }) {
  const router = useRouter();
  const [data] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (value) => {
    // Alphanumeric input validation
    const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
    if (!isValid) return;

    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.application_id?.toLowerCase().includes(value.toLowerCase()) ||
        item.full_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleView = (record) => {
    // Just directly go to the view page, no agent locks here
    router.push(`/view/${record.msme_identifier}`);
  };

  const columns = [
    {
      title: "Application ID",
      dataIndex: "application_id",
      fixed: "left",
      width: 140,
    },
    ...(columnsConfig.includes("case_type") ? [{
      title: "Case Type",
      dataIndex: "case_type",
      width: 120,
    }] : []),
    {
      title: "Full Name",
      dataIndex: "full_name",
      width: 180,
    },
    {
      title: "DATE",
      dataIndex: "created_on",
      width: 120,
    },
    {
      title: "LOAN STATUS",
      dataIndex: "loan_status",
      width: 140,
    },
    {
      title: "Mobile number",
      dataIndex: "mobile_no",
      width: 140,
    },
    {
      title: "Business name",
      dataIndex: "udyam_name",
      width: 180,
    },
    {
      title: "Action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleView(record)}
          className="px-4 py-1.5 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm"
        >
          VIEW
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-orange uppercase">
          {title}
        </h1>
        
        {/* Table Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <input
            type="text"
            placeholder="Search App ID or Name..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-bank-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange w-64 bg-gray-50/50"
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(row) => row.msme_identifier}
      />
    </div>
  );
}
