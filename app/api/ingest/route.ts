// app/api/ingest/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { splitText } from "../../utils/text-splitter";
import { embedText } from "../../lib/cohere";

// CommonJS import
const pdfParse = require("pdf-parse");

export async function POST(req: Request) {
  try {
    const { fileBuffer } = await req.json();
    const pdfData = await pdfParse(Buffer.from(fileBuffer));
    const text = pdfData.text;

    const chunks: string[] = splitText(text);
    const embeddings = (await embedText(chunks)) as number[][];

    const filePath = path.join(process.cwd(), "data", "embeddings.json");
    const data = chunks.map((chunk: string, i: number) => ({
      id: `chunk-${i}`,
      text: chunk,
      embedding: embeddings[i],
    }));

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, count: chunks.length });
  } catch (error) {
    console.error("Error in ingest:", error);
    return NextResponse.json({ error: "Failed to ingest document" }, { status: 500 });
  }
}
