import { NextResponse } from "next/server";
import { serverFetch } from "@/services/api";

export async function GET(request, { params }) {
  try {
    const { type, id } = await params;

    let endpoint = "";
    let mimeType = "";
    let filename = "";

    if (type === "pdf") {
      endpoint = `aggregatorbankStatment/${id}`;
      mimeType = "application/pdf";
      filename = `statement_${id}.pdf`;
    } else if (type === "excel") {
      endpoint = `aggregatorbankStatmentexcel/${id}`;
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      filename = `statement_${id}.xlsx`;
    } else {
      return new NextResponse("Invalid download type", { status: 400 });
    }

    // Fetch the binary file from the backend API server-side
    const fileBuffer = await serverFetch(endpoint, {
      responseType: "arraybuffer",
      headers: {
        Accept: mimeType,
      },
    });

    // Return the file stream back to the client
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) { if (error.message === "NEXT_REDIRECT" || (error.digest && error.digest.startsWith("NEXT_REDIRECT"))) throw error;
    console.error("Proxy download failed:", error);
    return new NextResponse("Download failed", { status: 500 });
  }
}
