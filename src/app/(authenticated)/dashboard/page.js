import React from "react";
export const dynamic = 'force-dynamic';
import CustomerTableClient from "../about/CustomerTableClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export const metadata = {
  title: "Dashboard",
  description: "View Udyam deviated cases and overall dashboard metrics.",
};

export default async function DashboardPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

  let initialData = [];
  try {
    const resp = await serverFetch("get-udhyam-deviatedCases");
    
    // Sometimes the decrypted payload is an array, sometimes it is wrapped in an object like { status: 200, data: [...] }
    let extractedData = resp?.data;
    if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.data)) {
      extractedData = extractedData.data;
    } else if (extractedData && !Array.isArray(extractedData) && Array.isArray(extractedData.Data)) {
      extractedData = extractedData.Data; // Handle uppercase 'Data'
    }

    if (Array.isArray(extractedData)) {
      initialData = extractedData;
    } else {
      console.log("Failed to extract array. Found:", typeof extractedData, extractedData);
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching FT Cash cases:", error);
  }

  console.log("DASHBOARD RENDER LENGTH:", initialData.length);
  return <CustomerTableClient initialData={initialData} title="FT CASH APPLICATIONS" source="ftcash" />;
}
