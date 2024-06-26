import express from 'express';
import { Request, Response } from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(bodyParser.json());
declare module 'express-session' {
  interface SessionData {
    user:{id: number;
          username: string;
          s_number: number;
          password: string;
        }
}
}

// JSONファイルからユーザーデータを読み込む
const userDataFilePath = "data/userdata.json";
const roomDataFilePath = "data/roomdata.json"; 
let userData: { id: number; username: string; s_number: number; password: string }[] = [];
let roomData: { id: number; name: string; status: boolean; student: string }[] = [];
try {
  const userDataJson = fs.readFileSync(userDataFilePath, 'utf-8');
  const roomDataJson = fs.readFileSync(roomDataFilePath, 'utf-8');
  userData = JSON.parse(userDataJson);
  roomData = JSON.parse(roomDataJson);
} catch (err) {
  console.error('Error loading user data:', err);
}

// Expressのミドルウェアの設定
app.use(cors());
app.use(express.json());

// ログインAPIの実装
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // ユーザーを検索
  const user = userData.find(user => user.username === username && user.password === password);

  if(user){
    res.json({ message: 'Login successful', user });
  }
  if (!user) {
    return res.status(401).json({ message: 'Invalid username, student number, or password' });
  }

});

// ログアウトAPIの実装
// app.post('/logout', (req: Request, res: Response) => {
//   req.session.destroy(err => {
//     if (err) {
//       return res.status(500).json({ message: 'Logout failed' });
//     }
//     res.json({ message: 'Logout successful' });
//   });
// });

interface RoomData {
  id: number;
  name: string;
  status: boolean;
  student: number;
}
interface StudentData {
  id: number;
  username: string;
  s_number: number;
  password: string;
}

app.post('/api/rent/room', (req: Request, res: Response) => {
  const rm = roomData.find(rm => rm.name === req.body.name);
  const rmIndex = roomData.findIndex(rm => rm.name === req.body.name);
  if (!rm) {
    return res.status(404).json({ message: 'Room not found' });
}
if(req.body){
    roomData[rmIndex].status = true; 
      const studentData = JSON.parse(req.body.student);
      const username = studentData.username;
      roomData[rmIndex].student = username;
    }
  
  fs.writeFile('data/roomdata.json', JSON.stringify(roomData, null, 2), err => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  res.json({ message: 'Status updated successfully', room: rm });
  });
});

function findIndicesByCondition(array: any[], condition: (item: any) => boolean): number[] {
  return array.map((item, index) => condition(item) ? index : -1).filter(index => index !== -1);
}

app.post('/api/back/room', (req: Request, res: Response) => {
  const user:StudentData = JSON.parse(req.body.student);
  const rm = roomData.filter(rm => rm.student === user.username);
  const indics = findIndicesByCondition(roomData, rm => rm.student === user.username);
  if (!rm) {
    return res.status(404).json({ message: 'Room not found' });
  }
  if(req.body){
    for(let i = 0; i < indics.length; i++){
    roomData[indics[i]].status = false; 
    roomData[indics[i]].student = "";
    }
  }
  fs.writeFile('data/roomdata.json', JSON.stringify(roomData, null, 2), err => {
    if (err) {
      console.error('Error writing JSON file:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  res.json({ message: 'Status updated successfully', room: rm });
  });
});

// 未借用の部屋データを取得するAPI
app.get('/api/get/dontborrowed', (req: Request, res: Response) => {
  try {
    // roomdata.jsonを読み込む
    const roomData: RoomData[] = JSON.parse(fs.readFileSync('data/roomdata.json', 'utf-8'));
    
    // statusがfalseのデータのみフィルタリングする
    const filteredRoomData = roomData.filter(data => !data.status);
    
    // フィルタリングされたデータをクライアントに送信する
    res.json(filteredRoomData);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 全部屋データを取得するAPI
app.get('/api/get/all', (req: Request, res: Response) => {
  try {
    // roomdata.jsonを読み込む
    const roomData: RoomData[] = JSON.parse(fs.readFileSync('data/roomdata.json', 'utf-8'));
    
    // フィルタリングなしで全データをクライアントに送信する
    res.json(roomData);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 認証ミドルウェアの実装
const isAuthenticated = (req: Request, res: Response, next: () => void) => {
  // セッションからユーザー情報を取得
  const user = req.session.user as { id: number; username: string; s_number: number } | undefined;

  if (user) {
    // リクエストオブジェクトにユーザー情報をセット
    (req as any).user = user;
    next(); // 認証された場合は次のミドルウェアに進む
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// 認証が必要なAPIエンドポイントの例（プロフィール取得）
app.get('/profile', isAuthenticated, (req: Request, res: Response) => {
  // req.userを使用して認証されたユーザーのプロフィールを返す
  res.json({ id: (req as any).user.id, username: (req as any).user.username });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});