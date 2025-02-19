"use client";

import { useState ,useEffect} from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    const [imageList, setImageList] = useState([]);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        // 將body POST到 /api/image-ai { userInput: "" }
        setIsWaiting(true);
        setUserInput("");

        axios.post("/api/image-ai", body).then(res => {
            setIsWaiting(false);
            // 更新image list 狀態
            setImageList([res.data, ...imageList]);
        }).catch(err => {
            setIsWaiting(false);
            console.log(err);
            alert("generate image error,please try again or contact developer");
        })
    }

    useEffect(() => {
        axios.get("/api/image-ai").then(res => {
          console.log(res.data);
          setImageList(res.data);
        }).catch(err => {
          console.log("error", err);
          alert("get image data error.please contact developer.");
        })
      }, [])

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>

            </section>
            <section>
                <div className="container mx-auto pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
                    {/* 顯示AI輸出結果 */}
                    {isWaiting && <ImageGenPlaceholder />}
                    {imageList.map(result => {
                        const { imageUrl, prompt, createdAt } = result;
                        return (<ImageGenCard imageURL={imageUrl} prompt={prompt} key={createdAt} />)
                    })}
                </div>
            </section>
        </>
    )
}