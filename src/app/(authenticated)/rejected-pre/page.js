import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";
import { serverFetch } from "@/utils/serverApi";

export default async function RejectedPrePage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-rejected-pre-case");
    if (Array.isArray(resp?.data)) {
      initialData = resp.data;
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching rejected cases:", error);
  }

  return (
    <SimpleStatusTableClient 
      initialData={initialData} 
      title="REJECTED APPLICATIONS" 
      columnsConfig={[]} 
    />
  );
}
