import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function AoExceptionPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

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
