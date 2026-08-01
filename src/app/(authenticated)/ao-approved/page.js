import React from "react";
export const dynamic = 'force-dynamic';
import CustomerTableClient from "../about/CustomerTableClient";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function AoApprovedPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

  let initialData = [];
  // The original aoapprove/aoApprove.js did not fetch any data
  // Using an empty array for now as a placeholder
  
  return (
    <CustomerTableClient 
      initialData={initialData} 
      title="AO APPROVED APPLICATIONS" 
      columnsConfig={[]} 
      mode="simple"
    />
  );
}
