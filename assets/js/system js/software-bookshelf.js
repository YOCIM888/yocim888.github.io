class CyberBookshelf {
    constructor() {
        this.books = [];
        this.currentBook = null;
        this.currentPosition = 0;
        this.bookmarks = JSON.parse(localStorage.getItem('cyber-bookshelf-bookmarks')) || {};
        this.settings = JSON.parse(localStorage.getItem('cyber-bookshelf-settings')) || {
            fontSize: 16,
            lineHeight: 1.8,
            nightMode: false,
            autoScroll: false
        };
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadBooks();
        this.applySettings();
        this.updateStats();
    }

    bindEvents() {
        // 搜索功能
        document.getElementById('search-books').addEventListener('input', (e) => {
            this.searchBooks(e.target.value);
        });

        document.getElementById('refresh-books').addEventListener('click', () => {
            this.loadBooks();
        });

        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.setViewMode(view);
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // 阅读控制
        document.getElementById('close-reader').addEventListener('click', () => {
            this.closeReader();
        });

        document.getElementById('toggle-bookmark').addEventListener('click', () => {
            this.toggleBookmark();
        });

        document.getElementById('export-book').addEventListener('click', () => {
            this.exportCurrentBook();
        });

        document.getElementById('prev-chapter').addEventListener('click', () => {
            this.prevChapter();
        });

        document.getElementById('next-chapter').addEventListener('click', () => {
            this.nextChapter();
        });

        // 字体控制
        document.getElementById('font-decrease').addEventListener('click', () => {
            this.adjustFontSize(-1);
        });

        document.getElementById('font-increase').addEventListener('click', () => {
            this.adjustFontSize(1);
        });

        document.getElementById('toggle-night').addEventListener('click', () => {
            this.toggleNightMode();
        });

        document.getElementById('toggle-fullscreen').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // 面板控制
        document.getElementById('close-bookmarks').addEventListener('click', () => {
            document.getElementById('bookmarks-panel').classList.remove('active');
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('settings-panel').classList.remove('active');
        });

        // 设置滑块
        document.getElementById('font-slider').addEventListener('input', (e) => {
            this.setFontSize(e.target.value);
        });

        document.getElementById('line-height-slider').addEventListener('input', (e) => {
            this.setLineHeight(e.target.value);
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeReader();
            } else if (e.key === 'ArrowLeft' && this.currentBook) {
                this.prevChapter();
            } else if (e.key === 'ArrowRight' && this.currentBook) {
                this.nextChapter();
            } else if (e.key === 'b' || e.key === 'B') {
                this.toggleBookmark();
            }
        });
    }

    async loadBooks() {
        try {
            // 从本地文件夹读取书籍列表
            const books = await this.scanLocalBooks();
            this.books = books;
            this.renderBookshelf();
            this.updateStats();
        } catch (error) {
            console.error('加载书籍失败:', error);
            this.showError('无法加载书籍列表，请检查文件夹路径');
        }
    }

    async scanLocalBooks() {
        // 假设 books 文件夹在项目根目录
        const books = [
            { id: 1, title: '暗黑天际线', author: '匿名', filename: '暗黑天际线.txt' },
            { id: 2, title: '沉默的低语', author: '匿名', filename: '沉默的低语.txt' },
            { id: 3, title: '当光芒遇见尘埃', author: '匿名', filename: '当光芒遇见尘埃.txt' },
            { id: 4, title: '风吹过她的发梢', author: '匿名', filename: '风吹过她的发梢.txt' },
            { id: 5, title: '黑暗幻想', author: '匿名', filename: '黑暗幻想.txt' },
            { id: 6, title: '凛冬下的夜城', author: '匿名', filename: '凛冬下的夜城.txt' },
            { id: 7, title: '群星闪耀之时', author: '匿名', filename: '群星闪耀之时.txt' },
            { id: 8, title: '所以我放弃了写作', author: '匿名', filename: '所以我放弃了写作.txt' },
            { id: 9, title: '写给未来的三封信', author: '匿名', filename: '写给未来的三封信.txt' },
            { id: 10, title: '星辰中的维纳斯', author: '匿名', filename: '星辰中的维纳斯.txt' },
            { id: 11, title: '源界转生', author: '匿名', filename: '源界转生.txt' },
            { id: 12, title: '在深海之下', author: '匿名', filename: '在深海之下.txt' }
        ];

        // 为每本书添加进度信息
        const readingData = JSON.parse(localStorage.getItem('cyber-bookshelf-reading')) || {};
        
        return books.map(book => ({
            ...book,
            progress: readingData[book.id]?.progress || 0,
            lastRead: readingData[book.id]?.lastRead || null
        }));
    }

    renderBookshelf() {
        const container = document.getElementById('books-container');
        container.innerHTML = '';

        this.books.forEach(book => {
            const bookEl = document.createElement('div');
            bookEl.className = 'book-card';
            bookEl.dataset.id = book.id;

            const progress = book.progress || 0;
            const hasBookmarks = this.bookmarks[book.id]?.length > 0;

            bookEl.innerHTML = `
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-meta">
                    <span>${this.formatFileSize(book.size)}</span>
                    <span>${hasBookmarks ? '<i class="fas fa-bookmark"></i>' : ''}</span>
                </div>
            `;

            bookEl.addEventListener('click', () => {
                this.openBook(book.id);
            });

            container.appendChild(bookEl);
        });
    }

    async openBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        try {
            // 从本地文件加载内容
            const response = await fetch(`../data/books/${book.filename}`);
            if (!response.ok) throw new Error('文件读取失败');
            
            const text = await response.text();
            book.content = text;
            book.chapters = this.splitIntoChapters(text);
            
            this.currentBook = book;
            this.currentPosition = 0;

            // 更新UI
            document.querySelectorAll('.book-card').forEach(card => {
                card.classList.remove('active');
                if (parseInt(card.dataset.id) === bookId) {
                    card.classList.add('active');
                }
            });

            document.getElementById('current-book-title').textContent = book.title;
            document.getElementById('current-book-author').textContent = book.author;
            document.getElementById('current-book-length').textContent = `${book.content.length} 字`;

            // 显示阅读器
            document.getElementById('reader-panel').classList.add('active');

            // 显示内容
            this.displayCurrentChapter();

            // 保存阅读记录
            this.saveReadingProgress();

        } catch (error) {
            console.error('打开书籍失败:', error);
            this.showError(`无法打开书籍: ${error.message}`);
        }
    }

    splitIntoChapters(text) {
        // 简单的章节分割（按段落或章节标题）
        const lines = text.split('\n');
        const chapters = [];
        let currentChapter = [];
        let chapterTitle = '第一章';

        for (let line of lines) {
            if (line.trim().match(/^第[零一二三四五六七八九十百千万]+章/)) {
                if (currentChapter.length > 0) {
                    chapters.push({
                        title: chapterTitle,
                        content: currentChapter.join('\n')
                    });
                }
                chapterTitle = line.trim();
                currentChapter = [line];
            } else {
                currentChapter.push(line);
            }
        }

        if (currentChapter.length > 0) {
            chapters.push({
                title: chapterTitle,
                content: currentChapter.join('\n')
            });
        }

        return chapters.length > 0 ? chapters : [{
            title: '全文',
            content: text
        }];
    }

    displayCurrentChapter() {
        if (!this.currentBook || !this.currentBook.chapters) return;

        const chapter = this.currentBook.chapters[this.currentPosition];
        const textDisplay = document.getElementById('book-text');
        
        textDisplay.innerHTML = `
            <h3>${chapter.title}</h3>
            <div class="chapter-content">${chapter.content.replace(/\n/g, '<br>')}</div>
        `;

        // 更新进度
        this.updateReadingProgress();
    }

    prevChapter() {
        if (this.currentPosition > 0) {
            this.currentPosition--;
            this.displayCurrentChapter();
            this.saveReadingProgress();
        }
    }

    nextChapter() {
        if (this.currentBook && this.currentPosition < this.currentBook.chapters.length - 1) {
            this.currentPosition++;
            this.displayCurrentChapter();
            this.saveReadingProgress();
        }
    }

    updateReadingProgress() {
        if (!this.currentBook) return;

        const progress = ((this.currentPosition + 1) / this.currentBook.chapters.length) * 100;
        
        document.getElementById('reading-progress').style.width = `${progress}%`;
        document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
        document.getElementById('current-position').textContent = 
            `第 ${this.currentPosition + 1}/${this.currentBook.chapters.length} 章`;

        // 更新书籍进度
        this.currentBook.progress = progress;
        const bookEl = document.querySelector(`.book-card[data-id="${this.currentBook.id}"]`);
        if (bookEl) {
            // 这里可以更新书籍卡片的进度显示
        }
    }

    saveReadingProgress() {
        if (!this.currentBook) return;

        const readingData = JSON.parse(localStorage.getItem('cyber-bookshelf-reading')) || {};
        readingData[this.currentBook.id] = {
            progress: this.currentBook.progress,
            lastPosition: this.currentPosition,
            lastRead: new Date().toISOString()
        };

        localStorage.setItem('cyber-bookshelf-reading', JSON.stringify(readingData));
    }

    toggleBookmark() {
        if (!this.currentBook) return;

        const bookmark = {
            chapter: this.currentPosition,
            title: this.currentBook.chapters[this.currentPosition]?.title || '未命名章节',
            timestamp: new Date().toLocaleString(),
            note: prompt('书签备注（可选）:', '')
        };

        if (!this.bookmarks[this.currentBook.id]) {
            this.bookmarks[this.currentBook.id] = [];
        }

        this.bookmarks[this.currentBook.id].push(bookmark);
        localStorage.setItem('cyber-bookshelf-bookmarks', JSON.stringify(this.bookmarks));
        
        this.showNotification('书签已添加');
        this.updateStats();
    }

    closeReader() {
        document.getElementById('reader-panel').classList.remove('active');
        document.querySelectorAll('.book-card').forEach(card => {
            card.classList.remove('active');
        });
        this.saveReadingProgress();
    }

    searchBooks(query) {
        const filtered = this.books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('books-container');
        container.innerHTML = '';

        filtered.forEach(book => {
            const bookEl = document.createElement('div');
            bookEl.className = 'book-card';
            bookEl.textContent = book.title;
            bookEl.addEventListener('click', () => this.openBook(book.id));
            container.appendChild(bookEl);
        });
    }

    setViewMode(mode) {
        const container = document.getElementById('books-container');
        container.className = 'books-container ' + mode + '-view';
    }

    adjustFontSize(delta) {
        this.settings.fontSize = Math.max(12, Math.min(24, this.settings.fontSize + delta));
        this.setFontSize(this.settings.fontSize);
    }

    setFontSize(size) {
        this.settings.fontSize = parseInt(size);
        document.getElementById('book-text').style.fontSize = size + 'px';
        document.getElementById('font-size').textContent = size + 'px';
        localStorage.setItem('cyber-bookshelf-settings', JSON.stringify(this.settings));
    }

    setLineHeight(height) {
        this.settings.lineHeight = parseFloat(height);
        document.getElementById('book-text').style.lineHeight = height;
        localStorage.setItem('cyber-bookshelf-settings', JSON.stringify(this.settings));
    }

    toggleNightMode() {
        this.settings.nightMode = !this.settings.nightMode;
        document.getElementById('book-text').classList.toggle('night-mode', this.settings.nightMode);
        localStorage.setItem('cyber-bookshelf-settings', JSON.stringify(this.settings));
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    applySettings() {
        this.setFontSize(this.settings.fontSize);
        this.setLineHeight(this.settings.lineHeight);
        
        if (this.settings.nightMode) {
            document.getElementById('book-text').classList.add('night-mode');
        }
    }

    exportCurrentBook() {
        if (!this.currentBook || !this.currentBook.content) return;

        const blob = new Blob([this.currentBook.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentBook.title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    updateStats() {
        document.getElementById('total-books').textContent = this.books.length;
        
        let totalBookmarks = 0;
        for (const bookId in this.bookmarks) {
            totalBookmarks += this.bookmarks[bookId].length;
        }
        document.getElementById('total-bookmarks').textContent = totalBookmarks;
    }

    formatFileSize(bytes) {
        if (!bytes) return '未知大小';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'cyber-error';
        errorDiv.textContent = message;
        
        // 添加到页面顶部
        document.querySelector('.cyber-header').after(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showNotification(message) {
        // 简单的通知实现
        console.log('通知:', message);
    }
}

// 初始化书架
document.addEventListener('DOMContentLoaded', () => {
    window.bookshelf = new CyberBookshelf();
});