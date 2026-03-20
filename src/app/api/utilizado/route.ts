import { kv } from "@vercel/kv";
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
      tlaloque_id,
      pulses,
      used_at: new Date(used_at).toISOString(),
      id,
      updated_at: now,
      created_at: now,
    };

    // Store in KV
    const key = `sscap:utilizado:${now}:${id}`;
    await kv.set(key, record);

    return NextResponse.json(
      { utilizado: record },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "utilizado_not_saved" },
      { status: 400 }
    );
  }
}
