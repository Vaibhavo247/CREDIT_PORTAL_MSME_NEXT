import React from "react";
export const dynamic = 'force-dynamic';
import SimpleStatusTableClient from "@/components/ui/SimpleStatusTableClient";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function AoApprovedPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

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
