"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import FullscreenImagePreview from "@/components/ui/FullscreenImagePreview";
import { Search } from "lucide-react";
import { useTableSearch } from "@/hooks/useTableSearch";
import { fetchMsmeLeadImageAction } from "@/app/actions";
import toast from "react-hot-toast";

export default function MsmeLeadClient({ initialData = [] }) {
  const { searchText, setSearchText, filteredData } = useTableSearch(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [loadingImageId, setLoadingImageId] = useState(null);

  const handleViewImage = async (leadNumber) => {
    setLoadingImageId(leadNumber);
    try {
      const response = await fetchMsmeLeadImageAction(leadNumber);
      if (response?.success && response?.data?.length > 0 && response.data[0]?.shop_image) {
        const imageBase64 = response.data[0].shop_image;
        setImageSrc(`data:image/jpeg;base64,${imageBase64}`);
        setIsModalVisible(true);
      } else {
        // Fallback if data is not wrapped in success (which actionWrapper does)
        if (response?.length > 0 && response[0]?.shop_image) {
           setImageSrc(`data:image/jpeg;base64,${response[0].shop_image}`);
           setIsModalVisible(true);
        } else {
           toast.error("No image found for this lead.");
        }
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error("Failed to fetch image.");
    } finally {
      setLoadingImageId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setImageSrc("");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "lead_generated_time",
      width: 150,
    },
    {
      title: "Lead No",
      dataIndex: "lead_number",
      width: 150,
      fixed: "left",
    },
    {
      title: "Business",
      dataIndex: "business_name",
    },
    {
      title: "Mobile",
      dataIndex: "phone_number",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    {
      title: "Lat",
      dataIndex: "lat",
    },
    {
      title: "Long",
      dataIndex: "long",
    },
    {
      title: "Shop Img",
      key: "operation",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <button
          onClick={() => handleViewImage(record.lead_number)}
          disabled={loadingImageId === record.lead_number}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            loadingImageId === record.lead_number 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-brand-orange text-white hover:bg-orange-600"
          }`}
        >
          {loadingImageId === record.lead_number ? "Loading..." : "View"}
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <PageHeader title="MSME Lead" showBack={false} className="border-b border-gray-200" />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="lead_number"
          pageSize={10}
        />
      </div>

      <FullscreenImagePreview
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        src={imageSrc}
        alt="Shop Image"
      />
    </div>
  );
}
