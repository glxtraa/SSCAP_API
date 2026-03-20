import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    let allData = [];
    let hasMore = true;
    let cursor = undefined;

    while (hasMore) {
      const response: any = await list({
        prefix: 'sscap/',
        cursor,
      });

      for (const blob of response.blobs) {
        const res = await fetch(blob.url);
        const data = await res.json();
        allData.push({ pathname: blob.pathname, data });
      }

      hasMore = response.hasMore;
      cursor = response.cursor;
    }

    return new NextResponse(JSON.stringify(allData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="sscap_data_backup.json"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "download_failed", error: error.message },
      { status: 500 }
    );
  }
}
