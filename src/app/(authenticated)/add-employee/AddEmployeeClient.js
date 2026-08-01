"use client";

import React, { useState, useEffect, Suspense } from "react";
import Button from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { insertEmployee, fetchEmployeeDetail } from "@/app/actions";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import PageHeader from "@/components/ui/PageHeader";

function AddEmployeeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editDataStr = searchParams.get("employee");
  const employeeToEdit = editDataStr ? JSON.parse(editDataStr) : null;
  const isEditing = !!employeeToEdit;

  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    EmployeeId: "",
    FirstName: "",
    LastName: "",
    Branch: "",
    MobileNo: "",
    Role: "",
    BusinessVertical: "",
    reporting_manager_name: "",
    reporting_manager_id: "",
  });

  // Bulk Upload State
  const [bulkData, setBulkData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("waiting");

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        EmployeeId: employeeToEdit.EmployeeId || "",
        FirstName: employeeToEdit.FirstName || "",
        LastName: employeeToEdit.LastName || "",
        Branch: employeeToEdit.Branch || "",
        MobileNo: employeeToEdit.MobileNo || "",
        Role: employeeToEdit.Role || "",
        BusinessVertical: employeeToEdit.BusinessVertical || "",
        reporting_manager_name: employeeToEdit.reporting_manager_name || "",
        reporting_manager_id: employeeToEdit.reporting_manager_id || "",
      });
    }
  }, []);

  const businessVerticalOptions = ["RET", "IF", "BCI"];
  const roleOptions = ["SALES", "CREDIT", "AUDIT", "USERACCESS", "AO"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeIdInput = async (e) => {
    if (isEditing) return;
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, EmployeeId: value }));

    if (value.length >= 5) {
      const resp = await fetchEmployeeDetail(value);
      if (resp.success && resp.data?.[0]) {
        const name = resp.data[0].FirstName || "Unknown";
        const lastname = resp.data[0].LastName || "Unknown";
        toast.error(`Employee "${name} ${lastname}" already exists`);
      }
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await insertEmployee(formData);
      if (resp.success) {
        if (resp.data?.status === "exists") {
          toast.success("Employee ID already exists & updated successfully");
          router.push("/employee-access");
        } else {
          toast.success(isEditing ? "Employee updated successfully!" : "Employee added successfully!");
          if (isEditing) {
            router.push("/employee-access");
          } else {
            setFormData({
              EmployeeId: "",
              FirstName: "",
              LastName: "",
              Branch: "",
              MobileNo: "",
              Role: "",
              BusinessVertical: "",
              reporting_manager_name: "",
              reporting_manager_id: "",
            });
          }
        }
      } else {
        toast.error(resp.error || "Failed to add/update employee");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Bulk Upload logic
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isExcel =
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      toast.error("You can only upload Excel files!");
      return;
    }

    setParsing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        const parsedData = jsonData
          .map((item) => {
            const emp = {
              EmployeeId: String(item["Employee ID"] || ""),
              FirstName: item["First Name"] || "",
              LastName: item["Last Name"] || "",
              Branch: String(item["Branch"] || ""),
              MobileNo: String(item["Mobile No"] || ""),
              Role: (item["Role"] || "").toUpperCase(),
              BusinessVertical: (item["Business Vertical"] || "").toUpperCase(),
              reporting_manager_name: item["Reporting Manager Name"] || "",
              reporting_manager_id: String(item["Reporting Manager ID"] || ""),
              status: "VALID",
              error: "",
            };

            if (!businessVerticalOptions.includes(emp.BusinessVertical)) {
              emp.status = "INVALID";
              emp.error = "Invalid Business Vertical";
            }
            if (!roleOptions.includes(emp.Role)) {
              emp.status = "INVALID";
              emp.error = emp.error ? emp.error + " | Invalid Role" : "Invalid Role";
            }
            return emp;
          })
          .filter((emp) => emp.EmployeeId);

        setBulkData(parsedData);
      } catch (err) {
        console.error(err);
        toast.error("Error while parsing Excel");
      } finally {
        setParsing(false);
        e.target.value = null; // Reset input
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleBulkSubmit = async () => {
    setUploadStatus("uploading");
    setLoading(true);
    const updatedData = [...bulkData];

    for (let i = 0; i < updatedData.length; i++) {
      if (updatedData[i].status === "INVALID") continue;

      try {
        const resp = await insertEmployee(updatedData[i]);
        if (resp.success && resp.data?.status === "success") {
          updatedData[i].status = "SUCCESS";
        } else if (resp.success && resp.data?.status === "exists") {
          updatedData[i].status = "UPDATED";
        } else {
          updatedData[i].status = "FAILED";
          updatedData[i].error = "Failed to upload";
        }
      } catch (err) {
        updatedData[i].status = "FAILED";
        updatedData[i].error = "Server error";
      }
      setBulkData([...updatedData]);
    }
    setLoading(false);
    setUploadStatus("completed");
    toast.success("Bulk upload process finished.");
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "Employee ID": "12345",
        "First Name": "John",
        "Last Name": "Doe",
        Branch: "11009",
        "Mobile No": "9876543210",
        Role: "SALES",
        "Business Vertical": "RET",
        "Reporting Manager Name": "Manager Name",
        "Reporting Manager ID": "MGR123",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_Template.xlsx");
  };

  return (
    <div className="page-container">
      <PageHeader title={isEditing ? "Update Employee" : "Add Employees"} showBack={false} className="border-b border-gray-200" />

      <div className="card-container">
        {/* Tabs */}
        {!isEditing && (
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("single")}
              className={`py-4 px-8 text-sm font-semibold transition select-none outline-none ${
                activeTab === "single"
                  ? "text-brand-blue border-b-2 border-brand-orange bg-brand-blue/5"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setActiveTab("bulk")}
              className={`py-4 px-8 text-sm font-semibold transition select-none outline-none ${
                activeTab === "bulk"
                  ? "text-brand-blue border-b-2 border-brand-orange bg-brand-blue/5"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Bulk Upload
            </button>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-6 md:p-8">
          {activeTab === "single" ? (
            <form onSubmit={handleSingleSubmit} className="flex flex-col gap-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID */}
                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="EmployeeId"
                    value={formData.EmployeeId}
                    onChange={handleEmployeeIdInput}
                    disabled={isEditing}
                    placeholder="Enter numbers only"
                    required
                    maxLength={10}
                    className="form-input"
                  />
                </div>
                {/* Mobile */}
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    name="MobileNo"
                    value={formData.MobileNo}
                    onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="9876543210"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                {/* First Name */}
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                {/* Branch */}
                <div className="form-group">
                  <label className="form-label">Branch</label>
                  <input
                    type="text"
                    name="Branch"
                    value={formData.Branch}
                    onChange={handleChange}
                    placeholder="Branch code/name"
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                {/* Role */}
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="Role"
                    value={formData.Role}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white"
                  >
                    <option value="" disabled>Select role</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                {/* Business Vertical */}
                <div className="form-group">
                  <label className="form-label">Business Vertical</label>
                  <select
                    name="BusinessVertical"
                    value={formData.BusinessVertical}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange bg-white"
                  >
                    <option value="" disabled>Select vertical</option>
                    {businessVerticalOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                {/* Manager Name */}
                <div className="form-group">
                  <label className="form-label">Reporting Manager Name</label>
                  <input
                    type="text"
                    name="reporting_manager_name"
                    value={formData.reporting_manager_name}
                    onChange={handleChange}
                    placeholder="Manager Name"
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
                {/* Manager ID */}
                <div className="form-group">
                  <label className="form-label">Reporting Manager ID</label>
                  <input
                    type="text"
                    name="reporting_manager_id"
                    value={formData.reporting_manager_id}
                    onChange={handleChange}
                    placeholder="Manager ID"
                    required
                    className="px-4 py-2 border border-bank-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="px-6 py-2.5"
                >
                  {loading ? "Submitting..." : isEditing ? "Update Employee" : "Add Employee"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="px-6 py-2.5 bg-gray-100 border-none hover:bg-gray-200 text-gray-700"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <div className="page-container">
              {/* Bulk Upload Header */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm">
                  {parsing ? "Parsing..." : "Select Excel File"}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={parsing || loading}
                    className="hidden"
                  />
                </label>
                <Button
                  type="button"
                  onClick={downloadTemplate}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Download Template
                </Button>
              </div>

              {/* Bulk Data Table Preview */}
              {bulkData.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-700">Preview ({bulkData.length} records)</h3>
                    <Button
                      onClick={handleBulkSubmit}
                      disabled={loading || uploadStatus === "completed"}
                      variant="success"
                      className="px-6 py-2"
                    >
                      {loading ? "Uploading..." : `Upload ${bulkData.length} Employees`}
                    </Button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm text-left text-black">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="table-header-cell">ID</th>
                          <th className="table-header-cell">Name</th>
                          <th className="table-header-cell">Role</th>
                          <th className="table-header-cell">Vertical</th>
                          <th className="table-header-cell">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bulkData.map((emp, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-black">{emp.EmployeeId}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{emp.FirstName} {emp.LastName}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{emp.Role}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{emp.BusinessVertical}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`${
                                  emp.status === "VALID"
                                    ? "badge-info"
                                    : emp.status === "INVALID" || emp.status === "FAILED"
                                    ? "badge-error"
                                    : emp.status === "SUCCESS"
                                    ? "badge-success"
                                    : emp.status === "UPDATED"
                                    ? "badge-warning"
                                    : "badge-neutral"
                                }`}
                              >
                                {emp.status}
                              </span>
                              {emp.error && <p className="text-[10px] text-red-500 mt-1 max-w-37.5 truncate" title={emp.error}>{emp.error}</p>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AddEmployeeClient() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading form...</div>}>
      <AddEmployeeForm />
    </Suspense>
  );
}
