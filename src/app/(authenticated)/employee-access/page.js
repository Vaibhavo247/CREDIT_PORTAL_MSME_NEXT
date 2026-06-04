import React from "react";
export const dynamic = 'force-dynamic';
import EmployeeTableClient from "./EmployeeTableClient";
import { serverFetch } from "@/utils/serverApi";

export default async function EmployeeAccessPage() {
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
