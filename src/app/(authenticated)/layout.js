import React from "react";
import { checkAuth } from "@/utils/auth";
import MainLayout from "@/components/MainLayout";

export default async function AuthenticatedLayout({ children }) {
  // Guard the entire authenticated layout group.
  // Individual pages can also invoke checkAuth with specific roles.
  const { userId, userRole } = await checkAuth();

  return (
    <MainLayout userId={userId} userRole={userRole}>
      {children}
    </MainLayout>
  );
}
