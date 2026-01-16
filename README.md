# オセロ (Othello.js)

ブラウザで遊べるシンプルなオセロ（リバーシ）ゲームです。

![Othello Game](https://img.shields.io/badge/Game-Othello-green)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## デモ

`index.html`をブラウザで開くだけでプレイできます。

## 特徴

- **シンプル**: 外部ライブラリ不要、バニラJavaScriptのみ
- **軽量**: バックエンド不要、クライアントサイドのみで動作
- **クラシック**: 標準的な8x8オセロルールを完全実装

## 遊び方

1. 黒が先手でゲーム開始
2. 盤面をクリックして石を置く
3. 相手の石を挟むとひっくり返る
4. 置ける場所がない場合は自動でパス
5. 盤面が埋まるか、両者とも置けなくなったらゲーム終了
6. 「やり直す」ボタンでリスタート

## インストール & 実行

```bash
# リポジトリをクローン
git clone https://github.com/your-username/othello.js.git
cd othello.js

# ブラウザで直接開く
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# または簡易サーバーを使用
python -m http.server 8000
# http://localhost:8000 にアクセス
```

## プロジェクト構成

```
othello.js/
├── index.html          # エントリーポイント
├── public/
│   ├── css/
│   │   └── main.css    # スタイルシート
│   └── js/
│       └── main.js     # ゲームロジック
├── CLAUDE.md           # AI開発ガイド
└── README.md           # このファイル
```

## 技術仕様

| 項目 | 詳細 |
|------|------|
| 描画 | HTML5 Canvas |
| 盤面サイズ | 8x8 (64マス) |
| マスサイズ | 48x48 ピクセル |
| 石の半径 | 16 ピクセル |

## ゲームルール

- 標準的なオセロ/リバーシのルールに準拠
- 8方向（縦・横・斜め）で相手の石を挟むとひっくり返せる
- 有効な手がない場合は自動的にパス
- 石の数が多い方が勝利

## 開発

### 主要コンポーネント

- **`turn`**: 手番管理オブジェクト
- **`initBoard()`**: 盤面の初期化とゲームロジック
- **`onClick()`**: クリックイベントハンドラ

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## ライセンス

MIT License

## 作者

hiyamamo
