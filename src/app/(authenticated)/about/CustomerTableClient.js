"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import { useTableSearch } from "@/hooks/useTableSearch";
import { checkAgentAccess, saveActiveAgent } from "@/app/actions";

export default function CustomerTableClient({ initialData = [], title = "MSME APPLICATIONS", source = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { filteredData, searchText, handleSearch } = useTableSearch(initialData, [
    "application_id", "full_name"
  ]);

  // Access modal state
  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    user: "",
    msmeIdentifier: "",
  });

  const handleExportToExcel = () => {
    const exportData = filteredData.map((item) => ({
      Vertical: item.BusinessVertical || "-",
      "Credit Receive Date": item.bre_executed_time || "-",
      Date: item.created_on || "-",
      "Application ID": item.application_id || "-",
      "Full Name": item.full_name || "-",
      "Business Name": item.udyam_name || "-",
      "Mobile Number": item.mobile_no || "-",
      "Pan Number": item.pan_no || "-",
      "Loan Amount": item.approved_loan_amount || "-",
      "CPV Status": item.cpv_status || "-",
      "Date of Udyam Registration": item.udyam_incorp_date || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MSME Applications");

    const now = dayjs();
    const formattedTimestamp = now.format("DD-MMM-YY HH-mm");
    const fileName = `${formattedTimestamp}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const handleAccess = async (record) => {
    let shouldKeepLoading = false;
    try {
      setLoading(true);
      // Run the access check purely on the server using Server Action
      const checkResp = await checkAgentAccess(record.msme_identifier);

      if (checkResp.success && checkResp.data?.isSameUser) {
        // Direct navigation if user matches
        shouldKeepLoading = true;
        router.push(`/view/${record.msme_identifier}${source ? `?source=${source}` : ''}`);
      } else if (checkResp.success && checkResp.data?.noActiveUser) {
        // Acquire lock first since no one is active
        const acquireResp = await saveActiveAgent(record.msme_identifier);
        if (acquireResp.success) {
          shouldKeepLoading = true;
          router.push(`/view/${record.msme_identifier}${source ? `?source=${source}` : ''}`);
        } else {
          toast.error(acquireResp.error || "Failed to acquire lock for this case.");
        }
      } else if (checkResp.success) {
        // Show confirmation popup if different user
        setWarningModal({
          isOpen: true,
          user: checkResp.data?.activeUser || checkResp.data?.user || "another user",
          msmeIdentifier: record.msme_identifier,
        });
      } else {
        toast.error(checkResp.error || "Failed to verify access permissions.");
      }
    } catch (err) {
      console.error("Access error:", err);
    } finally {
      if (!shouldKeepLoading) {
        setLoading(false);
      }
    }
  };

  const confirmAccess = async () => {
    let shouldKeepLoading = false;
    try {
      setLoading(true);
      // Run lock updates via Server Action
      const resp = await saveActiveAgent(warningModal.msmeIdentifier);

      if (resp.success) {
        setWarningModal({ isOpen: false, user: "", msmeIdentifier: "" });
        shouldKeepLoading = true;
        router.push(`/view/${warningModal.msmeIdentifier}${source ? `?source=${source}` : ''}`);
      } else {
        toast.error(resp.error || "Failed to update case lock.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!shouldKeepLoading) {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      title: "Vertical",
      dataIndex: "BusinessVertical",
      fixed: "left",
      width: 100,
    },
    {
      title: "Credit Date",
      dataIndex: "bre_executed_time",
      width: 160,
    },
    {
      title: "DATE",
      dataIndex: "created_on",
      fixed: "left",
      width: 140,
    },
    {
      title: "App ID",
      dataIndex: "application_id",
      fixed: "left",
      width: 160,
    },
    {
      title: "Name",
      dataIndex: "full_name",
      width: 180,
    },
    {
      title: "Business",
      dataIndex: "udyam_name",
      width: 200,
    },
    {
      title: "Mobile",
      dataIndex: "mobile_no",
      width: 140,
    },
    {
      title: "PAN",
      dataIndex: "pan_no",
      width: 140,
    },
    {
      title: "Loan Amount",
      dataIndex: "approved_loan_amount",
      width: 130,
    },
    {
      title: "CPV Status",
      dataIndex: "cpv_status",
      width: 120,
    },
    {
      title: "Udyam Date",
      dataIndex: "udyam_incorp_date",
      width: 180,
    },
    {
      title: "Action",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        const isPending = record?.credit_status === "Pending";
        const isApproved = record?.credit_status === "Approved";
        
        if (source === "ftcash") {
          return (
            <Button
              size="sm"
              variant={isPending ? "warning" : "success"}
              disabled={isApproved}
              onClick={() => handleAccess(record)}
            >
              {isApproved ? "Approved" : "Active"}
            </Button>
          );
        }

        return (
          <Button
            size="sm"
            variant={isPending ? "warning" : "success"}
            onClick={() => handleAccess(record)}
          >
            Active
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <PageHeader title={title} className="border-b border-gray-200" />

      <div className="flex-1 flex flex-col overflow-auto">
      
        {/* Search Toolbar */}
        <div className="py-4 flex shrink-0">
          <Input
            placeholder="Search by ID or Name"
            value={searchText}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[a-zA-Z0-9 ]*$/.test(value);
              if (isValid) handleSearch(value);
            }}
            className="pl-10 w-full"
            wrapperClassName="w-full sm:w-80"
          />
        </div>

      {/* High Fidelity Table */}
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey={(item) => item.msme_identifier || item.application_id || Math.random()}
          emptyText="No active applications found"
        />

        {/* Export Action */}
        {!loading && filteredData.length > 0 && (
          <div className="py-4 flex justify-end shrink-0 border-t border-gray-100 bg-white">
            <Button variant="outline" size="sm" onClick={handleExportToExcel}>
              Export to Excel
            </Button>
          </div>
        )}
      </div>

      {/* Full Screen Loading Overlay for Navigation */}
      {loading && !warningModal.isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center">
            <Spinner size="large" text="Loading Application Details..." />
          </div>
        </div>
      )}

      {/* Access Warning Modal */}
      <Modal
        isOpen={warningModal.isOpen}
        onClose={() => setWarningModal({ isOpen: false, user: "", msmeIdentifier: "" })}
        title="Access Warning"
        okText="Yes, Continue"
        cancelText="No"
        onOk={confirmAccess}
        okLoading={loading}
      >
        <p className="text-sm text-gray-600">
          This case is already accessed by <strong className="text-brand-blue">{warningModal.user}</strong>.
          <br />
          Do you want to continue?
        </p>
      </Modal>
    </div>
  );
}
