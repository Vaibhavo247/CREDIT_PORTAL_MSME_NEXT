"use client";

import toast from "react-hot-toast";

/**
 * A centralized wrapper for calling Next.js Server Actions from Client Components.
 * Automatically handles popping up error toasts if the action fails.
 * 
 * @param {Promise} actionPromise - The Server Action promise to execute.
 * @param {string|null} successMsg - Optional success message to toast.
 * @returns {Promise<any>} The response data if successful, or null if failed.
 */
export async function safeAction(actionPromise, successMsg = null) {
  try {
    const resp = await actionPromise;
    
    if (resp?.success) {
      if (successMsg) {
        toast.success(successMsg);
      }
      return resp;
    } else {
      // The server action returned success: false
      const errorText = resp?.error || "An unexpected error occurred.";
      toast.error(errorText);
      return null;
    }
  } catch (error) {
    // Hard crash during the server action call (e.g. network completely down)
    console.error("Action execution failed:", error);
    toast.error("Network or system error. Please check your connection.");
    return null;
  }
}
