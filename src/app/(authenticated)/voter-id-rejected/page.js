import React from "react";
export const dynamic = 'force-dynamic';
import VoterIdRejectedClient from "./VoterIdRejectedClient";
import { serverFetch } from "@/utils/serverApi";

export const metadata = {
  title: "Rejected Voter ID Verification",
};

export default async function VoterIdRejectedPage() {
  let initialData = [];
  try {
    const resp = await serverFetch("get-voterid-rejectedCases");
    if (resp && Array.isArray(resp.data)) {
      initialData = resp.data;
    } else if (Array.isArray(resp)) {
      initialData = resp;
    }
  } catch (error) { 
    if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to fetch rejected voter ID data:", error);
  }

  return <VoterIdRejectedClient initialData={initialData} title="REJECTED VOTER ID VERIFICATION" />;
}
