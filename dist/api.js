"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var port = 3001;
app.use(bodyParser.json());
// JSONファイルからユーザーデータを読み込む
var userDataFilePath = "data/userdata.json";
var roomDataFilePath = "data/roomdata.json";
var userData = [];
var roomData = [];
try {
    var userDataJson = fs.readFileSync(userDataFilePath, 'utf-8');
    var roomDataJson = fs.readFileSync(roomDataFilePath, 'utf-8');
    userData = JSON.parse(userDataJson);
    roomData = JSON.parse(roomDataJson);
}
catch (err) {
    console.error('Error loading user data:', err);
}
// Expressのミドルウェアの設定
app.use(cors());
app.use(express.json());
// app.use(cookieParser());
// app.use(session({
//   secret: 'Souzouensyuu', // セッションIDの署名に使用する秘密鍵
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false}
//   } // HTTPSを使用する場合はtrueに設定
// ));
// ログインAPIの実装
app.post('/login', function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password;
    // ユーザーを検索
    var user = userData.find(function (user) { return user.username === username && user.password === password; });
    if (user) {
        res.json({ message: 'Login successful', user: user });
    }
    if (!user) {
        return res.status(401).json({ message: 'Invalid username, student number, or password' });
    }
});
app.post('/api/rent/room', function (req, res) {
    var rm = roomData.find(function (rm) { return rm.name === req.body.name; });
    var rmIndex = roomData.findIndex(function (rm) { return rm.name === req.body.name; });
    if (!rm) {
        return res.status(404).json({ message: 'Room not found' });
    }
    if (req.body) {
        roomData[rmIndex].status = true;
        var studentData = JSON.parse(req.body.student);
        var username = studentData.username;
        roomData[rmIndex].student = username;
    }
    fs.writeFile('data/roomdata.json', JSON.stringify(roomData, null, 2), function (err) {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Status updated successfully', room: rm });
    });
});
function findIndicesByCondition(array, condition) {
    return array.map(function (item, index) { return condition(item) ? index : -1; }).filter(function (index) { return index !== -1; });
}
app.post('/api/back/room', function (req, res) {
    var user = JSON.parse(req.body.student);
    var rm = roomData.filter(function (rm) { return rm.student === user.username; });
    var indics = findIndicesByCondition(roomData, function (rm) { return rm.student === user.username; });
    if (!rm) {
        return res.status(404).json({ message: 'Room not found' });
    }
    if (req.body) {
        for (var i = 0; i < indics.length; i++) {
            roomData[indics[i]].status = false;
            roomData[indics[i]].student = "";
        }
    }
    fs.writeFile('data/roomdata.json', JSON.stringify(roomData, null, 2), function (err) {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Status updated successfully', room: rm });
    });
});
// 未借用の部屋データを取得するAPI
app.get('/api/get/dontborrowed', function (req, res) {
    try {
        // roomdata.jsonを読み込む
        var roomData_1 = JSON.parse(fs.readFileSync('data/roomdata.json', 'utf-8'));
        // statusがfalseのデータのみフィルタリングする
        var filteredRoomData = roomData_1.filter(function (data) { return !data.status; });
        // フィルタリングされたデータをクライアントに送信する
        res.json(filteredRoomData);
    }
    catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// 全部屋データを取得するAPI
app.get('/api/get/all', function (req, res) {
    try {
        // roomdata.jsonを読み込む
        var roomData_2 = JSON.parse(fs.readFileSync('data/roomdata.json', 'utf-8'));
        // フィルタリングなしで全データをクライアントに送信する
        res.json(roomData_2);
    }
    catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// 認証ミドルウェアの実装
var isAuthenticated = function (req, res, next) {
    // セッションからユーザー情報を取得
    var user = req.session.user;
    if (user) {
        // リクエストオブジェクトにユーザー情報をセット
        req.user = user;
        next(); // 認証された場合は次のミドルウェアに進む
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
// 認証が必要なAPIエンドポイントの例（プロフィール取得）
app.get('/profile', isAuthenticated, function (req, res) {
    // req.userを使用して認証されたユーザーのプロフィールを返す
    res.json({ id: req.user.id, username: req.user.username });
});
// サーバーの起動
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
