import React from "react";
import { serverFetch } from "@/utils/serverApi";
import OnePagerClient from "@/components/onepager/OnePagerClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "One Pager Document",
  description: "Generate and download One Pager PDF documents for MSME applications.",
};

export default async function OnePagerPage() {
  let records = [];

  try {
    const resp = await serverFetch("get-all-records");
    if (Array.isArray(resp?.data)) {
      records = resp.data;
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Failed to fetch one-pager records:", error);
  }

  return <OnePagerClient initialData={records} />;
}
