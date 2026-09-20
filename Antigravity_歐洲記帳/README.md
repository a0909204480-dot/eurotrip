# 🇪🇺 歐陸壯遊 40 天多幣別旅行記帳本 (EuroTrip Ledger SPA)

專為前往歐洲進行 40 天深度漫遊的旅客與國際小隊打造的 **高顏值、響應式、全繁體中文、免維護且具備雲端持久化同步** 的單頁 Web 應用程式 (SPA)。

---

## 🌟 核心特色一覽

1. **公有雲持久化 (Public Cloud Persistence - 永不遺失資料)**：
   - 支援 **Supabase (推薦，PostgreSQL 實時同步)** 與 **Google 試算表 (Google Apps Script Web API)** 雙軌免費後端。
   - 跨國多位隊友可同時在不同手機與筆電上記帳、查帳。
   - 內建 **離線優先 (Offline-First)** 隊列與 LocalStorage 快取，地鐵或阿爾卑斯山無訊號時仍可流暢記帳，連網時自動背景補傳。
2. **多幣別即時匯率換算 (Real-Time Currency Engine)**：
   - 即時串接開放匯率 API（支援 EUR 歐元、CHF 瑞士法郎、USD 美元、CZK 捷克克朗、GBP 英鎊、PLN 波蘭茲羅提、HUF 匈牙利福林 等換算為 TWD 新台幣）。
   - 支援手動自訂匯率覆蓋（例如設定信用卡出帳匯率或現金換匯成本）。
   - 即時計算公式：`折合 TWD = 外幣金額 * 匯率`，自動四捨五入並美化千分位。
3. **多幣別旅行支出帳本 (Ledger & Analytics)**：
   - 欄位完整：日期、行程天數 (Day 1~40)、消費類別、外幣金額、折合台幣、支付方式（海外3%回饋卡、現金等）、分帳模式、城市地點、備註。
   - 儀表板 KPI 指標：總預算 vs 總支出進度條、剩餘可用預算、每日平均花費、40 天動態每日安全額度。
   - 互動圖表：類別佔比圓餅圖 (Chart.js) 與每日花費走勢長條圖。
   - 一鍵匯出 **UTF-8 BOM CSV**（Excel 開啟繁體中文絕無亂碼）及 JSON 完整備份/還原。
4. **歐洲 40 天深度行程攻略整合**：
   - **節奏與體力預警 (Pacing Notice)**：Day 1–9 葡西高強度（波多至馬德里跨國夜巴體力復原、馬德里與巴塞隆納每日 20,000+ 步健走負擔）；Day 10–40 法瑞義東歐平穩節奏（巴黎 4 晚、瑞士 4 晚、維也納 4 晚定點深度連住、因特拉肯跳傘 2 天天氣緩衝預留、CK 小鎮門對門 Shuttle 專車）。
   - **早鳥搶票監控清單 (Early Bird Watchlist)**：跨國高鐵 (TGV Lyria, AVE, EuroCity)、歐洲廉航行李額度、聖家堂登塔門票、梵蒂岡博物館早鳥、奧斯威辛集中營官方導覽、因特拉肯阿爾卑斯跳傘，支援一鍵轉記帳與官方訂票連結。
   - **信用卡防雷與 DCC 嚴禁警示**：動態貨幣轉換 (DCC) 5%~10% 防坑指南、海外 3% 信用卡推薦、防扒防割貼身防護。

---

## 🚀 免費雲端部署教學 (Free Hosting Guides)

本專案為標準靜態單頁應用程式 (Pure HTML/CSS/JS SPA)，無須編譯環境，上傳即用！

