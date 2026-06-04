import React from "react";
export const dynamic = 'force-dynamic';
import { checkAuth } from "@/utils/auth";
import { serverFetch } from "@/utils/serverApi";
import CustomerTableClient from "./CustomerTableClient";

export const metadata = {
  title: "Active Applications",
  description: "View and manage active MSME loan applications.",
};

export default async function AboutPage() {
  // Ensure only CREDIT and AUDIT roles can access
  await checkAuth(["CREDIT", "AUDIT"]);

  let activeData = [];
  try {
    const resp = await serverFetch("get-udhyam-deviatedCases");
    
    let extractedData = resp?.data;
    if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    } else if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.Data)) {
      extractedData = extractedData.Data;
    }

    if (Array.isArray(extractedData)) {
      activeData = extractedData.filter(
        (item) =>
          item.credit_status === "Active" || item.is_comment_resolved === true
      );
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to load MSME applications:", error);
  }

  return <CustomerTableClient initialData={activeData} />;
}
