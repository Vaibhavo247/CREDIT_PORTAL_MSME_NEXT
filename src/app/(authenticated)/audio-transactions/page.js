import React from "react";
export const dynamic = 'force-dynamic';
import { checkAuth } from "@/utils/auth";
import { APP_ROLES } from "@/constants";
import AudioTransactionsClient from "./AudioTransactionsClient";
import { fetchAudioTransactions } from "@/app/actions";

export const metadata = {
  title: "Audio Transactions Dashboard",
  description: "Monitor completed audio transactions.",
};

export default async function AudioTransactionsPage() {
  // Enforce ADMIN only access
  await checkAuth([APP_ROLES.ADMIN]);

  // Fetch the mock audio transactions
  const dataResponse = await fetchAudioTransactions();
  
  // Handle the actionWrapper response
  const transactions = dataResponse?.success ? dataResponse.data : [];

  return <AudioTransactionsClient initialData={transactions} />;
}
