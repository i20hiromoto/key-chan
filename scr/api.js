"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_session_1 = require("express-session");
var cookie_parser_1 = require("cookie-parser");
var fs_1 = require("fs");
var path_1 = require("path");
var app = (0, express_1.default)();
var port = 3001;
// JSONファイルからユーザーデータを読み込む
var userDataFilePath = path_1.default.join(__dirname, 'data', 'userdata.json');
var userData = [];
try {
    var userDataJson = fs_1.default.readFileSync(userDataFilePath, 'utf-8');
    userData = JSON.parse(userDataJson);
}
catch (err) {
    console.error('Error loading user data:', err);
}
// Expressのミドルウェアの設定
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'Souzouensyuu', // セッションIDの署名に使用する秘密鍵
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPSを使用する場合はtrueに設定
}));
// ログインAPIの実装
app.post('/login', function (req, res) {
    var _a = req.body, username = _a.username, s_number = _a.s_number, password = _a.password;
    // ユーザーを検索
    var user = userData.find(function (user) { return user.username === username && user.password === password && user.s_number === s_number; });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username, student number, or password' });
    }
    // セッションにユーザー情報を保存（セッションオブジェクトに直接ユーザー情報をセットする）
    req.session.user = { id: user.id, username: user.username, s_number: user.s_number };
    // クッキーにユーザー名を保存
    res.cookie('username', user.username, { httpOnly: true });
    res.json({ message: 'Login successful', user: user });
});
// ログアウトAPIの実装
app.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('username');
        res.json({ message: 'Logout successful' });
    });
});
// 未借用の部屋データを取得するAPI
app.get('/api/get/dontborrowed', function (req, res) {
    try {
        // roomdata.jsonを読み込む
        var roomData = JSON.parse(fs_1.default.readFileSync('data/roomdata.json', 'utf-8'));
        // statusがfalseのデータのみフィルタリングする
        var filteredRoomData = roomData.filter(function (data) { return !data.status; });
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
        var roomData = JSON.parse(fs_1.default.readFileSync('data/roomdata.json', 'utf-8'));
        // フィルタリングなしで全データをクライアントに送信する
        res.json(roomData);
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
    console.log("Server is running on port ${port}");
});
