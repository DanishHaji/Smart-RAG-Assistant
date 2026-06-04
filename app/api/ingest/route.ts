import { NextResponse } from "next/server";
import { extractTextFromPDF } from "../../lib/pdf";
import { splitText } from "../../utils/text-splitter";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const text = await extractTextFromPDF(buffer);

    const chunks = splitText(text);

    return NextResponse.json({
      textLength: text.length,
      chunksCount: chunks.length,
      chunks,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}