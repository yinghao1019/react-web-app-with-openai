import openai from "@/services/openai";
import db from "@/services/db";

export async function GET(req) {
  const docList = await db
    .collection("vocab-ai")
    .orderBy("createdAt", "desc")
    .get();
  const vocabList = [];

  docList.forEach((doc) => {
    vocabList.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  return Response.json(vocabList);
}

export async function POST(req) {
  const body = await req.json();
  console.log("body:", body);
  const { userInput, language } = body;
  // 透過gpt-4o-mini模型讓AI回傳相關單字
  // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
  // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
  const systemPrompt = `請作為一個單字聯想，根據所提供的主題聯想5個相關單字
    ，與五個對應的繁體中文翻譯。
    #輸入範例:
    主題: 水果,
    語言: English
    
    #輸出Json 範例:{
    wordList: ["Apple","Banana","Cherry","Date","Elderberry"],
    zhWordList: ["蘋果","香蕉","櫻桃","棗子","接骨木"]
    }`;
  const userPrompt = `
    主題: ${userInput}
    語言: ${language}`;

  const openAIReqBody = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
  };
  // TODO: 待優化 edge case handling
  const completion = await openai.chat.completions.create(openAIReqBody);
  const payload = completion.choices[0].message.content;
  console.log("payload:", payload);

  const result = {
    title: userInput,
    payload: JSON.parse(payload),
    language,
    createdAt: Date.now(),
  };

  await db.collection("vocab-ai").add(result);
  return Response.json(result);
}