### 方案 A：部署到 Vercel (最推薦，超快速)
1. 註冊並登入 [Vercel](https://vercel.com/)。
2. 點擊 **Add New Project** -> 選擇連結您的 GitHub 儲存庫，或使用 [Vercel CLI](https://vercel.com/docs/cli) 在專案目錄執行 `vercel`。
3. Framework Preset 保持 **Other**，Root Directory 選擇 `./`。
4. 點擊 **Deploy**，約 10 秒內即可獲得專屬公開 HTTPS 網址（例如 `https://eurotrip-ledger.vercel.app`）。

### 方案 B：部署到 Netlify (支援拖曳上傳)
1. 登入 [Netlify](https://www.netlify.com/)。
2. 進入 **Sites** 頁面，直接將整個專案資料夾拖曳到 Netlify 的 **Drag and drop your site output folder here** 區域。
3. 立即生成全球 CDN 公開網址。

### 方案 C：部署到 Cloudflare Pages
1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/) -> 前往 **Workers & Pages** -> **Create application** -> **Pages**。
2. 選擇 **Direct Upload** (直接上傳資料夾) 或連結 GitHub 倉庫。
3. Build output directory 留空或輸入 `/`，點擊部署即可享受全球最快的 CDN 節點。

### 方案 D：部署到 GitHub Pages (完全免費)
1. 在 GitHub 建立一個公開倉庫並上傳本專案的所有檔案。
2. 進入該倉庫的 **Settings** -> 左側選單 **Pages**。
3. 在 **Build and deployment** 下的 Source 選擇 **Deploy from a branch**，Branch 選擇 `main` / `/ (root)`。
4. 點擊 **Save**，幾分鐘後即可在 `https://<您的帳號>.github.io/<倉庫名稱>/` 存取。

---

## 🗄️ 免費雲端資料庫設定教學 (Database Setup)

您可以在應用程式中隨時點擊右上角的 **⚙️ 雲端設定**，選擇以下兩種免費後端之一：

### 方式一：Supabase (推薦，功能最強大、支援多人即時更新)
1. 前往 [Supabase 官網](https://supabase.com/) 免費註冊並建立一個新專案 (Project)。
2. 進入左側選單的 **SQL Editor**。
3. 開啟本專案的 `backend/supabase_schema.sql` 檔案，複製全部內容並貼入 SQL Editor 中執行 (Run)。
4. 前往左側選單的 **Project Settings** -> **API**。
5. 複製 **Project URL** (例如 `https://xxxx.supabase.co`) 與 **anon public Key**。
6. 打開記帳網頁 -> 點擊右上角 **⚙️ 雲端設定** -> 選擇 **Supabase** -> 貼上 URL 與 Key -> 點擊「儲存並連接同步」。
7. 恭喜！現在所有隊友只要在各自手機輸入相同的 URL 與 Key，即可共享同一個即時帳本！

---

### 方式二：Google 試算表 (Google Apps Script Web API)
若您習慣直接在 Google 試算表中查看帳目與統計：
1. 在 Google 雲端硬碟建立一個新的「Google 試算表」，命名為「歐洲40天記帳本」。
2. 點擊上方選單 **擴充功能** -> **Apps Script**。
3. 將本專案的 `backend/google_apps_script.gs` 內容全部複製並貼入編輯器中。
4. 點擊右上角 **部署** -> **新增部署作業**。
5. 齒輪圖示選擇 **網頁應用程式 (Web App)**。
   - **說明**：EuroTrip API
   - **執行身分**：我 (您的 Google 帳號)
   - **誰可以存取**：**任何人 (Anyone)** *(重要！)*
6. 點擊「部署」，授權 Google 權限後，複製產生的 **網頁應用程式網址 (Web App URL)**。
7. 打開記帳網頁 -> 點擊右上角 **⚙️ 雲端設定** -> 選擇 **Google 試算表** -> 貼上網址並儲存即可！

---

## 📁 檔案架構

```
Antigravity_歐洲記帳/
├── index.html                  # 主頁面 (SPA 結構、儀表板、導覽列、表單、Modal)
├── css/
│   └── style.css               # Glassmorphism、暗黑深藍主題、精美滾動條與微動畫
├── js/
│   ├── itineraryData.js        # 歐洲 40 天行程節奏、搶票清單、DCC 防雷指南與幣別常數
│   ├── currency.js             # 即時匯率 API 抓取、快取、手動覆蓋與換算計算機
│   ├── cloudSync.js            # Supabase / Google Sheets / LocalStorage 離線同步引擎
│   ├── ledger.js               # 支出 CRUD、多維度統計、Chart.js 圖表、CSV/JSON 匯出
│   └── app.js                  # 核心協調器、頁籤切換、表單驗證、Toast 通知提示
├── backend/
│   ├── supabase_schema.sql     # Supabase SQL 建表與 RLS 權限腳本
│   └── google_apps_script.gs   # Google Apps Script 試算表後端 REST API 腳本
└── README.md                   # 完整部署指南與系統說明文件
```

---

## 💡 旅行貼心小叮嚀 (Quick Travel Tips)

- 💳 **嚴禁 DCC**：刷卡機跳出計價幣別時，**一律按當地貨幣 (EUR / CHF / CZK / PLN)**，絕不選 TWD，避免被收取 5%~10% 匯差。
- 🎒 **防扒第一**：巴塞隆納蘭布拉大道、巴黎地鐵與羅馬競技場為扒手熱區，手機掛繩與貼身防割包請保持在胸前可見範圍。
- 💱 **現金準備**：歐洲絕大多數地方（包括市集、地鐵）皆可感應刷卡或 Apple Pay，每人隨身準備 100~150 EUR 與 50 CHF 現金備用即可。
