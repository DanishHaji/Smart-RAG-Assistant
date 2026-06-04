"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

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

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        AI RAG Assistant
      </h1>

      <input
        type="text , file"
        accept=".pdf"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        className="border p-2 w-full"
      />

      <button
        onClick={sendMessage}
        className="border px-4 py-2 mt-4"
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