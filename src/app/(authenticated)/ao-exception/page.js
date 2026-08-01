import React from "react";
export const dynamic = 'force-dynamic';
import CustomerTableClient from "../about/CustomerTableClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function AoExceptionPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

  let initialData = [];
  // The original aoexception/exception.js did not fetch any data
  // Using an empty array for now as a placeholder
  
  return (
    <CustomerTableClient 
      initialData={initialData} 
      title="AO EXCEPTION APPLICATIONS" 
      columnsConfig={[]} 
      mode="simple"
    />
  );
}
