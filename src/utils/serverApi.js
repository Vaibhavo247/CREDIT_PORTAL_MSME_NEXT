import CryptoJS from "crypto-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Agent, setGlobalDispatcher } from "undici";
import crypto from "crypto";

if (process.env.NODE_ENV === "development") {
  try {
    setGlobalDispatcher(
      new Agent({
        connect: {
          rejectUnauthorized: false,
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
        },
      })
    );
  } catch (e) {
    console.error("Failed to set dev dispatcher:", e);
  }
}


const API_BASE_URL = process.env.API_BASE_URL || "https://msme.suryodaybank.co.in/api";
const API_KEY = process.env.API_KEY;

export function encryptData(data) {
  try {
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, API_KEY).toString();
  } catch (error) {
    console.error("AES Encryption Error:", error);
    return null;
  }
}

export function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, API_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("AES Decryption Error:", error);
    return null;
  }
}

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sso_token")?.value || cookieStore.get("SSOAccessToken")?.value;
    return token || null;
  } catch (error) {
    // If not in a server request context, return null
    return null;
  }
}

export async function serverFetch(endpoint, options = {}) {
  const token = await getAuthToken();
  const baseUrl = options.baseUrl || API_BASE_URL;
  const url = `${baseUrl}/${endpoint.replace(/^\//, "")}`;


  const headers = {
    "app-version": "1.0.18",
    "Connection": "close",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
  }

  console.log("SERVER FETCH TO:", url, "HEADERS:", { ...headers, Authorization: !!token ? "Bearer <token>" : undefined });

  let body = options.body;
  if (body && (options.method === "POST" || options.method === "PUT" || options.method === "PATCH")) {
    if (options.encrypt !== false) {
      const encrypted = encryptData(body);
      body = JSON.stringify({ data: encrypted });
      headers["Content-Type"] = "application/json";
    } else {
      body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }
  }

  const fetchOptions = {
    method: options.method || "GET",
    headers,
    body,
    cache: "no-store", // disable caching for live bank-grade data
  };

  try {
    const res = await fetch(url, fetchOptions);
    
    if (options.responseType === "arraybuffer") {
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    if (!res.ok) {
      console.log("FETCH ERROR STATUS:", res.status, url);
      let errorMessage = `Unexpected server error (${res.status}).`;
      
      if (res.status === 401 || res.status === 403) {
        redirect("/browser?message=Session expired. Please log in again.");
      } else if (res.status >= 500) {
        errorMessage = "The bank's server is currently unresponsive. Please try again later.";
      } else if (res.status === 404) {
        errorMessage = "The requested resource could not be found.";
      } else if (res.status === 400) {
        errorMessage = "Invalid request. Please check your data and try again.";
      } else if (res.status === 408 || res.status === 504) {
        errorMessage = "The connection timed out. Please check your network.";
      }

      throw new Error(errorMessage);
    }

    const rawData = await res.json();
    const { encryptedResponse } = rawData || {};

    let decrypted = null;
    if (encryptedResponse) {
      decrypted = decryptData(encryptedResponse);
    }

    // Standardize response output to match all legacy checking patterns:
    // e.g. resp?.data, resp?.decryptedData?.data, and returning raw data.
    const responsePayload = {
      ...rawData,
      data: decrypted?.data || decrypted || rawData?.data || rawData,
      decryptedData: decrypted ? { data: decrypted?.data || decrypted } : (rawData?.decryptedData || { data: rawData?.data || rawData }),
    };

    return responsePayload;
  } catch (error) {
    console.error(`API Fetch Error [${url}]:`, error);
    throw error;
  }
}
