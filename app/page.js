"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);

  const languageList = ["English", "Japanese", "Korean", "Spanish", "French", "German", "Italian"];
  // useEffect (函式,陣列)
  // 陣列內值有變化時，就會執行函式
  // 陣列如果是空陣列, 就只會執行一次

  useEffect(() => {
    axios.get("/api/vocab-ai").then(res => {
      console.log(res.data);
      setVocabList(res.data);
    }).catch(err => {
      console.log("error", err);
      alert("get vocab data error.please contact developer.");
    })
  }, [])

  const submitHandler = (e) => {
    e.preventDefault();
    const body = { userInput, language };
    console.log("body:", body);

    setUserInput("");
    setIsWaiting(true);

    axios.post("/api/vocab-ai", body).then(res => {
      setIsWaiting(false);
      const result = res.data
      console.log('response data', result);
      setVocabList([result, ...vocabList]);
    }
    ).catch(err => {
      setIsWaiting(false);
      alert("has unknow error ,please try again");
    });
  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
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
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  {
                    languageList.map(language => <option key={language} value={language}>{language}</option>)
                  }
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* 顯示AI輸出結果 */}
          {vocabList.map(vocab => <VocabGenResultCard key={vocab.id} result={vocab} />)}
        </div>
      </section>
    </>
  );
}
