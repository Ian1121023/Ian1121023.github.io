// 筆記配置文件
// 每當你新增筆記時，在這裡添加相應的配置

const notesConfig = {
    // 雲端相關
    'cloud/gcp-basic': {
        title: 'GCP基礎入門學習路徑',
        author: '張易安',
        date: '2025-6-25',
        tags: ['GCP']
    },

    'cloud/cloud-planning': {
        title: '雲端維運規劃',
        author: '張易安',
        date: '2025-6-25',
        tags: ['plan']
    },
    
    'cloud/it-basic': {
        title: 'IT 基礎知識',
        author: '張易安',
        date: '2025-6-25',
        tags: ['IT']
    },
    
    // 程式設計相關
    'html-css': {
        title: 'HTML/CSS 基礎入門',
        author: '張易安',
        date: '2024-01-25',
        tags: ['CSS', 'HTML', '基礎']
    },
    
    'javascript-advanced': {
        title: 'JavaScript 進階概念',
        author: '你的名字',
        date: '2024-02-01',
        tags: ['JavaScript', 'Web開發', '進階']
    },
    
    'react-tutorial': {
        title: 'React 入門教學',
        author: '你的名字',
        date: '2024-02-10',
        tags: ['React', 'Frontend', '框架']
    },
    
    'nodejs-backend': {
        title: 'Node.js 後端開發',
        author: '你的名字',
        date: '2024-02-15',
        tags: ['Node.js', 'Backend', 'API']
    },
    
    // 數據科學相關
    'data-analysis': {
        title: '數據分析入門',
        author: '你的名字',
        date: '2024-02-20',
        tags: ['數據分析', 'Python', 'Pandas']
    },
    
    'machine-learning': {
        title: '機器學習基礎',
        author: '你的名字',
        date: '2024-02-25',
        tags: ['機器學習', 'AI', 'TensorFlow']
    },
    
    // 工具和環境
    'git-tutorial': {
        title: 'Git 版本控制',
        author: '你的名字',
        date: '2024-03-01',
        tags: ['Git', '版本控制', '工具']
    },
    
    'docker-basics': {
        title: 'Docker 容器化技術',
        author: '你的名字',
        date: '2024-03-05',
        tags: ['Docker', '容器化', 'DevOps']
    },
    
    // 學習筆記
    'study-methods': {
        title: '有效學習方法',
        author: '你的名字',
        date: '2024-03-10',
        tags: ['學習方法', '效率', '筆記']
    },
    
    // 關於頁面
    'about': {
        title: '關於本筆記系統',
        author: '系統管理員',
        date: '2024-01-01',
        tags: ['關於', '說明']
    }
    
    // 添加新筆記時，請按照以下格式：
    // 'note-filename': {
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