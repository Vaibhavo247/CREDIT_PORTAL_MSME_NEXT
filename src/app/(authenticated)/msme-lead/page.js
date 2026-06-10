import React from "react";
import MsmeLeadClient from "./MsmeLeadClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export const metadata = {
  title: "MSME Lead",
  description: "View and manage MSME leads.",
};

export default async function MsmeLeadPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT]);

  let initialData = [];

  try {
    const resp = await serverFetch("get-msme-lead");
    if (resp?.data && Array.isArray(resp.data)) {
      initialData = resp.data;
    }
  } catch (error) {
    if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) {
      throw error;
    }
    console.error("Error fetching msme lead data:", error);
  }

  return <MsmeLeadClient initialData={initialData} />;
}
