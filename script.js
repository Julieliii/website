// 语言管理器类 - 统一管理所有语言切换
class LanguageManager {
  constructor() {
    this.currentLang = 'zh';
    this.elements = [];
    this.modalResources = {};
    this.init();
  }

  init() {
    this.collectTranslatableElements();
    this.setupEventListeners();
    this.loadSavedLanguage();
  }

  collectTranslatableElements() {
    this.elements = document.querySelectorAll('[data-lang-zh]');
  }

  setupEventListeners() {
    // 导航栏语言切换
    const navLangButtons = document.querySelectorAll('.nav-lang-btn');
    navLangButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.switchLanguage(lang);
        this.updateButtonStates(navLangButtons, e.target);
      });
    });

    // About页面语言切换
    const aboutLangButtons = document.querySelectorAll('.lang-btn');
    aboutLangButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.switchLanguage(lang);
        this.updateButtonStates(aboutLangButtons, e.target);
      });
    });
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    this.updateContent();
    this.updateGalleryInfoBox();
    this.updateModalContent();
    this.saveLanguagePreference();
  }

  updateContent() {
    this.elements.forEach(element => {
      const translation = element.getAttribute(`data-lang-${this.currentLang}`);
      if (translation) {
        element.textContent = translation;
      }
    });
  }

  updateGalleryInfoBox() {
    const infoBox = document.getElementById('infoBox');
    const infoTitle = document.getElementById('infoTitle');
    const infoMeta = document.getElementById('infoMeta');
    const infoDescription = document.getElementById('infoDescription');

    if (!infoBox || !infoTitle || !infoMeta || !infoDescription) return;

    if (this.currentLang === 'zh') {
      infoTitle.innerHTML = "悬停查看项目<br><span style=\"font-size: 0.8em; color: #666; font-weight: normal;\">Hover over a project</span>";
      infoMeta.innerHTML = `<span>选择卡片</span><span>查看详情</span>`;
      infoDescription.innerHTML = `
        将光标悬停在任意卡片上查看项目信息。
        <div style="height: 1px; background: #eee; margin: 8px 0;"></div>
        <span style="color: #666;">Move your cursor over any of the cards to view project information.</span>
      `;
    } else {
      infoTitle.innerHTML = "Hover over a project<br><span style=\"font-size: 0.8em; color: #666; font-weight: normal;\">悬停查看项目</span>";
      infoMeta.innerHTML = `<span>Select a card</span><span>to see details</span>`;
      infoDescription.innerHTML = `
        Move your cursor over any of the cards to view project information.
        <div style="height: 1px; background: #eee; margin: 8px 0;"></div>
        <span style="color: #666;">将光标悬停在任意卡片上查看项目信息</span>
      `;
    }
  }

  updateModalContent() {
    this.updateModalTitles();
    this.updateResourceButtons();
    this.updateNoPreviewContent();
  }

  updateModalTitles() {
    const modalTitle = document.getElementById('modalTitle');
    const resourcesTitle = document.getElementById('resourcesTitle');
    
    if (modalTitle) {
      const translation = modalTitle.getAttribute(`data-lang-${this.currentLang}`);
      if (translation) {
        modalTitle.textContent = translation;
      }
    }
    
    if (resourcesTitle) {
      const translation = resourcesTitle.getAttribute(`data-lang-${this.currentLang}`);
      if (translation) {
        resourcesTitle.textContent = translation;
      }
    }
  }

  updateResourceButtons() {
    const pdfButtons = document.querySelectorAll('.resource-tab[data-type="pdf"]');
    const videoButtons = document.querySelectorAll('.resource-tab[data-type="video"]');
    
    pdfButtons.forEach(button => {
      const count = this.modalResources.pdfs?.length || 0;
      const text = this.currentLang === 'zh' ? '文档' : 'Documents';
      button.innerHTML = `<span class="button-content">${text} ${count > 0 ? `(${count})` : '(0)'}</span>`;
      button.disabled = count === 0;
    });
    
    videoButtons.forEach(button => {
      const count = this.modalResources.videos?.length || 0;
      const text = this.currentLang === 'zh' ? '视频' : 'Videos';
      button.innerHTML = `<span class="button-content">${text} ${count > 0 ? `(${count})` : '(0)'}</span>`;
      button.disabled = count === 0;
    });
  }

  updateNoPreviewContent() {
    const noPreview = document.getElementById('noPreviewContent');
    if (noPreview) {
      const translation = noPreview.getAttribute(`data-lang-${this.currentLang}`);
      if (translation) {
        noPreview.textContent = translation;
      }
    }
  }

  updateButtonStates(buttons, activeButton) {
    buttons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  saveLanguagePreference() {
    localStorage.setItem('preferred-language', this.currentLang);
  }

  loadSavedLanguage() {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      this.switchLanguage(savedLang);
      const allLangButtons = document.querySelectorAll('.nav-lang-btn, .lang-btn');
      allLangButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === savedLang) {
          btn.classList.add('active');
        }
      });
    }
  }

  setModalResources(pdfs, videos) {
    this.modalResources = { pdfs, videos };
  }
}

