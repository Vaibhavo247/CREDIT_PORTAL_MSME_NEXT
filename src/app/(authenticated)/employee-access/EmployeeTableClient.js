"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Trash2, Edit2, Play, Square } from "lucide-react";
import Table from "@/components/ui/Table";
import { updateEmployeeStatus } from "@/app/actions";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export default function EmployeeTableClient({ initialEmployees = [] }) {
  const router = useRouter();
  const [employees, setEmployees] = useState(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);
  const [searchText, setSearchText] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState({});

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = employees.filter((emp) =>
      Object.values(emp).some(
        (val) => val && val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredEmployees(filtered);
  };

  const handleExportToExcel = () => {
    if (filteredEmployees.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const formattedData = filteredEmployees.map((item) => ({
      "Employee ID": item.EmployeeId,
      "First Name": item.FirstName,
      "Last Name": item.LastName,
      Branch: item.Branch,
      "Mobile Number": item.MobileNo,
      Role: item.Role,
      "Business Vertical": item.BusinessVertical,
      Status: item.active_inactive ? "ACTIVE" : "INACTIVE",
      "Reporting Manager Name": item.reporting_manager_name,
      "Reporting Manager ID": item.reporting_manager_id,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const timestamp = dayjs().format("DD_MMM_YYYY_HHmm");
    XLSX.writeFile(wb, `EmployeeList_${timestamp}.xlsx`);
  };

  const toggleStatus = async (record) => {
    const newStatus = !record.active_inactive;
    const confirmMsg = `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this employee?`;
    if (!window.confirm(confirmMsg)) return;

    setUpdatingStatus((prev) => ({ ...prev, [record.EmployeeId]: true }));
    try {
      const resp = await updateEmployeeStatus(record.EmployeeId, newStatus);
      if (resp.success) {
        toast.success(`Employee ${newStatus ? 'activated' : 'deactivated'} successfully`);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.EmployeeId === record.EmployeeId
              ? { ...emp, active_inactive: newStatus }
              : emp
          )
        );
        setFilteredEmployees((prev) =>
          prev.map((emp) =>
            emp.EmployeeId === record.EmployeeId
              ? { ...emp, active_inactive: newStatus }
              : emp
          )
        );
      } else {
        toast.error(resp.error || "Failed to update employee status");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while updating status");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [record.EmployeeId]: false }));
    }
  };

  const columns = [
    {
      title: "Employee ID",
      dataIndex: "EmployeeId",
      fixed: "left",
      width: 120,
    },
    {
      title: "Name",
      width: 180,
      render: (_, record) => `${record.FirstName || ''} ${record.LastName || ''}`,
    },
    {
      title: "Branch",
      dataIndex: "Branch",
      width: 100,
    },
    {
      title: "Mobile",
      dataIndex: "MobileNo",
      width: 120,
    },
    {
      title: "Role",
      dataIndex: "Role",
      width: 120,
    },
    {
      title: "Business Vertical",
      dataIndex: "BusinessVertical",
      width: 150,
    },
    {
      title: "Reporting Manager",
      width: 200,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold">{record.reporting_manager_name}</span>
          <span className="text-xs text-gray-500">{record.reporting_manager_id}</span>
        </div>
      ),
    },
    {
      title: "Status",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        const isActive = record.active_inactive;
        const isLoading = updatingStatus[record.EmployeeId];

        return (
          <button
            onClick={() => toggleStatus(record)}
            disabled={isLoading}
            className={`px-3 py-1 text-xs font-semibold rounded-xl text-white transition-colors shadow-sm ${
              isLoading
                ? "bg-gray-400"
                : isActive
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isLoading ? "Wait..." : isActive ? "ACTIVE" : "INACTIVE"}
          </button>
        );
      },
    },
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => {
            const queryParams = new URLSearchParams({ employee: JSON.stringify(record) }).toString();
            router.push(`/add-employee?${queryParams}`);
          }}
          className="text-brand-blue hover:text-brand-orange text-sm font-semibold transition"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-orange uppercase">
          EMPLOYEE LIST
        </h1>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleExportToExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Export to Excel
          </button>
          
          <input
            type="text"
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-4 py-2 border border-bank-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange w-64 bg-gray-50/50"
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(row) => row.EmployeeId}
      />
    </div>
  );
}
