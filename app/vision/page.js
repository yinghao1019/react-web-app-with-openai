"use client";

import { useState } from "react";
import axios from "axios";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function Vision() {
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState("");
  const changeHandler = (e) => {
    e.preventDefault();
    // get user upload file
    // 取得使用者上傳的檔案
    // 取得使用者上傳的檔案
    const file = e.target.files[0];
    // 建立FileReader物件來讀取檔案
    const reader = new FileReader();
    // 設定預覽圖片的URL,使用URL.createObjectURL產生一個暫時的URL
    setAiImageUrl(URL.createObjectURL(file));
    setAiText("辨識中...");
    reader.onload = () => {
      const base64Image = reader.result;
      
      // invoke api
      axios
        .post("/api/vision-ai", { base64: base64Image })
        .then((res) => {
          setAiText(res.data.aiText);
        })
        .catch((err) => {
          alert("ai image vision error...");
        });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <CurrentFileIndicator filePath="/app/vision/page.js" />
      <PageHeader title="AI Vision" icon={faEye} />
      <section>
        <div className="container mx-auto">
          <label
            htmlFor="imageUploader"
            className="inline-block bg-indigo-500 active:bg-indigo-600 px-4 py-2 text-white rounded-md"
          >
            Upload Image
          </label>
          <input
            id="imageUploader"
            type="file"
            className="hidden"
            onChange={changeHandler}
            accept=".jpg, .jpeg, .png"
          />
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* TODO: 顯示AI輸出結果 */}
          {aiImageUrl && (
            <image src={aiImageUrl} className="w-72 my-3" alt="使用者上傳" />
          )}

          <h1 className="text-2xl mt-4 font-bold">{aiText}</h1>
        </div>
      </section>
    </>
  );
}
