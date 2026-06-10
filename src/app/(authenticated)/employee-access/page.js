import React from "react";
export const dynamic = 'force-dynamic';
import EmployeeTableClient from "./EmployeeTableClient";
import { serverFetch } from "@/services/api";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function EmployeeAccessPage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT, APP_ROLES.USERACCESS]);

  let initialEmployees = [];
  try {
    const resp = await serverFetch("getemployee");
    if (Array.isArray(resp?.data)) {
      initialEmployees = resp.data;
    }
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error fetching employee data:", error);
  }

  return <EmployeeTableClient initialEmployees={initialEmployees} />;
}
