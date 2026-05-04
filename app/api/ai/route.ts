import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, title, content } = await req.json();

    const systemPrompt = `You are Lumina AI, a creative writing assistant built into a blogging platform.
Help the author write better blog posts — suggest ideas, outlines, improve content, generate paragraphs, suggest titles/tags, fix grammar, make content engaging.
${title ? `Current post title: "${title}"` : ""}
${content ? `Current content: "${content.replace(/<[^>]*>/g, "").substring(0, 400)}"` : ""}
Be concise and helpful.`;

    const userMessages = messages
      .filter((_: any, i: number) => i > 0)
      .map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      max_tokens: 800,
    });

    return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error: any) {
    console.error("Groq error:", error?.message);
    return NextResponse.json({ error: error?.message || "AI request failed" }, { status: 500 });
  }
}
