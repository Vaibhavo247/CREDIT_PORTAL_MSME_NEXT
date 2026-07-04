"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, Trash2, Edit2, Play, Square } from "lucide-react";
import Table from "@/components/ui/Table";
import { updateEmployeeStatus } from "@/app/actions";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import Button from "@/components/ui/Button";

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
      title: "Emp ID",
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
      title: "Vertical",
      dataIndex: "BusinessVertical",
      width: 150,
    },
    {
      title: "Manager",
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
          <Button
            size="sm"
            onClick={() => toggleStatus(record)}
            disabled={isLoading}
            variant={isLoading ? "outline" : isActive ? "success" : "danger"}
          >
            {isLoading ? "Wait..." : isActive ? "ACTIVE" : "INACTIVE"}
          </Button>
        );
      },
    },
    {
      title: "Actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          size="sm"
          variant="outline"
          className="border-none text-brand-blue"
          onClick={() => {
            const queryParams = new URLSearchParams({ employee: JSON.stringify(record) }).toString();
            router.push(`/add-employee?${queryParams}`);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <PageHeader title="EMPLOYEE LIST" />
      
      <div className="flex-1 flex flex-col overflow-auto">
      
        {/* Search Toolbar */}
        <div className="py-4 flex shrink-0">
          <input
              type="text"
              placeholder="Search employees..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange w-full sm:w-80 bg-white"
          />
        </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        rowKey={(row) => row.EmployeeId}
      />

      {/* Export Action */}
      {filteredEmployees.length > 0 && (
        <div className="py-4 flex justify-end shrink-0 border-t border-gray-100 bg-white">
          <Button variant="outline" size="sm" onClick={handleExportToExcel}>
            Export to Excel
          </Button>
        </div>
      )}
      </div>
    </div>
  );
}
