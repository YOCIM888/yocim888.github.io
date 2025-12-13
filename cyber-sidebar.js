// 赛博朋克侧边栏功能
class CyberSidebar {
  constructor() {
    this.init();
    this.loadFiles();
  }

  init() {
    // 侧边栏切换
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebarContent = document.getElementById('sidebar-content');
    
    toggleBtn.addEventListener('click', () => {
      sidebarContent.classList.toggle('sidebar-hidden');
      sidebarContent.classList.toggle('sidebar-visible');
    });

    // 菜单项点击事件
    document.querySelectorAll('.cyber-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        this.openModal(section);
        // 关闭侧边栏
        sidebarContent.classList.add('sidebar-hidden');
        sidebarContent.classList.remove('sidebar-visible');
      });
    });

    // 关闭按钮
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // 遮罩层点击关闭
    document.getElementById('modal-overlay').addEventListener('click', () => {
      this.closeAllModals();
    });

    // 小说返回列表按钮
    document.getElementById('back-to-list').addEventListener('click', () => {
      document.getElementById('novel-list').classList.remove('hidden');
      document.getElementById('novel-reader').classList.add('hidden');
    });

    // 图片导航
    document.getElementById('prev-img').addEventListener('click', () => {
      this.navigateImage(-1);
    });

    document.getElementById('next-img').addEventListener('click', () => {
      this.navigateImage(1);
    });

    // 阻止模态框内部点击关闭
    document.querySelectorAll('.cyber-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  // 文件列表配置 - 请根据实际文件修改
  files = {
    novels: [
      { name: '赛博之城', file: 'book/赛博之城.txt' },
      { name: '数字幽灵', file: 'book/digital-ghost.txt' },
      { name: '霓虹之夜', file: 'book/neon-night.txt' }
    ],
    images: [
      { name: '卡提西亚', file: 'Picture/卡提西亚.jpg' },
      { name: '霓虹街道', file: 'Picture/neon-street.jpg' },
      { name: '未来科技', file: 'Picture/future-tech.jpg' },
      { name: '数字雨', file: 'Picture/digital-rain.jpg' }
    ],
    pdfs: [
      { name: '测试', file: 'courses/测试.pdf' }
    ]
  };

  currentImageIndex = 0;

  loadFiles() {
    // 加载小说列表
    const novelList = document.getElementById('novel-list');
    this.files.novels.forEach((novel, index) => {
      const div = document.createElement('div');
      div.className = 'file-item';
      div.textContent = `${index + 1}. ${novel.name}`;
      div.addEventListener('click', () => this.readNovel(novel.file, novel.name));
      novelList.appendChild(div);
    });

    // 加载图片列表
    this.loadImages();

    // 加载PDF列表
    const pdfList = document.getElementById('pdf-list');
    this.files.pdfs.forEach((pdf, index) => {
      const div = document.createElement('div');
      div.className = 'file-item';
      div.innerHTML = `
        <span>${index + 1}. ${pdf.name}</span>
        <button class="open-pdf cyber-btn-small" data-pdf="${pdf.file}">打开</button>
      `;
      pdfList.appendChild(div);
    });

    // PDF打开按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('open-pdf')) {
        const pdfFile = e.target.dataset.pdf;
        window.open(pdfFile, '_blank');
      }
    });
  }

  loadImages() {
    const thumbnails = document.getElementById('thumbnails');
    const imageInfo = document.getElementById('image-info');
    
    this.files.images.forEach((image, index) => {
      const img = document.createElement('img');
      img.className = 'thumbnail';
      img.src = image.file;
      img.alt = image.name;
      img.dataset.index = index;
      
      img.addEventListener('click', () => {
        this.showImage(index);
      });
      
      thumbnails.appendChild(img);
    });

    // 显示第一张图片
    if (this.files.images.length > 0) {
      this.showImage(0);
    }
  }

  showImage(index) {
    this.currentImageIndex = index;
    const image = this.files.images[index];
    const currentImage = document.getElementById('current-image');
    const imageInfo = document.getElementById('image-info');
    
    currentImage.src = image.file;
    currentImage.alt = image.name;
    imageInfo.textContent = `${image.name} (${index + 1}/${this.files.images.length})`;
    
    // 更新缩略图激活状态
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
  }

  navigateImage(direction) {
    let newIndex = this.currentImageIndex + direction;
    
    if (newIndex < 0) {
      newIndex = this.files.images.length - 1;
    } else if (newIndex >= this.files.images.length) {
      newIndex = 0;
    }
    
    this.showImage(newIndex);
  }

  async readNovel(file, title) {
    try {
      const response = await fetch(file);
      const text = await response.text();
      
      document.getElementById('novel-title').textContent = title;
      document.getElementById('novel-text').textContent = text;
      
      document.getElementById('novel-list').classList.add('hidden');
      document.getElementById('novel-reader').classList.remove('hidden');
    } catch (error) {
      console.error('读取小说失败:', error);
      document.getElementById('novel-text').textContent = '加载失败，请检查文件路径';
    }
  }

  openModal(section) {
    // 关闭所有模态框
    this.closeAllModals();
    
    // 显示遮罩层
    document.getElementById('modal-overlay').classList.remove('hidden');
    
    // 显示对应的模态框
    const modal = document.getElementById(`${section}-modal`);
    if (modal) {
      modal.classList.remove('hidden');
      
      // 如果是壁纸模态框，确保图片显示正确
      if (section === 'wallpaper') {
        this.showImage(this.currentImageIndex);
      }
      
      // 如果是小说模态框，显示列表
      if (section === 'novel') {
        document.getElementById('novel-list').classList.remove('hidden');
        document.getElementById('novel-reader').classList.add('hidden');
      }
    }
  }

  closeAllModals() {
    // 隐藏所有模态框
    document.querySelectorAll('.cyber-modal').forEach(modal => {
      modal.classList.add('hidden');
    });
    
    // 隐藏遮罩层
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new CyberSidebar();
});