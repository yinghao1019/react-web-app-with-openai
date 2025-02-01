import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    // TODO: 透過dall-e-3模型讓AI產生圖片
    // 文件連結: https://platform.openai.com/docs/guides/images/usage
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: body.userInput,
        n: 1,
        size: "1024x1024",
      });

      const aiImageUrl=response.data[0].url;
      console.log("ai gen image url:",aiImageUrl);

      const result = {
        prompt: body.userInput,
        imageUrl: aiImageUrl,
        createdAt: Date.now()
    }
    return Response.json(result);
}