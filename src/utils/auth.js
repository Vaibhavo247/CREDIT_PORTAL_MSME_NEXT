import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { getAuthToken, serverFetch } from "./serverApi";
import { cookies } from "next/headers";

export async function checkAuth(allowedRoles = []) {
  const cookieStore = await cookies();
  const devBypass = cookieStore.get("DEV_BYPASS")?.value === "true";

  if (process.env.NODE_ENV === "development" && devBypass) {
    return {
      userId: "dev_bypass_user",
      userRole: "admin",
      tokenExp: Date.now() + 1000000,
    };
  }

  const token = await getAuthToken();
  if (!token) {
    redirect("/");
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      // Clear cookie and redirect
      redirect("/browser?message=Session expired. Please log in again.");
    }

    const userRole = decoded.Role || null;

    if (!userRole) {
      console.warn("No role returned for user:", decoded.userId);
      redirect("/unauthorized");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      redirect("/unauthorized");
    }

    return {
      userId: decoded.userId,
      userRole,
      tokenExp: decoded.exp,
    };
  } catch (error) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Auth verification error:", error);
    redirect("/");
  }
}
