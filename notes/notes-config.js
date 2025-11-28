// 筆記配置文件
// 每當你新增筆記時，在這裡添加相應的配置

const notesConfig = {
    // 雲端相關
    'cloud/gcp-basic': {
        title: 'GCP基礎入門學習路徑',
        author: '張易安',
        date: '2025-06-25',
        tags: ['GCP', '雲端', '學習路徑']
    },

    'cloud/cloud-planning': {
        title: '雲端維運規劃',
        author: '張易安',
        date: '2025-06-25',
        tags: ['雲端', '維運', '規劃']
    },

    'cloud/it-basic': {
        title: 'IT 基礎知識',
        author: '張易安',
        date: '2025-06-25',
        tags: ['IT', '基礎', '知識']
    },

    // 前端開發
    'frontend/html-css': {
        title: 'HTML/CSS 基礎入門',
        author: '張易安',
        date: '2025-06-24',
        tags: ['HTML', 'CSS', '前端', '基礎']
    },

    // 後端開發
    'backend/python-basics': {
        title: 'Python 程式設計基礎',
        author: '張易安',
        date: '2025-06-25',
        tags: ['Python', '程式設計', '後端', '基礎']
    },

    // 工具與環境
    'tools/git-basics': {
        title: 'Git 版本控制基礎',
        author: '張易安',
        date: '2025-06-24',
        tags: ['Git', '版本控制', '工具']
    },

    'misc/markdown': {
        title: 'Markdown 語法指南',
        author: '張易安',
        date: '2025-06-24',
        tags: ['Markdown', '語法', '工具']
    },

    // 預設配置（當筆記不存在時使用）
    'default': {
        title: '筆記未找到',
        author: '系統',
        date: '2025-01-01',
        tags: ['系統']
    }

    // 添加新筆記時，請按照以下格式：
    // 'category/note-filename': {
    //     title: '筆記標題',
    //     author: '作者名稱',
    //     date: 'YYYY-MM-DD',
    //     tags: ['標籤1', '標籤2', '標籤3']
    // }
};

// 如果在瀏覽器環境中，將配置添加到全域
if (typeof window !== 'undefined') {
    window.notesConfig = notesConfig;
}

// 如果在 Node.js 環境中，匯出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = notesConfig;
}
