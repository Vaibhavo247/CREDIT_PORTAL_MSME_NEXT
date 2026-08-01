"use client";

import React, { useState, useMemo } from "react";
import { Search, Mic, PlayCircle, Download, Clock, Calendar } from "lucide-react";
import Table from "@/components/ui/Table";

export default function AudioTransactionsClient({ initialData = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return initialData;
    return initialData.filter((item) =>
      item.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialData, searchTerm]);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      width: 150,
      render: (text) => <span className="text-sm font-semibold text-brand-blue">{text}</span>
    },
    {
      title: "Application ID",
      dataIndex: "application_id",
      width: 160,
      render: (text) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
          {text}
        </span>
      )
    },
    {
      title: "Agent",
      dataIndex: "agent",
      width: 160,
      render: (text) => <span className="text-sm font-medium text-gray-700">{text}</span>
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      width: 180,
      render: (text) => (
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Calendar size={14} className="mr-2 text-gray-400" />
          {new Date(text).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      )
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 120,
      render: (text) => (
        <div className="flex items-center text-sm font-medium text-gray-600">
          <Clock size={14} className="mr-2 text-gray-400" />
          {text}
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: () => (
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold flex items-center w-max">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          Completed
        </span>
      )
    },
    {
      title: "Action",
      fixed: "right",
      width: 120,
      render: (_, record) => {
        return (
          <div className="flex items-center gap-3">
            <button className="p-2 text-brand-blue hover:bg-blue-100 rounded-xl transition-colors tooltip" title="Play Audio">
              <PlayCircle size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors tooltip" title="Download Transcript">
              <Download size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-brand-orange uppercase flex items-center gap-3">
            <Mic size={24} className="text-brand-orange" />
            Audio Transactions
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2 ml-1">
            Monitor and review completed audio verifications
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-bank-border rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
            placeholder="Search by App ID or Agent Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-blue">
            <Mic size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Audios</p>
            <p className="text-2xl font-black text-brand-blue mt-1">{initialData.length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-brand-blue mt-1">{initialData.length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-3xl flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-brand-orange">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Duration</p>
            <p className="text-2xl font-black text-brand-blue mt-1">11m 30s</p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full">
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          emptyText="No audio transactions found"
          pageSize={10}
        />
      </div>
    </div>
  );
}
