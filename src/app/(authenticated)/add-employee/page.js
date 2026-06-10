import React from "react";
import AddEmployeeClient from "./AddEmployeeClient";
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";

export default async function AddEmployeePage() {
  await checkAuth([APP_ROLES.ADMIN, APP_ROLES.CREDIT, APP_ROLES.USERACCESS]);

  return <AddEmployeeClient />;
}
