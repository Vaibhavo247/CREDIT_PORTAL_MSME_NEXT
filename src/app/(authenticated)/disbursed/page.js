import React from "react";
export const dynamic = 'force-dynamic';
import DisbursedTableClient from "./DisbursedTableClient";
import { serverFetch } from "@/utils/serverApi";

export const metadata = {
  title: "Disbursed Applications",
  description: "View and manage disbursed MSME loan applications.",
};

export default async function DisbursedPage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-disbursed-records");
    
    let extractedData = resp?.data;
    if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    } else if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.Data)) {
      extractedData = extractedData.Data;
    }

    if (Array.isArray(extractedData)) {
      initialData = extractedData;
    } else if (Array.isArray(resp)) {
      initialData = resp;
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to fetch disbursed data:", error);
  }

  return <DisbursedTableClient initialData={initialData} title="DISBURSED APPLICATIONS" />;
}