// Canva链接映射配置 - 请替换为您的实际Canva链接
const canvaLinkMapper = {
  // PDF文件映射 - 使用 /view 链接
 pdfs: {
    'medias/work2.pdf': 'https://www.canva.cn/design/DAG3v27LOks/nYnDgVunopE3UrEmUfgHUQ/view',
    'medias/work3.pdf': 'https://www.canva.cn/design/DAG3vzFB6Os/LT74d4jZ90MrnjH1jB47cg/view',
    'medias/work4.pdf': 'https://www.canva.cn/design/DAG3v__78VU/GOlCK2WyHpGkrJbCPXwEAA/view',
    'medias/work5.pdf': 'https://www.canva.cn/design/DAG3v_D8BOs/rMc1edeZ0i3s7UR6s-wx8Q/view',
    'medias/work6.pdf': 'https://www.canva.cn/design/DAG36YYbNIc/qRDHLKZHMnu2AjSpLSu_qA/view',
    'medias/work7.pdf': 'https://www.canva.cn/design/DAG36fRs5NU/wTeOnt6mJtz4reyGko5O_w/view',
    'medias/work8.pdf': 'https://www.canva.cn/design/DAG3v_qvJrg/MhMqXIGJh4LhX8nuhQggZQ/view',
    'medias/work9.pdf': 'https://www.canva.cn/design/DAG3v0n3UCI/_yudbHu8SJznJv2VHbYhMQ/view',
    'medias/work10.pdf': 'https://www.canva.cn/design/DAG36TOf6co/lzstXRzM5Hg8RlAoz1Ex_g/view',
    'medias/work11.pdf': 'https://www.canva.cn/design/DAG36Xm_mic/dpKXDqTbyONC_92ua1666Q/view'
  },
  // 视频文件映射 - 使用 /watch 链接
  videos: {
    'medias/work1.mp4': 'https://www.canva.cn/design/DAG36qKar3k/1yf43bti-G_UmKnTBVIIuA/watch',
    'medias/work2.mp4': 'https://www.canva.cn/design/DAG36sLXSVI/_waBg5k5J3B9RBQK3SJwpA/watch',
    'medias/work3.mp4': 'https://www.canva.cn/design/DAG37_NWOPs/3OvPGK2GOwNzyKeqYfm5hg/watch',
    'medias/work6.mp4': 'https://www.canva.cn/design/DAG370dHrug/7y1zkZinSh2dOqyaZwOOWg/watch',
    'medias/work10.mp4': 'https://www.canva.cn/design/DAG37y9I6p4/rdnseN8a7YBN7B37-ag17w/watch',
    'medias/work11.mp4': 'https://www.canva.cn/design/DAG37ztmWx4/7JTydvBO7BEbn-iPtvEoSQ/watch'
  }
};

// 资源管理器 - 处理本地文件与Canva链接的转换
class ResourceManager {
  static getCanvaLink(filePath, fileType) {
    const mapper = fileType === 'pdf' ? canvaLinkMapper.pdfs : canvaLinkMapper.videos;
    const canvaUrl = mapper[filePath];
    
    if (canvaUrl) {
      // 保持原始链接格式（PDF用/view，视频用/watch）
      return canvaUrl;
    }
    
    return filePath; // 如果找不到映射，返回原路径作为fallback
  }

  static isCanvaLink(filePath) {
    return filePath.includes('canva.cn');
  }

  static getResourceType(filePath) {
    if (this.isCanvaLink(filePath)) {
      return 'canva';
    }
    const ext = filePath.split('.').pop().toLowerCase();
    return ext;
  }

  // 获取Canva嵌入URL（添加?embed参数）
  static getCanvaEmbedUrl(filePath) {
    if (!this.isCanvaLink(filePath)) return filePath;
    
    // 如果已经是嵌入链接，直接返回
    if (filePath.includes('?embed')) {
      return filePath;
    }
    
    // 添加?embed参数
    return `${filePath}?embed`;
  }

  // 判断是PDF还是视频
  static getCanvaContentType(filePath) {
    if (!this.isCanvaLink(filePath)) return 'unknown';
    
    if (filePath.includes('/watch')) {
      return 'video';
    } else if (filePath.includes('/view')) {
      return 'pdf';
    }
    
    return 'unknown';
  }
}

// 全局变量
let languageManager;
let cards = [];
let currentPreviewType = '';

