import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { embedText } from "../../lib/cohere";

// Cosine similarity with explicit types
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // Step 1: Query embedding (force cast to number[][])
    const queryEmbedding = (await embedText([query])) as number[][];
    const vector = queryEmbedding[0];

    // Step 2: Load embeddings.json
    const filePath = path.join(process.cwd(), "data", "embeddings.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const allData: { id: string; text: string; embedding: number[] }[] = JSON.parse(raw);

    // Step 3: Similarity search
    const scored = allData.map((item) => ({
      ...item,
      score: cosineSimilarity(vector, item.embedding),
    }));

    const topChunks = scored.sort((a, b) => b.score - a.score).slice(0, 3);

    return NextResponse.json({ relevant: topChunks });
  } catch (error) {
    console.error("Error in embd:", error);
    return NextResponse.json({ error: "Failed to retrieve embeddings" }, { status: 500 });
  }
}
