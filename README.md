# 線上浮水印產生器

一個簡單易用的線上浮水印產生器，使用 React + Vite + Tailwind CSS 建立。支援即時預覽、自訂浮水印樣式，並可下載加上浮水印的圖片。

## 功能特色

- 🖼️ **拖放上傳** - 支援拖放或點擊上傳圖片
- ✏️ **自訂浮水印文字** - 可輸入任意文字作為浮水印
- 🎨 **顏色選擇** - 自訂浮水印文字顏色
- 📊 **密度調整** - 控制浮水印的疏密程度
- 📏 **大小調整** - 調整浮水印文字大小
- 🔍 **透明度控制** - 調整浮水印透明度
- 🔄 **旋轉角度** - 設定浮水印旋轉角度
- 👁️ **即時預覽** - 所有調整即時顯示在預覽區
- 💾 **一鍵下載** - 將處理後的圖片下載為 PNG 格式

## 技術棧

- **React 19** - UI 框架
- **Vite 7** - 建置工具
- **Tailwind CSS 4** - 樣式框架
- **TypeScript** - 型別檢查
- **Lucide React** - 圖示庫

## 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝

```bash
# 複製專案
git clone https://github.com/your-username/hkt-image-watermark.git

# 進入專案目錄
cd hkt-image-watermark

# 安裝相依套件
npm install
```

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 部署到 GitHub Pages

### 方法一：使用 gh-pages 套件（推薦）

1. 更新 `package.json` 中的 `homepage` 欄位，將 `your-username` 改為你的 GitHub 帳號：
   ```json
   "homepage": "https://your-username.github.io/hkt-image-watermark"
   ```

2. 執行部署指令：
   ```bash
   npm run deploy
   ```

3. 在 GitHub 專案設定中，前往 Settings > Pages，確認 Source 設定為 `gh-pages` 分支。

## 使用說明

1. **上傳圖片** - 點擊或拖放圖片到上傳區域
2. **輸入浮水印文字** - 在右側設定面板輸入想要的浮水印文字
3. **調整樣式** - 使用滑桿調整密度、大小、透明度和旋轉角度
4. **選擇顏色** - 使用顏色選擇器設定浮水印顏色
5. **下載圖片** - 點擊「下載圖片」按鈕儲存處理後的圖片

## 專案結構

```
hkt-image-watermark/
├── src/
│   ├── App.tsx          # 主要應用元件
│   ├── main.tsx         # 應用入口
│   ├── index.css        # 全域樣式
│   └── utils/
│       └── cn.ts        # class 合併工具
├── index.html           # HTML 模板
├── package.json         # 專案設定
├── tsconfig.json        # TypeScript 設定
└── vite.config.ts       # Vite 設定
```

## 授權

MIT License

## 作者

HKT
