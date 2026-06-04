import { NextResponse } from "next/server";
import { openrouter } from "../../lib/openrouter";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const complete = await openrouter.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      response: complete.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in chat completion:", error);

    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      {
        status: 500,
      }
    );
  }
}