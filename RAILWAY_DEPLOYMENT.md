# Railway 部署指南

本文件說明如何將 KindWorld Web 應用部署到 Railway。

## 📋 前置要求

1. Railway 帳號（[railway.app](https://railway.app)）
2. GitHub 帳號
3. 已完成專案設定並推送到 GitHub

## 🚀 部署步驟

### 1. 準備 GitHub 儲存庫

專案已經設定好 Git remote：
```bash
git remote add origin git@github.com:tzustu63/kindworld.git
git branch -M main
git push -u origin main
```

### 2. 在 Railway 創建新專案

1. 登入 [Railway Dashboard](https://railway.app/dashboard)
2. 點擊 "New Project"
3. 選擇 "Deploy from GitHub repo"
4. 選擇 `tzustu63/kindworld` 儲存庫
5. Railway 會自動檢測專案設定

### 3. 配置部署設定

Railway 會使用以下配置文件：
- `railway.json` - Railway 部署配置
- `nixpacks.toml` - Nixpacks 建置配置

**Root Directory（根目錄）設定：**
在 Railway 專案設定中，將 Root Directory 設為 `web`

**建置命令：**
```
npm install && npm run build
```

**啟動命令：**
```
npm start
```

或 Railway 會自動使用 `web/package.json` 中的 `start` 腳本。

### 4. 環境變數設定

在 Railway 專案設定中添加以下環境變數（如需要）：

#### Firebase 配置
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 其他環境變數
```
NODE_ENV=production
PORT=3000  # Railway 會自動設定，不需要手動設定
```

**在 Railway 中設定環境變數：**
1. 進入專案設定
2. 點擊 "Variables" 標籤
3. 添加所需的環境變數
4. 儲存後 Railway 會自動重新部署

### 5. 部署流程

Railway 會自動執行以下流程：
1. 檢測到 GitHub push 事件
2. 觸發新的部署
3. 使用 Nixpacks 建置環境
4. 執行 `npm install` 安裝依賴
5. 執行 `npm run build` 建置專案
6. 執行 `npm start` 啟動服務

### 6. 自訂網域（選用）

1. 在 Railway 專案中點擊 "Settings"
2. 進入 "Networking" 標籤
3. 點擊 "Generate Domain" 生成 Railway 網域
4. 或點擊 "Custom Domain" 添加自己的網域

## 📁 專案結構

```
kindworld/
├── railway.json          # Railway 部署配置
├── nixpacks.toml        # Nixpacks 建置配置
└── web/                 # Web 應用目錄
    ├── package.json     # 包含 build 和 start 腳本
    ├── vite.config.ts   # Vite 配置
    ├── src/            # 原始碼
    └── dist/           # 建置輸出（自動生成）
```

## 🔧 配置文件說明

### railway.json
定義 Railway 的建置和部署行為：
- 建置命令：在 web 目錄執行 npm install 和 build
- 啟動命令：使用 serve 服務靜態文件

### nixpacks.toml
定義 Nixpacks 的建置流程：
- 使用 Node.js 18
- 安裝依賴並建置
- 使用 serve 啟動服務

### web/package.json
- `build`: 建置生產版本到 dist 目錄
- `start`: 使用 serve 啟動靜態文件服務器

## 🐛 故障排除

### 部署失敗

1. **檢查建置日誌**
   - 在 Railway Dashboard 查看建置日誌
   - 確認是否有錯誤訊息

2. **確認 Root Directory**
   - 確保設定為 `web`
   - 或使用 Railway CLI：`railway link`

3. **檢查環境變數**
   - 確認所有必需的環境變數都已設定
   - Firebase 配置必須正確

4. **檢查 Node.js 版本**
   - Railway 會使用專案指定的 Node.js 版本
   - 確認 `package.json` 中的 `engines` 設定

### 服務無法啟動

1. **檢查 PORT 環境變數**
   - Railway 會自動設定 `PORT` 環境變數
   - `start` 腳本使用 `${PORT:-3000}` 作為後備

2. **檢查 dist 目錄**
   - 確認 `npm run build` 成功執行
   - dist 目錄必須存在且包含建置文件

3. **檢查 serve 套件**
   - 確認 `serve` 已安裝在 `devDependencies` 中

## 🔄 更新部署

每次推送到 GitHub main 分支時，Railway 會自動觸發新的部署。也可以手動觸發：

1. 在 Railway Dashboard 中點擊專案
2. 進入 "Deployments" 標籤
3. 點擊 "Redeploy" 重新部署

## 📊 監控和日誌

- **即時日誌**：在 Railway Dashboard 的 "Logs" 標籤查看
- **指標監控**：Railway 提供基本的 CPU、記憶體使用監控
- **部署歷史**：在 "Deployments" 標籤查看所有部署記錄

## 💰 定價

Railway 提供免費額度：
- $5 免費額度/月
- 超出後按使用量計費

詳情請查看 [Railway Pricing](https://railway.app/pricing)

## 📚 相關資源

- [Railway 文件](https://docs.railway.app)
- [Nixpacks 文件](https://nixpacks.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

## 🔐 安全性建議

1. **不要將敏感資訊推送到 Git**
   - 使用環境變數儲存 API keys
   - 確認 `.env` 在 `.gitignore` 中

2. **定期更新依賴**
   ```bash
   cd web && npm audit && npm update
   ```

3. **啟用 Railway 的自動備份**（如果適用）

---

如有問題，請參考 Railway 官方文件或提交 Issue。

