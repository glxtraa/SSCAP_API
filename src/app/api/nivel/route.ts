import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tlaloque_id, meters, catched_at } = body;

    if (!tlaloque_id || meters === undefined || !catched_at) {
      return NextResponse.json(
        { success: false, message: "missing_fields" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const record = {
      tlaloque_id,
      meters,
      catched_at: new Date(catched_at).toISOString(),
      id,
      updated_at: now,
      created_at: now,
    };

    // Store in KV
    const key = `sscap:nivel:${now}:${id}`;
    await kv.set(key, record);

    return NextResponse.json(
      { nivel: record },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "nivel_not_saved" },
      { status: 400 }
    );
  }
}
