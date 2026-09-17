import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { storeFile } from "@/lib/storage";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authorized." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "No file received." }, { status: 400 });

  try {
    const stored = await storeFile(file);
    return NextResponse.json({ url: stored.url, provider: stored.provider });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export const runtime = "nodejs";
