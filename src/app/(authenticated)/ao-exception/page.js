import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";
import { serverFetch } from "@/utils/serverApi";

export default async function AoExceptionPage() {
  let initialData = [];
  // The original aoexception/exception.js did not fetch any data
  // Using an empty array for now as a placeholder
  
  return (
    <SimpleStatusTableClient 
      initialData={initialData} 
      title="AO EXCEPTION APPLICATIONS" 
      columnsConfig={[]} 
    />
  );
}
