import pdfParse from "pdf-parse";

export async function extractTextFromPDF(file: Buffer) {
  const data = await pdfParse(file);

  return data.text;
}