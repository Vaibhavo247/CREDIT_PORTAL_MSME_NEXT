import React from "react";
import ViewPersonClient from "./ViewPersonClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Customer Details (${id})`,
    description: `View complete details and documents for customer application ${id}.`,
  };
}

export default async function ViewPersonPage({ params, searchParams }) {
  const { id } = await params;
  const { source } = await searchParams; // "ftcash" or undefined
  
  const auth = await checkAuth();

  // Fetch all necessary data
  let initialSummary = {};
  let initialDocs = {};
  let initialStaticDetails = [];
  let sectorSubsector = [];
  let initialBusinessImages = {};

  try {
    // 1. Fetch Summary
    const summaryResp = await serverFetch(`getSummary/${id}`);
    if (summaryResp?.data && Array.isArray(summaryResp.data)) {
      initialSummary = summaryResp.data[0] || {};
    }

    // 2. Fetch Docs
    const docsResp = await serverFetch(`getCaseDocs/${id}`);
    if (docsResp?.data) {
      initialDocs = Array.isArray(docsResp.data) ? docsResp.data[0] || docsResp.data : docsResp.data;
    }

    // get-msme-static-details has been removed to optimize page load.
    // It is now fetched on the client side via the msme report API.

    // Only fetch these if not ftcash or if they might be used
    if (source !== "ftcash") {
      const sectorResp = await serverFetch("get-sector-subsector");
      if (sectorResp?.data && Array.isArray(sectorResp.data)) {
        sectorSubsector = sectorResp.data;
      }
    }

    const imgResp = await serverFetch(`webGetBusinessImage/${id}`);
    console.log("DEBUG IMG RESP:", imgResp);
    if (imgResp?.data && imgResp.data.length > 0) {
      initialBusinessImages = imgResp.data[0] || {};
    }

  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching view person data:", error);
  }

  return (
    <ViewPersonClient
      id={id}
      source={source}
      userId={auth.userId}
      userRole={auth.userRole}
      initialSummary={initialSummary}
      initialDocs={initialDocs}
      initialStaticDetails={initialStaticDetails}
      sectorSubsector={sectorSubsector}
      initialBusinessImages={initialBusinessImages}
    />
  );
}
