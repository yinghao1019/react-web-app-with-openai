import openai from "@/services/openai";

export async function POST(req) {
  const body = await req.json();
  console.log("body:", body);

  const { base64 } = body;
  // TODO: 透過base64讓AI辨識圖片
  // 文件連結：https://platform.openai.com/docs/guides/vision?lang=node
  const systemPrompt = `告訴我這張圖片有甚麼`;
  const propmpt = base64;

  const openAIReqBody = {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "圖片裡有甚麼?請用繁體中文回答",
          },
          {
            type: "image_url",
            image_url: { url: base64 },
          },
        ],
      },
    ],
    model: "gpt-4o-mini",
  };
  const completion = await openai.chat.completions.create(openAIReqBody);
  const aiText = completion.choices[0].message.content;
  console.log("completion:", aiText);

  return Response.json({ message: "Success", aiText });
}
