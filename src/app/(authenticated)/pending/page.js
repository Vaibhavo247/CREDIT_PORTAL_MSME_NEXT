import React from "react";
export const dynamic = 'force-dynamic';
import CustomerTableClient from "../about/CustomerTableClient";
import { serverFetch } from "@/utils/serverApi";

export const metadata = {
  title: "Pending Applications",
  description: "View and manage pending MSME loan applications.",
};

export default async function PendingPage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-udhyam-deviatedCases");
    
    let extractedData = resp?.data;
    if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    } else if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.Data)) {
      extractedData = extractedData.Data;
    }

    if (Array.isArray(extractedData)) {
      initialData = extractedData.filter(item => item.credit_status === "Pending");
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching pending cases:", error);
  }

  return <CustomerTableClient initialData={initialData} title="PENDING MSME APPLICATIONS" />;
}
