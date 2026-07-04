"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { Search } from "lucide-react";
import { verifyVoterId } from "@/app/actions";
import { useTableSearch } from "@/hooks/useTableSearch";

export default function VoterIdPendingClient({ initialData = [], title = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { filteredData, searchText, handleSearch } = useTableSearch(
    initialData, 
    ["application_id", "full_name"]
  );

  const handleApprove = async (record) => {
    try {
      setLoading(true);
      const resp = await verifyVoterId(record?.msme_identifier, "System", "APPROVED");
      if (resp?.success) {
        toast.success("Case has been APPROVED successfully!");
        router.refresh();
      } else {
        toast.error("Approval returned unexpected response.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve the case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (record) => {
    try {
      setLoading(true);
      const resp = await verifyVoterId(record?.msme_identifier, "System", "REJECTED");
      if (resp?.success) {
        toast.success("Case has been REJECTED successfully!");
        router.refresh();
      } else {
        toast.error("Rejection returned unexpected response.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject the case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={loading}
            onClick={() => handleApprove(record)}
            className="bg-green-600 hover:bg-green-700"
          >
            APPROVE
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={loading}
            onClick={() => handleReject(record)}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            REJECT
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <PageHeader title={title} showBack={false} className="border-b border-gray-200" />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="py-4 flex flex-col sm:flex-row justify-end items-center shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by ID or Name"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="bg-white flex-1 overflow-hidden">
          <Table 
            columns={columns} 
            dataSource={filteredData} 
            rowKey={(item) => item.msme_identifier || item.application_id || Math.random()}
            emptyText="No pending Voter ID cases found"
          />
        </div>
      </div>
    </div>
  );
}
