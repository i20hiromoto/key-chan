import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import axios from "axios";
import Title from "./title";
import { Card, CardFooter } from "@/components/ui/card";
import { PythonShell } from "python-shell";

interface User {
  username: string;
  password: number;
}

function hiraganaToKatakana(hiragana: string): string {
  return hiragana.replace(/[\u3041-\u3096]/g, function (match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

type KanaMap = {
  [key: string]: string;
};

function toFullWidth(input: string): string {
  const kanaMap: KanaMap = {
    ｶﾞ: "ガ",
    ｷﾞ: "ギ",
    ｸﾞ: "グ",
    ｹﾞ: "ゲ",
    ｺﾞ: "ゴ",
    ｻﾞ: "ザ",
    ｼﾞ: "ジ",
    ｽﾞ: "ズ",
    ｾﾞ: "ゼ",
    ｿﾞ: "ゾ",
    ﾀﾞ: "ダ",
    ﾁﾞ: "ヂ",
    ﾂﾞ: "ヅ",
    ﾃﾞ: "デ",
    ﾄﾞ: "ド",
    ﾊﾞ: "バ",
    ﾋﾞ: "ビ",
    ﾌﾞ: "ブ",
    ﾍﾞ: "ベ",
    ﾎﾞ: "ボ",
    ﾊﾟ: "パ",
    ﾋﾟ: "ピ",
    ﾌﾟ: "プ",
    ﾍﾟ: "ペ",
    ﾎﾟ: "ポ",
    ｳﾞ: "ヴ",
    ﾜﾞ: "ヷ",
    ｦﾞ: "ヺ",
    ｱ: "ア",
    ｲ: "イ",
    ｳ: "ウ",
    ｴ: "エ",
    ｵ: "オ",
    ｶ: "カ",
    ｷ: "キ",
    ｸ: "ク",
    ｹ: "ケ",
    ｺ: "コ",
    ｻ: "サ",
    ｼ: "シ",
    ｽ: "ス",
    ｾ: "セ",
    ｿ: "ソ",
    ﾀ: "タ",
    ﾁ: "チ",
    ﾂ: "ツ",
    ﾃ: "テ",
    ﾄ: "ト",
    ﾅ: "ナ",
    ﾆ: "ニ",
    ﾇ: "ヌ",
    ﾈ: "ネ",
    ﾉ: "ノ",
    ﾊ: "ハ",
    ﾋ: "ヒ",
    ﾌ: "フ",
    ﾍ: "ヘ",
    ﾎ: "ホ",
    ﾏ: "マ",
    ﾐ: "ミ",
    ﾑ: "ム",
    ﾒ: "メ",
    ﾓ: "モ",
    ﾔ: "ヤ",
    ﾕ: "ユ",
    ﾖ: "ヨ",
    ﾗ: "ラ",
    ﾘ: "リ",
    ﾙ: "ル",
    ﾚ: "レ",
    ﾛ: "ロ",
    ﾜ: "ワ",
    ｦ: "ヲ",
    ﾝ: "ン",
    ｧ: "ァ",
    ｨ: "ィ",
    ｩ: "ゥ",
    ｪ: "ェ",
    ｫ: "ォ",
    ｯ: "ッ",
    ｬ: "ャ",
    ｭ: "ュ",
    ｮ: "ョ",
    "｡": "。",
    "､": "、",
    ｰ: "ー",
    "｢": "「",
    "｣": "」",
    "･": "・",
  };

  const reg = new RegExp("(" + Object.keys(kanaMap).join("|") + ")", "g");
  return input
    .replace(reg, function (match) {
      return kanaMap[match];
    })
    .replace(/ﾞ/g, "゛")
    .replace(/ﾟ/g, "゜");
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLabel, setButtonLabel] = useState("ICカード読み込み");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防止
    try {
      const response = await axios.post(
        "https://keychanbackend-production.up.railway.app/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const user: User = {
          username: response.data.user.username,
          password: response.data.user.password,
        };
        sessionStorage.setItem("user", JSON.stringify(user)); // ログイン情報をセッションストレージに保存

        router.push("/select"); // ログイン成功時にページ遷移
      } else {
        console.error("Login failed:", response.data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const signUp = () => {
    router.push("/signup");
  };

  const readIC = async () => {
    setButtonLabel("読み込み中...");
    try {
      const response = await axios.get(
        "https://keychanbackend-production.up.railway.app/api/callpy",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        const output = JSON.stringify(response.data.output).replace(/"/g, "");
        const output2 = output.replace(/'/g, '"');
        const data = JSON.parse(output2);
        const obj = data[0];
        const name = obj.name.replace(/ /g, "");

        // zenkaku関数を非同期に呼び出し、その結果を待ってセットする
        const convertedName = toFullWidth(name);
        setUsername(convertedName);
        setPassword(obj.student_id);
      }
    } catch (error) {
      console.error("An error occurred during IC reading:", error);
      alert("IC読み取り中にエラーが発生しました。再試行してください。");
    } finally {
      setButtonLabel("ICカード読み込み");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="w-full max-w-md mt-4">
        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 gap-1">
            <Label style={{ fontSize: "30px" }}>ログイン</Label>
            <br />
            <Label style={{ fontSize: "15px" }}>名前と学籍番号を入力</Label>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username"> 名前（カタカナ）</Label>
            <Input
              id="username"
              placeholder="例 : トクヤマタロウ"
              type="text"
              value={username}
              onChange={(e) => setUsername(hiraganaToKatakana(e.target.value))}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">学籍番号</Label>
            <Input
              id="password"
              placeholder="例 : 10001"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <CardFooter className="flex justify-between">
            <Button type="submit" className="w-[100px]">
              ログイン
            </Button>
            <Button type="button" className="w-[100px]" onClick={signUp}>
              新規登録
            </Button>
          </CardFooter>
        </div>
        <div>
          <CardFooter className="flex justify-between">
            <Button type="button" className="w-[150px]" onClick={readIC}>
              {buttonLabel}
            </Button>
          </CardFooter>
        </div>
      </form>
      <Title />
    </div>
  );
};

export default LoginPage;
