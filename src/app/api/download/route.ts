import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allData = [];
    const { blobs } = await list({
      prefix: 'sscap/',
    });

    if (blobs.length === 0) {
      return NextResponse.json({ success: true, message: "no_data_found", data: [] });
    }

    for (const blob of blobs) {
      try {
        const res = await fetch(blob.url);
        if (res.ok) {
          const content = await res.json();
          allData.push({
            filename: blob.pathname,
            uploadedAt: blob.uploadedAt,
            url: blob.url,
            content
          });
        }
      } catch (e) {
        console.error(`Failed to fetch blob ${blob.url}:`, e);
        // Continue to next blob even if one fails
      }
    }

    return new NextResponse(JSON.stringify(allData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="sscap_full_backup.json"',
      },
    });
  } catch (error: any) {
    console.error("Download endpoint error:", error);
    return NextResponse.json(
      { success: false, message: "download_failed", error: error.message },
      { status: 500 }
    );
  }
}
