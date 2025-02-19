import db from "@/services/db";
import openai from "@/services/openai";
import axios from "axios";

const collectionName = "image-ai";

export async function GET(req) {
  const docList=await db.collection(collectionName).orderBy("createdAt","desc").get();
  const imageList=[];
  docList.forEach(doc=>{
    imageList.push(doc.data());
  })

  return Response.json(imageList);
}

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

  const aiImageUrl = response.data[0].url;
  console.log("ai gen image url:", aiImageUrl);

  const imgurImageUrl = await uploadToImgur(aiImageUrl);
  const result = {
    prompt: body.userInput,
    imageUrl: imgurImageUrl,
    createdAt: Date.now(),
  };

  await db.collection(collectionName).add(result);
  return Response.json(result);
}

async function uploadToImgur(imageUrl) {
  // 從環境變數獲取 Imgur Client ID
  const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;
  process.env.IMGUR_CLIENT_ID;

  // 上傳至 Imgur
  const response = await axios.post(
    "https://api.imgur.com/3/image",
    {
      image: imageUrl,
      type: "url",
    },
    {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
    }
  );
  console.log(response);

  // get imagur url link
  const imgurUrl = response.data.data.link;
  console.log("image url:圖片連結:" + imgurUrl);
  return imgurUrl;
}
