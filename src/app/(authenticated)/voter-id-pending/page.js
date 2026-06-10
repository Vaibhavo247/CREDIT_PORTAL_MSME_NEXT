import React from "react";
export const dynamic = 'force-dynamic';
import VoterIdPendingClient from "./VoterIdPendingClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export const metadata = {
  title: "Pending Voter ID Verification",
};

export default async function VoterIdPendingPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT, APP_ROLES.AUDIT]);

  let initialData = [];
  try {
    const resp = await serverFetch("get-voterid-deviatedCases");
    if (resp && Array.isArray(resp.data)) {
      initialData = resp.data;
    } else if (Array.isArray(resp)) {
      initialData = resp;
    }
  } catch (error) { 
    if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to fetch pending voter ID data:", error);
  }

  return <VoterIdPendingClient initialData={initialData} title="PENDING VOTER ID VERIFICATION" />;
}
