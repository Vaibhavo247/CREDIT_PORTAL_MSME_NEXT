import React from "react";
import { serverFetch } from "@/services/api";
import OnePagerClient from "@/components/onepager/OnePagerClient";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "One Pager Document",
  description: "Generate and download One Pager PDF documents for MSME applications.",
};

export default async function OnePagerPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

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
