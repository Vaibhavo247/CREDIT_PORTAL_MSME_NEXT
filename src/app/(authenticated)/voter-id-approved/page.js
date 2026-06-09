import React from "react";
export const dynamic = 'force-dynamic';
import VoterIdApprovedClient from "./VoterIdApprovedClient";
import { serverFetch } from "@/utils/serverApi";

export const metadata = {
  title: "Approved Voter ID Verification",
};

export default async function VoterIdApprovedPage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-voterid-approvedCases");
    if (resp && Array.isArray(resp.data)) {
      initialData = resp.data;
    } else if (Array.isArray(resp)) {
      initialData = resp;
    }
  } catch (error) { 
    if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to fetch approved voter ID data:", error);
  }

  return <VoterIdApprovedClient initialData={initialData} title="APPROVED VOTER ID VERIFICATION" />;
}
