import React from "react";
import { fetchFiReportAction } from "@/app/actions";
import FiReportClient from "./FiReportClient";

export const metadata = {
  title: "FI Report | Suryoday MSME",
};

export default async function FiReportPage() {
  const result = await fetchFiReportAction();
  const initialData = result?.success ? result.data || [] : [];

  return <FiReportClient initialData={initialData} />;
}
