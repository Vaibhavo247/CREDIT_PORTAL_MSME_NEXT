import React from "react";
import { fetchFiReportAction } from "@/app/actions";
import FiReportClient from "./FiReportClient";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export const metadata = {
  title: "FI Report | Suryoday MSME",
};

export default async function FiReportPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT, APP_ROLES.AUDIT]);

  const result = await fetchFiReportAction();
  const initialData = result?.success ? result.data || [] : [];

  return <FiReportClient initialData={initialData} />;
}
