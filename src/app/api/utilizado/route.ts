import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tlaloque_id, pulses, used_at } = body;

    if (!tlaloque_id || pulses === undefined || !used_at) {
      return NextResponse.json(
        { success: false, message: "missing_fields" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record = {
      data: {
        tlaloque_id,
        pulses,
        used_at: new Date(used_at).toISOString(),
      },
      metadata: {
        ip: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for'),
        city: request.headers.get('x-vercel-ip-city'),
        country: request.headers.get('x-vercel-ip-country'),
        userAgent: request.headers.get('user-agent'),
      },
      id,
      updated_at: now,
      created_at: now,
    };

    // Store in Blob
    const filename = `sscap/utilizado/${now.replace(/:/g, '-')}-${id}.json`;
    await put(filename, JSON.stringify(record), {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json(
      { utilizado: record },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving to Blob:", error);
    return NextResponse.json(
      { success: false, message: "utilizado_not_saved", error: error.message },
      { status: 400 }
    );
  }
}
