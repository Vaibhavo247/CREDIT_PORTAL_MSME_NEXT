"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { Search } from "lucide-react";
import { useTableSearch } from "@/hooks/useTableSearch";

export default function VoterIdRejectedClient({ initialData = [], title = "" }) {
  const { filteredData, searchText, handleSearch } = useTableSearch(
    initialData, 
    ["application_id", "full_name"]
  );

  const columns = [
    { title: "App ID", dataIndex: "application_id" },
    { title: "Aadhaar Full Name", dataIndex: "full_name" },
    { title: "VoterID Full Name", dataIndex: "voter_id_name" },
    { title: "Aadhaar NO", dataIndex: "aadhar_no" },
    { title: "Voter ID", dataIndex: "voter_id" },
    { title: "Mobile", dataIndex: "mobile_no" },
    { title: "VoterID Comment", dataIndex: "under_review_remark" },
    { title: "Vertical", dataIndex: "BusinessVertical" },
    { title: "PAN Number", dataIndex: "pan_no" },
    { 
      title: "Date", 
      dataIndex: "created_on",
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD") : "-")
    },
    { title: "Credit Review By", dataIndex: "approved_by" },
    { title: "Credit Status", dataIndex: "credit_status" },
  ];

  return (
    <div className="page-container bg-white relative h-full">
      <PageHeader title={title} showBack={false} className="border-b border-gray-200" >

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID or Name"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

</PageHeader>
      <div className="flex-1 flex flex-col overflow-auto">


        <div className="bg-white flex-1 overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey={(item) => item.msme_identifier || item.application_id || Math.random()}
            emptyText="No rejected Voter ID cases found"
          />
        </div>
      </div>
    </div>
  );
}