document.addEventListener('DOMContentLoaded', function() {
  console.log('页面加载完成，开始初始化...');
  
  // 初始化语言管理器
  languageManager = new LanguageManager();
  
  // 页面导航功能
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      const targetId = this.getAttribute('href').substring(1);
      pageSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
          section.classList.add('active');
        }
      });
    });
  });

  // Gallery 功能初始化
  const gallery = document.querySelector('.gallery');
  const infoBox = document.getElementById('infoBox');
  const infoTitle = document.getElementById('infoTitle');
  const infoMeta = document.getElementById('infoMeta');
  const infoDescription = document.getElementById('infoDescription');
  const modal = document.getElementById('detailModal');
  const closeModal = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const pdfLinks = document.getElementById('pdfLinks');
  const videoLinks = document.getElementById('videoLinks');
  const pdfPreview = document.getElementById('pdfPreview');

  // 卡片数据 - 使用Canva链接
  const cardData = [
    {
      title: "Slago Vitat",
      title_cn: "",
      year: "2024",
      type: "VR Game",
      type_cn: "虚拟现实游戏",
      description: "Draw back the veils of time on vampire lore, and walk the world where echoes of immortality first stirred.",
      description_cn: "揭开吸血鬼尘封的历史，踏入不朽传说最初诞生的世界。",
      image: "images/work1.png",
      videos: [{ 
        name: "Gameplay Trailer", 
        path: ResourceManager.getCanvaLink("medias/work1.mp4", "video")
      }]
    },
    {
      title: "WorkZen",
      title_cn: "",
      year: "2023",
      type: "Wearable device",
      type_cn: "可穿戴装置",
      description: "A wearable for deep focus.",
      description_cn: "一款专注状态的穿戴作品。",
      image: "images/work2.png",
      pdfs: [{ 
        name: "Artistic Statement", 
        path: ResourceManager.getCanvaLink("medias/work2.pdf", "pdf")
      }],
      videos: [{ 
        name: "Sculpture Showcase", 
        path: ResourceManager.getCanvaLink("medias/work2.mp4", "video")
      }]
    },
    {
      title: "Know your Gut",
      title_cn: "了解你的肠道",
      year: "2025",
      type: "MR",
      type_cn: "混合现实游戏",
      description: "An extended reality installation that transforms physical spaces into interactive experiences.",
      description_cn: "将物理空间转化为互动体验的扩展现实装置艺术。",
      image: "images/work3.png",
      pdfs: [{ 
        name: "Installation Guide", 
        path: ResourceManager.getCanvaLink("medias/work3.pdf", "pdf")
      }],
      videos: [{ 
        name: "Experience Demo", 
        path: ResourceManager.getCanvaLink("medias/work3.mp4", "video")
      }]
    },
    {
      title: "Catopia",
      title_cn: "",
      year: "2022",
      type: "Integrated System Design",
      type_cn: "整合式系统设计",
      description: "An integrated solution for young solo cat owners, guiding them from rental to home setup and laying the foundation for a future cat owner community.",
      description_cn: "为独居青年猫主提供一个从租房到家居的一体化解决方案，旨在构建未来养猫社群生态的基石。",
      image: "images/work4.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work4.pdf", "pdf")
      }]
    },
    {
      title: "Kasama Project",
      title_cn: "",
      year: "2023",
      type: "Service Design",
      type_cn: "服务设计",
      description: "An exclusive and fun Easter event that leverages technology and service design to promote the Kasama story, enhance its local visibility, and foster new partnerships.",
      description_cn: "旨在通过科技与服务设计，打造一个独家而有趣的复活节活动，以此传播品牌故事、提升本地影响力并拓展合作伙伴",
      image: "images/work5.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work5.pdf", "pdf")
      }]
    },
    {
      title: "HK Deep Blue Oasis",
      title_cn: "香港深蓝绿洲",
      year: "2025",
      type: "VR",
      type_cn: "虚拟现实",
      description: "Reimagining our relationship with nature through speculative design.",
      description_cn: "一项探讨共生生态与城市韧性的思辨设计，旨在以崭新的信任与想象力重构人与自然的关系。",
      image: "images/work6.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work6.pdf", "pdf")
      }],
      videos: [{ 
        name: "Project Video", 
        path: ResourceManager.getCanvaLink("medias/work6.mp4", "video")
      }]
    },
    {
      title: "V-cuisine",
      title_cn: "",
      year: "2022",
      type: "Service Design",
      type_cn: "服务设计",
      description: "A VR application that promotes cross-cultural exchange through collaborative cooking.",
      description_cn: "一款VR美食文化应用，通过跨国界、跨文化的线上协作烹饪体验，让用户在虚拟厨房中深度理解并交流全球饮食文化。",
      image: "images/work7.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work7.pdf", "pdf")
      }]
    },
    {
      title: "The Oasis Garden",
      title_cn: "",
      year: "2023",
      type: "Social Ideology Design",
      type_cn: "社会思潮设计",
      description: "An art installation that translates ecofeminist philosophy into a surrealist sensory experience, designed to heal and provoke reflection on women and ecology.",
      description_cn: "一个将生态女性主义哲学转化为超现实主义感官体验的艺术装置，旨在疗愈并引发对女性与生态的关注。",
      image: "images/work8.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work8.pdf", "pdf")
      }]
    },
    {
      title: "Radiate",
      title_cn: "",
      year: "2021",
      type: "Interactive Installation",
      type_cn: "交互装置",
      description: "An interactive installation that visualizes invisible light pollution to raise public awareness of its harms.",
      description_cn: "一个将无形光污染可视化的交互装置，旨在提升公众对其危害的认知。",
      image: "images/work9.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work9.pdf", "pdf")
      }]
    },
    {
      title: "Escape from the future",
      title_cn: "",
      year: "2021",
      type: "Interaction space",
      type_cn: "交互投影空间",
      description: "We have created a parallel digital future world, immersing users to experience and reflect on the trade-offs behind technological convenience.",
      description_cn: "我们构建了一个未来的平行数字世界，旨在让用户亲身沉浸，体验科技便利背后的利弊并进行反思。",
      image: "images/work10.png",
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work10.pdf", "pdf")
      }],
      videos: [{ 
        name: "Project Video", 
        path: ResourceManager.getCanvaLink("medias/work10.mp4", "video")
      }]
    },
    {
      title: "Flushbound",
      title_cn: "",
      year: "2025",
      type: "VR Game",
      type_cn: "VR游戏",
      description: "A VR educational game that transforms the taboo of gut health into an engaging, stigma-free learning experience.",
      description_cn: "一款将肠道健康从尴尬话题转化为有趣、无羞耻学习体验的 VR 教育游戏。",
      image: "images/work11.png",
      videos: [{ 
        name: "Project Video", 
        path: ResourceManager.getCanvaLink("medias/work11.mp4", "video")
      }],
      pdfs: [{ 
        name: "Project Document", 
        path: ResourceManager.getCanvaLink("medias/work11.pdf", "pdf")
      }]
    }
  ];

  // 创建卡片
  function createCards() {
    if (!gallery) return;
    gallery.innerHTML = '';
    cards = [];
    
    cardData.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = `url('${data.image}')`;
      card.dataset.title = data.title;
      card.dataset.title_cn = data.title_cn || '';
      card.dataset.year = data.year;
      card.dataset.type = data.type;
      card.dataset.type_cn = data.type_cn;
      card.dataset.description = data.description;
      card.dataset.description_cn = data.description_cn;
      card.dataset.index = index;
      
      gallery.appendChild(card);
      cards.push(card);
    });
    
    positionCards();
    setupCardInteractions();
  }

  function positionCards() {
    const positions = [
      { x: -350, y: -100, z: -300 }, { x: -280, y: -80, z: -240 },
      { x: -210, y: -60, z: -180 }, { x: -140, y: -40, z: -120 },
      { x: -70, y: -20, z: -60 }, { x: 0, y: 0, z: 0 },
      { x: 70, y: 20, z: 60 }, { x: 140, y: 40, z: 120 },
      { x: 210, y: 60, z: 180 }, { x: 280, y: 80, z: 240 },
      { x: 350, y: 100, z: 300 }
    ];

    cards.forEach((card, index) => {
      if (positions[index]) {
        const pos = positions[index];
        const transform = `translateX(${pos.x}px) translateY(${pos.y}px) translateZ(${pos.z}px)`;
        card.style.transform = transform;
        card.setAttribute('data-original-transform', transform);
        card.setAttribute('data-position', JSON.stringify(pos));
        card.style.zIndex = index;
      }
    });
  }

  function setupCardInteractions() {
    cards.forEach((card, index) => {
      const originalTransform = card.getAttribute('data-original-transform');
      const originalPosition = JSON.parse(card.getAttribute('data-position'));

      card.addEventListener('mouseenter', function() {
        cards.forEach(c => {
          c.classList.remove('hovered');
          c.style.transform = c.getAttribute('data-original-transform');
          c.style.zIndex = parseInt(c.dataset.index);
        });

        this.classList.add('hovered');
        const hoverTransform = `translateX(${originalPosition.x}px) translateY(${originalPosition.y - 30}px) translateZ(${originalPosition.z}px)`;
        this.style.transform = hoverTransform;
        updateInfoBox(this);
      });

      card.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
        this.style.transform = originalTransform;
        this.style.zIndex = index;
      });

      card.addEventListener('click', function(e) {
        e.stopPropagation();
        const data = cardData[index];
        showProjectDetails(data);
      });
    });
  }

  function updateInfoBox(card) {
    if (!infoBox || !infoTitle || !infoMeta || !infoDescription) return;
    
    const title_cn = card.dataset.title_cn;
    const description_cn = card.dataset.description_cn;
    
    if (title_cn) {
      infoTitle.innerHTML = `${card.dataset.title}<br><span style="font-size: 0.8em; color: #666; font-weight: normal;">${title_cn}</span>`;
    } else {
      infoTitle.textContent = card.dataset.title;
    }
    
    infoMeta.innerHTML = `
      <span>${card.dataset.year}</span>
      <span>${card.dataset.type}<br><span style="font-size: 0.7em; color: #999;">${card.dataset.type_cn}</span></span>
    `;
    
    if (description_cn) {
      infoDescription.innerHTML = `
        ${card.dataset.description}
        <div style="height: 1px; background: #eee; margin: 8px 0;"></div>
        <span style="color: #666;">${description_cn}</span>
      `;
    } else {
      infoDescription.textContent = card.dataset.description;
    }
    
    infoBox.classList.add('show');
  }

  function showProjectDetails(data) {
    if (!modal) return;
    
    // 设置项目特定标题
    const modalTitle = document.getElementById('modalTitle');
    if (data.title_cn && languageManager.currentLang === 'zh') {
      modalTitle.textContent = data.title_cn;
    } else {
      modalTitle.textContent = data.title;
    }
    
    pdfLinks.innerHTML = '';
    videoLinks.innerHTML = '';
    pdfPreview.innerHTML = '';
    
    const resourcesSection = document.querySelector('.resources-section');
    const resourcesTitle = document.querySelector('.resources-section h3');
    const resourceTabs = document.querySelector('.resource-tabs');
    
    if (resourcesSection) resourcesSection.style.display = 'block';
    if (resourcesTitle) resourcesTitle.style.display = 'block';
    if (resourceTabs) resourceTabs.style.display = 'flex';
    
    const pdfs = Array.isArray(data.pdfs) ? data.pdfs : (data.pdfs ? [{ name: "Project Document", path: data.pdfs }] : []);
    const videos = Array.isArray(data.videos) ? data.videos : (data.videos ? [{ name: "Project Video", path: data.videos }] : []);
    
    const hasPDFs = pdfs.length > 0;
    const hasVideos = videos.length > 0;
    
    // 设置模态框资源数据并强制更新
    languageManager.setModalResources(pdfs, videos);
    languageManager.updateModalContent();
    
    if (hasPDFs && hasVideos) {
      setupResourceTabs(pdfs, videos);
      showPDFPreview(pdfs[0].path, pdfs[0].name);
      currentPreviewType = 'pdf';
    } else if (hasPDFs && !hasVideos) {
      if (resourceTabs) resourceTabs.style.display = 'none';
      showPDFPreview(pdfs[0].path, pdfs[0].name);
      currentPreviewType = 'pdf';
    } else if (!hasPDFs && hasVideos) {
      if (resourceTabs) resourceTabs.style.display = 'none';
      showVideoPreview(videos[0].path, videos[0].name);
      currentPreviewType = 'video';
    } else {
      if (resourcesSection) resourcesSection.style.display = 'none';
      pdfPreview.innerHTML = '<div id="noPreviewContent" class="no-preview" data-lang-zh="该项目暂无可用资源" data-lang-en="No resources available for this project">该项目暂无可用资源</div>';
      languageManager.collectTranslatableElements();
      languageManager.updateNoPreviewContent();
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function setupResourceTabs(pdfs, videos) {
    pdfLinks.innerHTML = '';
    videoLinks.innerHTML = '';
    
    const pdfTab = document.createElement('button');
    pdfTab.className = 'resource-tab active';
    pdfTab.setAttribute('data-type', 'pdf');
    
    const pdfText = languageManager.currentLang === 'zh' ? '文档' : 'Documents';
    pdfTab.innerHTML = `<span class="button-content">${pdfText} (${pdfs.length})</span>`;
    
    pdfTab.addEventListener('click', function(e) {
      e.preventDefault();
      if (pdfs.length > 0) {
        showPDFPreview(pdfs[0].path, pdfs[0].name);
        currentPreviewType = 'pdf';
        updateTabActiveState(this, 'pdf');
      }
    });
    
    if (pdfs.length === 0) pdfTab.disabled = true;
    pdfLinks.appendChild(pdfTab);
    
    const videoTab = document.createElement('button');
    videoTab.className = 'resource-tab';
    videoTab.setAttribute('data-type', 'video');
    
    const videoText = languageManager.currentLang === 'zh' ? '视频' : 'Videos';
    videoTab.innerHTML = `<span class="button-content">${videoText} (${videos.length})</span>`;
    
    videoTab.addEventListener('click', function(e) {
      e.preventDefault();
      if (videos.length > 0) {
        showVideoPreview(videos[0].path, videos[0].name);
        currentPreviewType = 'video';
        updateTabActiveState(this, 'video');
      }
    });
    
    if (videos.length === 0) videoTab.disabled = true;
    videoLinks.appendChild(videoTab);
  }

  function updateTabActiveState(clickedTab, type) {
    const allTabs = document.querySelectorAll('.resource-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
  }

  function showPDFPreview(pdfPath, pdfName) {
    const resourceType = ResourceManager.getResourceType(pdfPath);
    const canvaContentType = ResourceManager.getCanvaContentType(pdfPath);
    
    if (resourceType === 'canva' && canvaContentType === 'pdf') {
      // Canva PDF链接 - 使用嵌入iframe
      const embedUrl = ResourceManager.getCanvaEmbedUrl(pdfPath);
      pdfPreview.innerHTML = `
        <h4>📄 ${pdfName}</h4>
        <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; 
             padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); 
             margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
             border-radius: 8px; will-change: transform; background: #f8f9fa;">
          <iframe 
            loading="lazy" 
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;"
            src="${embedUrl}" 
            allowfullscreen="allowfullscreen" 
            allow="fullscreen"
            title="${pdfName}"
          >
          </iframe>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <a href="${pdfPath}" target="_blank" rel="noopener" class="resource-link" 
             style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; 
                    background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; 
                    text-decoration: none; color: #495057; font-size: 0.9em;">
            <span>在Canva中全屏查看</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      `;
    } else {
      // 本地PDF预览
      pdfPreview.innerHTML = `
        <h4>📄 ${pdfName}</h4>
        <iframe 
          src="${pdfPath}" 
          width="100%" 
          height="500" 
          style="border: 1px solid #e9ecef; border-radius: 8px;"
          title="${pdfName}"
        >
          您的浏览器不支持PDF预览，请<a href="${pdfPath}" target="_blank">下载PDF文件</a>
        </iframe>
      `;
    }
  }

  function showVideoPreview(videoPath, videoName) {
    const resourceType = ResourceManager.getResourceType(videoPath);
    const canvaContentType = ResourceManager.getCanvaContentType(videoPath);
    
    if (resourceType === 'canva' && canvaContentType === 'video') {
      // Canva视频链接 - 使用嵌入iframe
      const embedUrl = ResourceManager.getCanvaEmbedUrl(videoPath);
      pdfPreview.innerHTML = `
        <h4>🎬 ${videoName}</h4>
        <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; 
             padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); 
             margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
             border-radius: 8px; will-change: transform; background: #000;">
          <iframe 
            loading="lazy" 
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;"
            src="${embedUrl}" 
            allowfullscreen="allowfullscreen" 
            allow="fullscreen"
            title="${videoName}"
          >
          </iframe>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <a href="${videoPath}" target="_blank" rel="noopener" class="resource-link" 
             style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; 
                    background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; 
                    text-decoration: none; color: #495057; font-size: 0.9em;">
            <span>在Canva中全屏查看</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      `;
    } else {
      // 本地视频预览
      const videoExt = videoPath.split('.').pop().toLowerCase();
      const isMovFile = videoExt === 'mov';
      
      if (isMovFile) {
        pdfPreview.innerHTML = `
          <h4>🎬 ${videoName}</h4>
          <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
            <p style="margin-bottom: 20px; color: #666;">MOV格式视频文件</p>
            <a href="${videoPath}" class="resource-link" download style="display: inline-block; text-decoration: none;">
              下载视频文件
            </a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #999;">
              提示：MOV格式视频建议下载后使用本地播放器观看
            </p>
          </div>
        `;
      } else {
        pdfPreview.innerHTML = `
          <h4>🎬 ${videoName}</h4>
          <video 
            controls 
            width="100%" 
            style="border: 1px solid #e9ecef; border-radius: 8px; background: #000; max-height: 800px;"
          >
            <source src="${videoPath}" type="video/mp4">
            您的浏览器不支持视频播放，请<a href="${videoPath}" target="_blank">下载视频</a>
          </video>
          <div style="margin-top: 10px; text-align: center;">
            <a href="${videoPath}" class="resource-link" download style="display: inline-block; text-decoration: none; font-size: 0.9em;">
              下载视频
            </a>
          </div>
        `;
      }
    }
  }

  function resetModal() {
    const resourcesSection = document.querySelector('.resources-section');
    const resourcesTitle = document.querySelector('.resources-section h3');
    const resourceTabs = document.querySelector('.resource-tabs');
    
    if (resourcesSection) resourcesSection.style.display = 'block';
    if (resourcesTitle) {
      resourcesTitle.style.display = 'block';
      resourcesTitle.textContent = "Project Resources";
    }
    if (resourceTabs) resourceTabs.style.display = 'flex';
    
    const allTabs = document.querySelectorAll('.resource-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    if (allTabs[0]) allTabs[0].classList.add('active');
  }

  function closeModalHandler() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    resetModal();
  }

  // 事件监听
  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModalHandler();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModalHandler();
    }
  });

  function initInfoBox() {
    if (!infoBox || !infoTitle || !infoMeta || !infoDescription) return;
    infoBox.classList.add('show');
  }

  // 初始化
  createCards();
  setTimeout(initInfoBox, 1000);

  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      cards.forEach(card => {
        card.style.transform = 'none';
        card.style.zIndex = 'auto';
      });
    } else {
      positionCards();
    }
  });

  console.log('初始化完成');
});

  // 创建卡片
  function createCards() {
    if (!gallery) return;
    gallery.innerHTML = '';
    cards = [];
    
    cardData.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = `url('${data.image}')`;
      card.dataset.title = data.title;
      card.dataset.title_cn = data.title_cn || '';
      card.dataset.year = data.year;
      card.dataset.type = data.type;
      card.dataset.type_cn = data.type_cn;
      card.dataset.description = data.description;
      card.dataset.description_cn = data.description_cn;
      card.dataset.index = index;
      
      gallery.appendChild(card);
      cards.push(card);
    });
    
    positionCards();
    setupCardInteractions();
  }

  function positionCards() {
    const positions = [
      { x: -350, y: -100, z: -300 }, { x: -280, y: -80, z: -240 },
      { x: -210, y: -60, z: -180 }, { x: -140, y: -40, z: -120 },
      { x: -70, y: -20, z: -60 }, { x: 0, y: 0, z: 0 },
      { x: 70, y: 20, z: 60 }, { x: 140, y: 40, z: 120 },
      { x: 210, y: 60, z: 180 }, { x: 280, y: 80, z: 240 },
      { x: 350, y: 100, z: 300 }
    ];

    cards.forEach((card, index) => {
      if (positions[index]) {
        const pos = positions[index];
        const transform = `translateX(${pos.x}px) translateY(${pos.y}px) translateZ(${pos.z}px)`;
        card.style.transform = transform;
        card.setAttribute('data-original-transform', transform);
        card.setAttribute('data-position', JSON.stringify(pos));
        card.style.zIndex = index;
      }
    });
  }

  function setupCardInteractions() {
    cards.forEach((card, index) => {
      const originalTransform = card.getAttribute('data-original-transform');
      const originalPosition = JSON.parse(card.getAttribute('data-position'));

      card.addEventListener('mouseenter', function() {
        cards.forEach(c => {
          c.classList.remove('hovered');
          c.style.transform = c.getAttribute('data-original-transform');
          c.style.zIndex = parseInt(c.dataset.index);
        });

        this.classList.add('hovered');
        const hoverTransform = `translateX(${originalPosition.x}px) translateY(${originalPosition.y - 30}px) translateZ(${originalPosition.z}px)`;
        this.style.transform = hoverTransform;
        updateInfoBox(this);
      });

      card.addEventListener('mouseleave', function() {
        this.classList.remove('hovered');
        this.style.transform = originalTransform;
        this.style.zIndex = index;
      });

      card.addEventListener('click', function(e) {
        e.stopPropagation();
        const data = cardData[index];
        showProjectDetails(data);
      });
    });
  }

  function updateInfoBox(card) {
    if (!infoBox || !infoTitle || !infoMeta || !infoDescription) return;
    
    const title_cn = card.dataset.title_cn;
    const description_cn = card.dataset.description_cn;
    
    if (title_cn) {
      infoTitle.innerHTML = `${card.dataset.title}<br><span style="font-size: 0.8em; color: #666; font-weight: normal;">${title_cn}</span>`;
    } else {
      infoTitle.textContent = card.dataset.title;
    }
    
    infoMeta.innerHTML = `
      <span>${card.dataset.year}</span>
      <span>${card.dataset.type}<br><span style="font-size: 0.7em; color: #999;">${card.dataset.type_cn}</span></span>
    `;
    
    if (description_cn) {
      infoDescription.innerHTML = `
        ${card.dataset.description}
        <div style="height: 1px; background: #eee; margin: 8px 0;"></div>
        <span style="color: #666;">${description_cn}</span>
      `;
    } else {
      infoDescription.textContent = card.dataset.description;
    }
    
    infoBox.classList.add('show');
  }

  function showProjectDetails(data) {
    if (!modal) return;
    
    // 设置项目特定标题
    const modalTitle = document.getElementById('modalTitle');
    if (data.title_cn && languageManager.currentLang === 'zh') {
      modalTitle.textContent = data.title_cn;
    } else {
      modalTitle.textContent = data.title;
    }
    
    pdfLinks.innerHTML = '';
    videoLinks.innerHTML = '';
    pdfPreview.innerHTML = '';
    
    const resourcesSection = document.querySelector('.resources-section');
    const resourcesTitle = document.querySelector('.resources-section h3');
    const resourceTabs = document.querySelector('.resource-tabs');
    
    if (resourcesSection) resourcesSection.style.display = 'block';
    if (resourcesTitle) resourcesTitle.style.display = 'block';
    if (resourceTabs) resourceTabs.style.display = 'flex';
    
    const pdfs = Array.isArray(data.pdfs) ? data.pdfs : (data.pdfs ? [{ name: "Project Document", path: data.pdfs }] : []);
    const videos = Array.isArray(data.videos) ? data.videos : (data.videos ? [{ name: "Project Video", path: data.videos }] : []);
    
    const hasPDFs = pdfs.length > 0;
    const hasVideos = videos.length > 0;
    
    // 设置模态框资源数据并强制更新
    languageManager.setModalResources(pdfs, videos);
    languageManager.updateModalContent();
    
    if (hasPDFs && hasVideos) {
      setupResourceTabs(pdfs, videos);
      showPDFPreview(pdfs[0].path, pdfs[0].name);
      currentPreviewType = 'pdf';
    } else if (hasPDFs && !hasVideos) {
      if (resourceTabs) resourceTabs.style.display = 'none';
      showPDFPreview(pdfs[0].path, pdfs[0].name);
      currentPreviewType = 'pdf';
    } else if (!hasPDFs && hasVideos) {
      if (resourceTabs) resourceTabs.style.display = 'none';
      showVideoPreview(videos[0].path, videos[0].name);
      currentPreviewType = 'video';
    } else {
      if (resourcesSection) resourcesSection.style.display = 'none';
      pdfPreview.innerHTML = '<div id="noPreviewContent" class="no-preview" data-lang-zh="该项目暂无可用资源" data-lang-en="No resources available for this project">该项目暂无可用资源</div>';
      languageManager.collectTranslatableElements();
      languageManager.updateNoPreviewContent();
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function setupResourceTabs(pdfs, videos) {
    pdfLinks.innerHTML = '';
    videoLinks.innerHTML = '';
    
    const pdfTab = document.createElement('button');
    pdfTab.className = 'resource-tab active';
    pdfTab.setAttribute('data-type', 'pdf');
    
    const pdfText = languageManager.currentLang === 'zh' ? '文档' : 'Documents';
    pdfTab.innerHTML = `<span class="button-content">${pdfText} (${pdfs.length})</span>`;
    
    pdfTab.addEventListener('click', function(e) {
      e.preventDefault();
      if (pdfs.length > 0) {
        showPDFPreview(pdfs[0].path, pdfs[0].name);
        currentPreviewType = 'pdf';
        updateTabActiveState(this, 'pdf');
      }
    });
    
    if (pdfs.length === 0) pdfTab.disabled = true;
    pdfLinks.appendChild(pdfTab);
    
    const videoTab = document.createElement('button');
    videoTab.className = 'resource-tab';
    videoTab.setAttribute('data-type', 'video');
    
    const videoText = languageManager.currentLang === 'zh' ? '视频' : 'Videos';
    videoTab.innerHTML = `<span class="button-content">${videoText} (${videos.length})</span>`;
    
    videoTab.addEventListener('click', function(e) {
      e.preventDefault();
      if (videos.length > 0) {
        showVideoPreview(videos[0].path, videos[0].name);
        currentPreviewType = 'video';
        updateTabActiveState(this, 'video');
      }
    });
    
    if (videos.length === 0) videoTab.disabled = true;
    videoLinks.appendChild(videoTab);
  }

  function updateTabActiveState(clickedTab, type) {
    const allTabs = document.querySelectorAll('.resource-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
  }

  function showPDFPreview(pdfPath, pdfName) {
    const resourceType = ResourceManager.getResourceType(pdfPath);
    
    if (resourceType === 'canva') {
      // Canva链接 - 使用嵌入iframe
      pdfPreview.innerHTML = `
        <h4>📄 ${pdfName}</h4>
        <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; 
             padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); 
             margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
             border-radius: 8px; will-change: transform; background: #f8f9fa;">
          <iframe 
            loading="lazy" 
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;"
            src="${pdfPath}?embed" 
            allowfullscreen="allowfullscreen" 
            allow="fullscreen"
            title="${pdfName}"
          >
          </iframe>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <a href="${pdfPath}" target="_blank" rel="noopener" class="resource-link" 
             style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; 
                    background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; 
                    text-decoration: none; color: #495057; font-size: 0.9em;">
            <span>在Canva中全屏查看</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      `;
    } else {
      // 本地PDF预览
      pdfPreview.innerHTML = `
        <h4>📄 ${pdfName}</h4>
        <iframe 
          src="${pdfPath}" 
          width="100%" 
          height="500" 
          style="border: 1px solid #e9ecef; border-radius: 8px;"
          title="${pdfName}"
        >
          您的浏览器不支持PDF预览，请<a href="${pdfPath}" target="_blank">下载PDF文件</a>
        </iframe>
      `;
    }
  }

  function showVideoPreview(videoPath, videoName) {
    const resourceType = ResourceManager.getResourceType(videoPath);
    
    if (resourceType === 'canva') {
      // Canva链接 - 使用嵌入iframe
      pdfPreview.innerHTML = `
        <h4>🎬 ${videoName}</h4>
        <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%; 
             padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); 
             margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
             border-radius: 8px; will-change: transform; background: #000;">
          <iframe 
            loading="lazy" 
            style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0; margin: 0;"
            src="${videoPath}?embed" 
            allowfullscreen="allowfullscreen" 
            allow="fullscreen"
            title="${videoName}"
          >
          </iframe>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <a href="${videoPath}" target="_blank" rel="noopener" class="resource-link" 
             style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; 
                    background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; 
                    text-decoration: none; color: #495057; font-size: 0.9em;">
            <span>在Canva中全屏查看</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      `;
    } else {
      // 本地视频预览
      const videoExt = videoPath.split('.').pop().toLowerCase();
      const isMovFile = videoExt === 'mov';
      
      if (isMovFile) {
        pdfPreview.innerHTML = `
          <h4>🎬 ${videoName}</h4>
          <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
            <p style="margin-bottom: 20px; color: #666;">MOV格式视频文件</p>
            <a href="${videoPath}" class="resource-link" download style="display: inline-block; text-decoration: none;">
              下载视频文件
            </a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #999;">
              提示：MOV格式视频建议下载后使用本地播放器观看
            </p>
          </div>
        `;
      } else {
        pdfPreview.innerHTML = `
          <h4>🎬 ${videoName}</h4>
          <video 
            controls 
            width="100%" 
            style="border: 1px solid #e9ecef; border-radius: 8px; background: #000; max-height: 800px;"
          >
            <source src="${videoPath}" type="video/mp4">
            您的浏览器不支持视频播放，请<a href="${videoPath}" target="_blank">下载视频</a>
          </video>
          <div style="margin-top: 10px; text-align: center;">
            <a href="${videoPath}" class="resource-link" download style="display: inline-block; text-decoration: none; font-size: 0.9em;">
              下载视频
            </a>
          </div>
        `;
      }
    }
  }

  function resetModal() {
    const resourcesSection = document.querySelector('.resources-section');
    const resourcesTitle = document.querySelector('.resources-section h3');
    const resourceTabs = document.querySelector('.resource-tabs');
    
    if (resourcesSection) resourcesSection.style.display = 'block';
    if (resourcesTitle) {
      resourcesTitle.style.display = 'block';
      resourcesTitle.textContent = "Project Resources";
    }
    if (resourceTabs) resourceTabs.style.display = 'flex';
    
    const allTabs = document.querySelectorAll('.resource-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    if (allTabs[0]) allTabs[0].classList.add('active');
  }

  function closeModalHandler() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    resetModal();
  }

  // 事件监听
  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModalHandler();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModalHandler();
    }
  });

  function initInfoBox() {
    if (!infoBox || !infoTitle || !infoMeta || !infoDescription) return;
    infoBox.classList.add('show');
  }

  // 初始化
  createCards();
  setTimeout(initInfoBox, 1000);

  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      cards.forEach(card => {
        card.style.transform = 'none';
        card.style.zIndex = 'auto';
      });
    } else {
      positionCards();
    }
  });

  console.log('初始化完成');
