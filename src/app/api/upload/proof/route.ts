import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = "payment-proofs";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  const bookingId = formData.get("bookingId");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (!bookingId || typeof bookingId !== "string") {
    return NextResponse.json({ error: "bookingId requerido" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Solo se permiten imágenes (JPG, PNG, WEBP) o PDF" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "El archivo no puede superar 5 MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${bookingId}/${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[upload/proof]", error);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
