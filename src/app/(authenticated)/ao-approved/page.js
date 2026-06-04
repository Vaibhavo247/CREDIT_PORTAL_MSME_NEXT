import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";

export default async function AoApprovedPage() {
  let initialData = [];
  // The original aoapprove/aoApprove.js did not fetch any data
  // Using an empty array for now as a placeholder
  
  return (
    <SimpleStatusTableClient 
      initialData={initialData} 
      title="AO APPROVED APPLICATIONS" 
      columnsConfig={[]} 
    />
  );
}
