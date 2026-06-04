import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";
import { serverFetch } from "@/utils/serverApi";

export default async function ApprovePage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-credit-approved-records");
    if (Array.isArray(resp?.data)) {
      initialData = resp.data;
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching approved records:", error);
  }

  return (
    <SimpleStatusTableClient 
      initialData={initialData} 
      title="APPROVED APPLICATIONS" 
      columnsConfig={["case_type"]} 
    />
  );
}
