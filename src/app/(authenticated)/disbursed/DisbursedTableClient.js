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
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { checkAgentAccess, saveActiveAgent } from "@/app/actions";

export default function DisbursedTableClient({ initialData = [], title = "DISBURSED APPLICATIONS" }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [selectedRange, setSelectedRange] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    user: "",
    msmeIdentifier: "",
  });

  const loanAmountRanges = [
    { label: "All", value: "all", min: 0, max: 999999999 },
    { label: "₹50,000 - ₹1,00,000", value: "50000-100000", min: 50000, max: 100000 },
    { label: "₹1,00,000 - ₹2,00,000", value: "100000-200000", min: 100000, max: 200000 },
    { label: "₹2,00,000 - ₹5,00,000", value: "200000-500000", min: 200000, max: 500000 },
  ];

  useEffect(() => {
    setData(initialData);
    let filtered = initialData;

    // Text Search
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.application_id?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.full_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Loan Amount Range
    const range = loanAmountRanges.find(r => r.value === selectedRange) || loanAmountRanges[0];
    if (range.value !== "all") {
      filtered = filtered.filter(item => {
        const loanAmount = item.final_loan_amount || 0;
        return loanAmount >= range.min && loanAmount <= range.max;
      });
    }

    // Date Range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        if (!item.created_on) return false;
        const itemDate = dayjs(item.created_on);
        return itemDate.isAfter(dayjs(dateRange.start).subtract(1, 'day')) && 
               itemDate.isBefore(dayjs(dateRange.end).add(1, 'day'));
      });
    }

    setFilteredData(filtered);
  }, [searchText, selectedRange, dateRange, initialData]);

  const handleSearch = (val) => {
    setSearchText(val);
  };

  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = filteredData.map((item) => ({
      "Application ID": item.application_id || "-",
      "Case Type": item.case_type || "-",
      "Full Name": item.full_name || "-",
      Date: item.created_on ? dayjs(item.created_on).format('YYYY-MM-DD') : "-",
      "Loan Status": item.loan_status || "-",
      "Mobile Number": item.mobile_no || "-",
      "Business Name": item.udyam_name || "-",
      "Loan Amount": item.final_loan_amount || "-",
      "RAG Status": item.rag_status || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Disbursed Applications");

    const now = dayjs();
    const formattedTimestamp = now.format("DD-MMM-YY HH-mm");
    const fileName = `Disbursed_${formattedTimestamp}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const handleAccess = async (record) => {
    let shouldKeepLoading = false;
    const targetId = record.msme_identifier || record.msmeIdentifier;

    if (!targetId) {
      toast.error("Error: Missing MSME Identifier for this record.");
      return;
    }

    try {
      setLoading(true);
      const checkResp = await checkAgentAccess(targetId);

      if (checkResp.success && checkResp.data?.isSameUser) {
        shouldKeepLoading = true;
        router.push(`/view/${targetId}`);
      } else if (checkResp.success && checkResp.data?.noActiveUser) {
        const acquireResp = await saveActiveAgent(targetId);
        if (acquireResp.success) {
          shouldKeepLoading = true;
          router.push(`/view/${targetId}`);
        } else {
          toast.error(acquireResp.error || "Failed to acquire lock for this case.");
        }
      } else if (checkResp.success) {
        setWarningModal({
          isOpen: true,
          user: checkResp.data?.activeUser || checkResp.data?.user || "another user",
          msmeIdentifier: targetId,
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
      const resp = await saveActiveAgent(warningModal.msmeIdentifier);

      if (resp.success) {
        setWarningModal({ isOpen: false, user: "", msmeIdentifier: "" });
        shouldKeepLoading = true;
        router.push(`/view/${warningModal.msmeIdentifier}`);
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
      title: "Application ID",
      dataIndex: "application_id",
      fixed: "left",
      width: 140,
    },
    {
      title: "Case Type",
      dataIndex: "case_type",
      width: 100,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      width: 140,
    },
    {
      title: "DATE",
      dataIndex: "created_on",
      fixed: "left",
      width: 120,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : "-",
    },
    {
      title: "LOAN STATUS",
      dataIndex: "loan_status",
      width: 110,
    },
    {
      title: "Mobile number",
      dataIndex: "mobile_no",
      width: 130,
    },
    {
      title: "Business name",
      dataIndex: "udyam_name",
      width: 150,
    },
    {
      title: "LOAN AMOUNT",
      dataIndex: "final_loan_amount",
      width: 120,
      render: (amount) => amount ? `₹${amount}` : '-',
    },
    {
      title: "RAG STATUS",
      dataIndex: "rag_status",
      width: 110,
      render: (status) => {
        if (!status || status === 'Null') return "";
        return <Badge>{status}</Badge>;
      }
    },
    {
      title: "VIEW",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        return (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleAccess(record)}
          >
            VIEW
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

      {/* Custom Disbursed Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Loan Amount Range</label>
          <select 
            value={selectedRange} 
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full px-4 py-2 border border-bank-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
          >
            {loanAmountRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
             <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))} className="w-full px-4 py-2 border border-bank-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
          </div>
          <div className="flex-1">
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
             <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))} className="w-full px-4 py-2 border border-bank-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
          </div>
        </div>
      </div>

      {/* High Fidelity Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(row) => row.msme_identifier || row.msmeIdentifier || row.application_id}
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
