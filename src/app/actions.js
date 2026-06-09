"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "@/utils/serverApi";

async function actionWrapper(actionName, fn) {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error(`Error in ${actionName}:`, error);
    return { success: false, error: error.message };
  }
}


export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("sso_token");
  cookieStore.delete("SSOAccessToken");
  cookieStore.delete("DEV_BYPASS");

  const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === "prod";
  const logoutUrl = isProd
    ? "https://sbsignin.suryodaybank.com/pkmslogout"
    : "https://uatws.suryodaybank.co.in/pkmslogout";

  const redirectUrl = isProd
    ? "https://msme.suryodaybank.com/WebPortal/"
    : "https://msme.suryodayuat.bank.in/WebPortal/";

  const finalUrl = `${logoutUrl}?client_id=MSME&response_type=code&scope=openid&state=logout_${Date.now()}&redirect_uri=${encodeURIComponent(
    redirectUrl
  )}`;

  redirect(finalUrl);
}

// Server Action for checking agent access
export const checkAgentAccess = async (id) => actionWrapper("checkAgentAccess", async () => {
  const resp = await serverFetch(`getActiveAgent/${id}`);
  return resp?.data;
});

// Server Action for saving active agent access
export const saveActiveAgent = async (id) => actionWrapper("saveActiveAgent", async () => {
  const resp = await serverFetch(`getAgentAction/${id}`);
  return resp?.data;
});

// Server Action for approving a case
export async function approveCase(id, approvedBy, source = "") {
  try {
    const resp = source === "ftcash"
      ? await serverFetch(`updateDeviatedCase/${id}`) // ftcash uses GET without body
      : await serverFetch("updateDeviatedCase", {
          method: "POST",
          body: { id, approved_by: approvedBy },
        });
    return { success: true, data: resp?.data };
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Error approving case:", error);
    return { success: false, error: error.message };
  }
}

// Server Action for pending a case
export const pendingCase = async (id, selectiveComment, comment, approvedBy) => actionWrapper("pendingCase", async () => {
  const resp = await serverFetch("pendingDeviatedCase", {
      method: "POST",
      body: {
        id,
        credit_selective_comment: selectiveComment,
        credit_comment: comment || "",
        approved_by: approvedBy,
      },
    });
  return resp?.data;
});

// Server Action for rejecting a case
export const rejectCase = async (id, comment, approvedBy) => actionWrapper("rejectCase", async () => {
  const resp = await serverFetch("rejectDeviatedCase", {
      method: "POST",
      body: {
        id,
        credit_comment: comment,
        approved_by: approvedBy,
      },
    });
  return resp?.data;
});

// Server Action for verifying voter ID
export const verifyVoterId = async (id, approvedBy, status, comment = "") => actionWrapper("verifyVoterId", async () => {
  const resp = await serverFetch("verifyVoterId", {
      method: "POST",
      body: {
        id,
        approved_by: approvedBy,
        status,
        comment,
      },
    });
  return resp?.data;
});

// Server Action for fetching MSME Lead image
export const fetchMsmeLeadImageAction = async (leadNumber) => actionWrapper("fetchMsmeLeadImageAction", async () => {
  const resp = await serverFetch(`getMsmeLeadImage/${leadNumber}`);
  return resp?.data;
});

export const fetchFiReportAction = async () => actionWrapper("fetchFiReportAction", async () => {
  const resp = await serverFetch("get-msme-customer-details", {
      method: "GET",
    });
  return resp?.data;
});

// Server Action to upload a business image
export const uploadBusinessImage = async (id, imgName, base64Image) => actionWrapper("uploadBusinessImage", async () => {
  const resp = await serverFetch(`webUploadBusinessImage/${id}`, {
      method: "POST",
      body: {
        imgName,
        img: base64Image,
      },
    });
  return resp?.data;
});

// Server Action to fetch employee detail
export const fetchEmployeeDetail = async (val) => actionWrapper("fetchEmployeeDetail", async () => {
  const resp = await serverFetch(`getEmployeeDetail/${val}`);
  return resp?.data;
});

// Server Action to add an employee
export const insertEmployee = async (body) => actionWrapper("insertEmployee", async () => {
  const resp = await serverFetch("insertEmployee", {
      method: "POST",
      body,
    });
  return resp?.data;
});

// Server Action to update employee list / permissions
export const updateEmployeePermissions = async (body) => actionWrapper("updateEmployeePermissions", async () => {
  const resp = await serverFetch("updateEmployeePermission", {
      method: "POST",
      body,
    });
  return resp?.data;
});

// Server Action for user loan journey timeline
export const fetchLoanJourney = async (applicationId) => actionWrapper("fetchLoanJourney", async () => {
  const resp = await serverFetch(`userJourney/${applicationId}`);
  return resp?.data;
});

// Server Action for house/AO business image
export const fetchHouseImage = async (id) => actionWrapper("fetchHouseImage", async () => {
  const resp = await serverFetch(`get_ao_image/${id}`);
  return resp?.data;
});

// Server Action for updating sector, subsector, entity type, dates
export const updateSectorSubsectorCase = async (payload) => actionWrapper("updateSectorSubsectorCase", async () => {
  const resp = await serverFetch("updateSectorSubsectorCase", {
      method: "POST",
      body: payload,
    });
  return resp?.data;
});

// Server Action for updating landmark details
export const landmarkByAgent = async (payload) => actionWrapper("landmarkByAgent", async () => {
  const resp = await serverFetch("landmarkByAgent", {
      method: "POST",
      body: payload,
    });
  return resp?.data;
});

// Server Action for uploading Udyam PDF document
export const updateUdyamDocs = async (payload) => actionWrapper("updateUdyamDocs", async () => {
  const resp = await serverFetch("updateUdyamDocs", {
      method: "POST",
      body: payload,
    });
  return resp?.data;
});

// Server Action to fetch BRE Bureau eligibility criteria
export const fetchBreReportData = async (applicationId) => actionWrapper("fetchBreReportData", async () => {
  const resp = await serverFetch(`/msme/report/${applicationId}`);
  const rawData = resp?.data?.data || resp?.data || resp;
  const cleanData = rawData?.DATA || rawData;
  return cleanData;
});


// Server Action to update employee status
export const updateEmployeeStatus = async (EmployeeId, active_inactive) => actionWrapper("updateEmployeeStatus", async () => {
  const resp = await serverFetch("updateEmployeeStatus", {
      method: "POST",
      body: { EmployeeId, active_inactive },
    });
  return resp?.data;
});

// Server Action for One Pager PDF Data
export const fetchPdfDataAction = async (msmeId, appId) => actionWrapper("fetchPdfDataAction", async () => {
  const [respSummary, respCombined] = await Promise.all([
    serverFetch(`getSummary/${msmeId}`),
    serverFetch(`/msme/report/${appId}`)
  ]);
  return {
    summary: respSummary?.data?.[0] || {},
    combined: respCombined?.DATA || {}
  };
});

