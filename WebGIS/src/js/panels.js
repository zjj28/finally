/**
 * 高铁站点WebGIS系统 - 面板控制模块
 */

// 面板状态
const panelState = {
  leftPanel: {
    isOpen: true,
    activeTab: 'overview'
  },
  rightPanel: {
    isOpen: false,
    activeTab: 'statistics'
  }
};

// DOM元素引用
let leftPanel, rightPanel, leftToggle, rightToggle;
let leftTabs, rightTabs;

/**
 * 初始化面板
 */
function initPanels() {
  // 获取DOM元素
  leftPanel = document.getElementById('left-panel');
  rightPanel = document.getElementById('right-panel');
  leftToggle = document.getElementById('left-panel-toggle');
  rightToggle = document.getElementById('right-panel-toggle');
  
  // 初始化面板状态
  updatePanelState();
  
  // 添加事件监听
  if (leftToggle) {
    leftToggle.addEventListener('click', toggleLeftPanel);
  }
  
  if (rightToggle) {
    rightToggle.addEventListener('click', toggleRightPanel);
  }
  
  // 初始化标签页
  initTabs();
  
  // 添加移动端手势支持
  addTouchGestures();
  
  // 添加响应式调整
  addResponsiveHandlers();
}

/**
 * 更新面板状态
 */
function updatePanelState() {
  if (leftPanel) {
    if (panelState.leftPanel.isOpen) {
      leftPanel.classList.remove('collapsed');
    } else {
      leftPanel.classList.add('collapsed');
    }
  }
  
  if (rightPanel) {
    if (panelState.rightPanel.isOpen) {
      rightPanel.classList.remove('collapsed');
    } else {
      rightPanel.classList.add('collapsed');
    }
  }
}

/**
 * 切换左侧面板
 */
function toggleLeftPanel() {
  panelState.leftPanel.isOpen = !panelState.leftPanel.isOpen;
  updatePanelState();
  
  // 更新切换按钮图标
  if (leftToggle) {
    leftToggle.innerHTML = panelState.leftPanel.isOpen ? '&lt;' : '&gt;';
  }
}

/**
 * 切换右侧面板
 */
function toggleRightPanel() {
  panelState.rightPanel.isOpen = !panelState.rightPanel.isOpen;
  updatePanelState();
  
  // 更新切换按钮图标
  if (rightToggle) {
    rightToggle.innerHTML = panelState.rightPanel.isOpen ? '&gt;' : '&lt;';
  }
}

/**
 * 初始化标签页
 */
function initTabs() {
  // 左侧面板标签页
  leftTabs = document.querySelectorAll('#left-panel .panel-tab');
  leftTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      setActiveTab('left', tabId);
    });
  });
  
  // 右侧面板标签页
  rightTabs = document.querySelectorAll('#right-panel .panel-tab');
  rightTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      setActiveTab('right', tabId);
    });
  });
  
  // 设置初始活动标签页
  setActiveTab('left', panelState.leftPanel.activeTab);
  setActiveTab('right', panelState.rightPanel.activeTab);
}

/**
 * 设置活动标签页
 * @param {string} panel - 面板位置 ('left' 或 'right')
 * @param {string} tabId - 标签页ID
 */
function setActiveTab(panel, tabId) {
  const tabs = panel === 'left' ? leftTabs : rightTabs;
  const contents = document.querySelectorAll(`#${panel}-panel .tab-content`);
  
  // 更新标签页状态
  tabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // 更新内容区域
  contents.forEach(content => {
    if (content.getAttribute('data-tab') === tabId) {
      content.classList.remove('hidden');
    } else {
      content.classList.add('hidden');
    }
  });
  
  // 更新状态
  if (panel === 'left') {
    panelState.leftPanel.activeTab = tabId;
  } else {
    panelState.rightPanel.activeTab = tabId;
  }
}

/**
 * 添加移动端手势支持
 */
function addTouchGestures() {
  const leftTrigger = document.querySelector('.left-trigger-area');
  const rightTrigger = document.querySelector('.right-trigger-area');
  
  if (leftTrigger) {
    let startX = 0;
    
    leftTrigger.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    leftTrigger.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      
      if (diff > 50 && !panelState.leftPanel.isOpen) {
        toggleLeftPanel();
      }
    });
  }
  
  if (rightTrigger) {
    let startX = 0;
    
    rightTrigger.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    rightTrigger.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      if (diff > 50 && !panelState.rightPanel.isOpen) {
        toggleRightPanel();
      }
    });
  }
}

/**
 * 添加响应式处理
 */
function addResponsiveHandlers() {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  // 初始检查
  handleMediaQueryChange(mediaQuery);
  
  // 添加监听
  mediaQuery.addEventListener('change', handleMediaQueryChange);
}

/**
 * 处理媒体查询变化
 * @param {MediaQueryListEvent} e - 媒体查询事件
 */
function handleMediaQueryChange(e) {
  if (e.matches) {
    // 移动设备 - 默认关闭面板
    if (panelState.leftPanel.isOpen && panelState.rightPanel.isOpen) {
      // 如果两个面板都打开，关闭右侧面板
      panelState.rightPanel.isOpen = false;
      updatePanelState();
    }
  }
}

/**
 * 打开指定面板
 * @param {string} panel - 面板位置 ('left' 或 'right')
 * @param {string} [tab] - 可选，要激活的标签页ID
 */
function openPanel(panel, tab) {
  if (panel === 'left') {
    panelState.leftPanel.isOpen = true;
    if (tab) {
      setActiveTab('left', tab);
    }
  } else if (panel === 'right') {
    panelState.rightPanel.isOpen = true;
    if (tab) {
      setActiveTab('right', tab);
    }
  }
  
  updatePanelState();
}

/**
 * 关闭指定面板
 * @param {string} panel - 面板位置 ('left' 或 'right')
 */
function closePanel(panel) {
  if (panel === 'left') {
    panelState.leftPanel.isOpen = false;
  } else if (panel === 'right') {
    panelState.rightPanel.isOpen = false;
  }
  
  updatePanelState();
}

// 导出面板控制函数
window.PanelController = {
  init: initPanels,
  toggleLeft: toggleLeftPanel,
  toggleRight: toggleRightPanel,
  openPanel: openPanel,
  closePanel: closePanel,
  setActiveTab: setActiveTab
}; 