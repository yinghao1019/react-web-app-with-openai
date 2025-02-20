import db from "@/services/db";
import openai from "@/services/openai";
import axios from "axios";

const collectionName = "image-ai";

export async function POST(req) {
  const body = await req.json();
  console.log("body:", body);

  const { word, language } = body;
  const systemPrompt = `請使用指定語言根據指定單字產生例句，以及中文繁體意思
  輸入範例:
  word: apple
  language: English

  輸出Json 範例:
  {
  sentence: "I like eat apple",
  zhSentence:"我喜歡吃蘋果"
  }
  `;

  const userPrompt = `
  word: ${word}
  language: ${language}`;

  const openAIReqBody = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  };

  const completion = await openai.chat.completions.create(openAIReqBody);

  const data = JSON.parse(completion.choices[0].message.content);
  console.log("response", data);
  // 使用text to speech取得音訊檔
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: data.sentence,
  });
  //  轉base64
  const buffer = Buffer.from(await mp3.arrayBuffer());
  const base64 = buffer.toString("base64");

  data.base64 = base64;
  return Response.json(data);
}
