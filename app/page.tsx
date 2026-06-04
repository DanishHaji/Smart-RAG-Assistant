"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const sendMessage = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setResponse(data.response);
  };

  const uploadPdf = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/ingest", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("PDF Result:", data);
    alert(`PDF Processed! Chunks: ${data.chunksCount}`);
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        AI RAG Assistant
      </h1>

      {/* PDF Upload */}
      <div className="mb-6">
        <input
          type="file"
          aria-label="Upload PDF file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
          className="border p-2"
        />

        <button
          onClick={uploadPdf}
          className="border px-4 py-2 ml-2 cursor-pointer"
        >
          Upload PDF
        </button>
      </div>

      {/* Chat Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        className="border p-2 w-full"
      />

      <button
        onClick={sendMessage}
        className="border px-4 py-2 mt-4 cursor-pointer"
      >
        Send
      </button>

      <div className="mt-6">
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </main>
  );
}