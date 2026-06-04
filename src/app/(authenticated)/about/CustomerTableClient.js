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
import { checkAgentAccess, saveActiveAgent } from "@/app/actions";

export default function CustomerTableClient({ initialData = [], title = "MSME APPLICATIONS", source = "" }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(initialData);
    if (!searchText) {
      setFilteredData(initialData);
    } else {
      const filtered = initialData.filter(
        (item) =>
          item.application_id?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.full_name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [initialData, searchText]);

  // Access modal state
  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    user: "",
    msmeIdentifier: "",
  });

  const handleSearch = (value) => {
    // Alphanumeric input validation matching the original searchBar rules
    const isValid = /^[a-zA-Z0-9]*$/.test(value);
    if (!isValid) return;

    setSearchText(value);
    const filtered = data.filter(
      (item) =>
        item.application_id?.toLowerCase().includes(value.toLowerCase()) ||
        item.full_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const exportToExcel = () => {
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
      title: "Credit Recieve date",
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
      title: "Application ID",
      dataIndex: "application_id",
      fixed: "left",
      width: 160,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      width: 180,
    },
    {
      title: "Business name",
      dataIndex: "udyam_name",
      width: 200,
    },
    {
      title: "Mobile number",
      dataIndex: "mobile_no",
      width: 140,
    },
    {
      title: "Pan number",
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
      title: "Date of Udyam Registration",
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
    <div className="flex flex-col gap-6">
      <PageHeader title={title}>
        <Button variant="success" onClick={exportToExcel}>
          Export to Excel
        </Button>
        
        <Input
          type="text"
          placeholder="Search App ID or Name..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64 bg-gray-50/50"
        />
      </PageHeader>

      {/* High Fidelity Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(row) => row.msme_identifier}
        loading={loading}
      />

      {/* Full Screen Loading Overlay for Navigation */}
      {loading && !warningModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm">
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
