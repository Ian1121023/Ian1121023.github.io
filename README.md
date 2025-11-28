# 📚 我的學習筆記

> 記錄知識、分享心得、持續成長

這是一個使用 GitHub Pages 建立的個人技術學習筆記網站，用於記錄和分享學習過程中的知識與心得。

## 🌟 特色

- **響應式設計** - 支援桌面和行動裝置
- **Markdown 支援** - 使用 markdown-it 解析器，支援程式碼高亮和數學公式
- **分類管理** - 筆記按照主題分類整理
- **美觀界面** - 現代化的卡片式設計，漸層配色
- **語法高亮** - 使用 Prism.js 提供程式碼語法高亮
- **數學公式** - 使用 KaTeX 渲染數學公式

## 📁 專案結構

```
Ian1121023.github.io/
├── index.html              # 首頁
├── notes.html              # 筆記列表頁
├── about.html              # 關於頁面
├── projects.html           # 專案展示頁（規劃中）
├── notes/
│   ├── viewer.html         # Markdown 筆記檢視器
│   ├── notes-config.js     # 筆記配置文件
│   └── html-css.html       # 舊版 HTML 格式筆記（已棄用）
├── markdown/               # Markdown 筆記目錄
│   ├── frontend/          # 前端開發筆記
│   │   └── html-css.md
│   ├── backend/           # 後端開發筆記
│   │   └── python-basics.md
│   ├── cloud/             # 雲端運算筆記
│   │   ├── gcp-basic.md
│   │   ├── cloud-planning.md
│   │   └── it-basic.md
│   ├── tools/             # 開發工具筆記
│   │   └── git-basics.md
│   └── misc/              # 其他筆記
│       └── markdown.md
├── images/                # 圖片資源
└── README.md              # 專案說明文件
```

## 🚀 如何使用

### 新增筆記

1. **建立 Markdown 檔案**

   在 `markdown/` 目錄下對應的分類資料夾中建立新的 `.md` 檔案：

   ```bash
   # 例如：建立一個新的 JavaScript 筆記
   touch markdown/frontend/javascript-basics.md
   ```

2. **更新配置文件**

   在 `notes/notes-config.js` 中添加筆記的元數據：

   ```javascript
   'frontend/javascript-basics': {
       title: 'JavaScript 基礎入門',
       author: '張易安',
       date: '2025-06-30',
       tags: ['JavaScript', '前端', '基礎']
   }
   ```

3. **編寫內容**

   使用 Markdown 語法編寫筆記內容，支援：
   - 標題、列表、連結、圖片
   - 程式碼區塊（含語法高亮）
   - 數學公式（LaTeX 語法）
   - Emoji 表情
   - 腳註

4. **檢視筆記**

   訪問以下 URL 查看筆記：
   ```
   https://ian1121023.github.io/notes/viewer.html?note=frontend/javascript-basics
   ```

### 筆記分類

建議按照以下分類組織筆記：

- `frontend/` - 前端開發相關（HTML, CSS, JavaScript, React 等）
- `backend/` - 後端開發相關（Python, Node.js, Java 等）
- `cloud/` - 雲端運算相關（GCP, AWS, Azure 等）
- `tools/` - 開發工具相關（Git, Docker, VS Code 等）
- `misc/` - 其他未分類筆記

## 🛠 技術棧

### 前端框架
- **HTML5** - 語義化標籤
- **CSS3** - Grid、Flexbox、動畫
- **JavaScript (ES6+)** - 原生 JavaScript，無框架依賴

### 第三方庫（CDN）
- **markdown-it** (v13.0.1) - Markdown 解析
- **Prism.js** (v1.29.0) - 程式碼語法高亮
- **KaTeX** (v0.16.9) - 數學公式渲染
- **GitHub Markdown CSS** (v5.5.0) - Markdown 樣式

### 部署平台
- **GitHub Pages** - 靜態網站託管

## 📝 Markdown 語法範例

### 程式碼區塊

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

### 數學公式

行內公式：$E = mc^2$

區塊公式：
$$
\int_{a}^{b} f(x) dx
$$

### 表格

| 項目 | 說明 |
|------|------|
| HTML | 超文本標記語言 |
| CSS  | 層疊樣式表 |

## 🎨 自訂樣式

網站使用自訂 CSS 樣式，主要配色：

- 主色調：紫色漸層 (#667eea → #764ba2)
- 背景色：淺灰 (#f8f9fa)
- 文字色：深灰 (#333)
- 導航列：深藍灰 (#2c3e50)

## 📄 授權

本專案採用 MIT 授權條款。

## 👤 作者

**張易安**

- GitHub: [@Ian1121023](https://github.com/Ian1121023)
- 網站: [https://ian1121023.github.io](https://ian1121023.github.io)

## 🙏 致謝

感謝以下開源專案：
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [Prism](https://prismjs.com/)
- [KaTeX](https://katex.org/)
- [GitHub Pages](https://pages.github.com/)

---

**持續學習，永不停歇 💪**
