"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { fetchFiReportAction } from "@/app/actions";

dayjs.extend(customParseFormat);

export default function FiReportClient({ initialData = [] }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatData = (rawData) => {
    return rawData.map((item) => {
      let parsedDate = null;
      if (item.created_on) {
        parsedDate = dayjs(item.created_on);
        if (!parsedDate.isValid()) {
          parsedDate = dayjs(item.created_on, 'DD-MM-YYYY');
        }
        if (!parsedDate.isValid()) {
          parsedDate = null;
        }
      }

      return {
        ...item,
        application_id: item.application_id || "N/A",
        full_name: item.full_name || "N/A",
        created_on: item.created_on || "N/A",
        udhyam_no: item.udyam_number || "N/A",
        business_address: item.business_address || "N/A",
        business_city: item.business_city || "N/A",
        business_pincode: item.business_pincode || "N/A",
        latitude: item.latitude || "N/A",
        longitude: item.longitude || "N/A",
        loan_status: item.loan_status || "N/A",
        udyam_name: item.udyam_name || "N/A",
        mobile_no: item.mobile_no || "N/A",
        pan_no: item.pan_number || "N/A",
        createdDate: parsedDate,
        createdDateUnix: parsedDate ? parsedDate.valueOf() : 0,
      };
    });
  };

  useEffect(() => {
    if (initialData.length > 0) {
      const formatted = formatData(initialData);
      setData(formatted);
      setFilteredData(formatted);
    } else {
      fetchDisbursedData();
    }
  }, []);

  const fetchDisbursedData = async () => {
    setLoading(true);
    try {
      const response = await fetchFiReportAction();
      if (response?.success && Array.isArray(response.data)) {
        const mappedData = formatData(response.data);
        setData(mappedData);
        setFilteredData(mappedData);
      } else if (Array.isArray(response)) {
        const mappedData = formatData(response);
        setData(mappedData);
        setFilteredData(mappedData);
      } else {
         toast.error("Failed to load FI Report data");
      }
    } catch (error) {
      console.error("Error fetching disbursed data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }

    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).endOf('day');
    
    const diffInDays = end.diff(start, 'day');
    if (diffInDays > 30) {
      toast.error("Maximum date range allowed is 30 days");
      setEndDate("");
      return;
    }

    const filtered = data.filter(item => {
      if (!item.createdDate) return false;
      return (
        (item.createdDate.isAfter(start) || item.createdDate.isSame(start)) &&
        (item.createdDate.isBefore(end) || item.createdDate.isSame(end))
      );
    });

    setFilteredData(filtered);
  }, [startDate, endDate, data]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = filteredData.map((item) => ({
      "Application ID": item.application_id,
      "Full Name": item.full_name,
      "Date": item.created_on,
      "Business Name": item.udyam_name,
      "Mobile No": item.mobile_no,
      "Business Address": item.business_address,
      "Business City": item.business_city,
      "Business Pincode": item.business_pincode,
      "Latitude": item.latitude,
      "Longitude": item.longitude,
      "Loan Status": item.loan_status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursed Applications");
    XLSX.writeFile(workbook, `FI_Report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
  };

  const columns = [
    {
      title: "Application ID",
      width: 150,
      dataIndex: "application_id",
      fixed: "left",
    },
    {
      title: "Full Name",
      width: 200,
      dataIndex: "full_name",
    },
    {
      title: "Date",
      width: 120,
      dataIndex: "created_on",
      render: (text) => {
        if (!text || text === "N/A") return "N/A";
        let d = dayjs(text);
        if (!d.isValid()) d = dayjs(text, 'DD-MM-YYYY');
        return d.isValid() ? d.format('DD-MMM-YYYY') : "Invalid Date";
      },
    },
    {
      title: "Mobile Number",
      width: 150,
      dataIndex: "mobile_no",
    },
    {
      title: "Business Name",
      width: 200,
      dataIndex: "udyam_name",
    },
    {
      title: "Business Address",
      width: 300,
      dataIndex: "business_address",
    },
    {
      title: "City",
      width: 150,
      dataIndex: "business_city",
    },
    {
      title: "Pincode",
      width: 100,
      dataIndex: "business_pincode",
    },
    {
      title: "Latitude",
      width: 120,
      dataIndex: "latitude",
    },
    {
      title: "Longitude",
      width: 120,
      dataIndex: "longitude",
    },
    {
      title: "Loan Status",
      width: 150,
      dataIndex: "loan_status",
      render: (status) => {
        const isApproved = status?.toLowerCase() === "approved";
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isApproved ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
            {status}
          </span>
        );
      }
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <PageHeader title="FI Report" showBack={false} />
      
      <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-auto">
        <Card className="mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full md:w-auto">
            <Input 
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || dayjs().format('YYYY-MM-DD')}
              wrapperClassName="w-full sm:w-40"
            />
            
            <Input 
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={dayjs().format('YYYY-MM-DD')}
              wrapperClassName="w-full sm:w-40"
            />

            <Button 
              variant="ghost"
              onClick={resetFilters}
              disabled={!startDate && !endDate}
            >
              <RefreshCw size={16} />
              Reset
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={exportToExcel}
            disabled={filteredData.length === 0}
            className="w-full md:w-auto"
          >
            <Download size={18} />
            Export Excel
          </Button>
        </Card>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="application_id"
          pageSize={10}
          loading={loading}
          emptyText="No FI reports found"
        />
      </div>
    </div>
  );
}
