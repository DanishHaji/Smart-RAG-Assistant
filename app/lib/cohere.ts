import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!, // FIX: use 'token' instead of 'apiKey'
});

export async function embedText(chunks: string[]) {
  const response = await cohere.embed({
    texts: chunks,
    model: "embed-multilingual-v3.0",
  });

  return response.embeddings;
}
