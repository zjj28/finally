/**
 * 高铁站点WebGIS系统 - 应用主入口
 */

console.log('app.js开始加载...');

// 应用状态
const appState = {
  isLoading: true,
  isMapReady: false,
  isPanelsReady: false,
  isDataReady: false,
  error: null
};

// 刷新计时器
let refreshTimer = null;
const REFRESH_INTERVAL = 60000; // 60秒刷新一次

/**
 * 初始化应用
 */
function initApp() {
  console.log('初始化高铁站点WebGIS系统...');
  
  // 显示加载状态
  showLoading(true, '正在初始化应用...');
  
  // 检查必要的依赖
  if (!window.AMap) {
    showError('高德地图API加载失败，请检查网络连接或API密钥');
    return;
  }
  
  if (!window.echarts) {
    console.warn('ECharts未加载，部分图表功能可能不可用');
  }
  
  // 直接初始化面板
  initPanels();
  
  // 等待地图初始化完成
  waitForMap();
}

/**
 * 加载脚本
 * @param {string} url - 脚本URL
 * @returns {Promise} - Promise对象
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`加载脚本失败: ${url}`));
    
    document.head.appendChild(script);
  });
}

/**
 * 等待地图初始化完成
 */
function waitForMap() {
  showLoading(true, '正在等待地图初始化...');
  
  // 设置超时
  const timeout = setTimeout(() => {
    showError('地图初始化超时，请刷新页面重试');
  }, 10000);
  
  // 检查地图是否已初始化
  const checkMap = () => {
    if (window.map) {
      clearTimeout(timeout);
      appState.isMapReady = true;
      console.log('地图初始化完成');
      
      // 初始化地图事件
      if (window.MapEvents) {
        MapEvents.init();
      }
      
      // 加载数据
      loadData();
    } else {
      setTimeout(checkMap, 500);
    }
  };
  
  checkMap();
}

/**
 * 初始化面板
 */
function initPanels() {
  showLoading(true, '正在初始化面板...');
  
  try {
    // 创建左侧面板
    if (window.DashboardPanel) {
      const leftPanel = DashboardPanel.create();
      document.body.appendChild(leftPanel);
    }
    
    // 创建右侧面板
    if (window.StatisticsPanel) {
      const rightPanel = StatisticsPanel.create();
      document.body.appendChild(rightPanel);
    }
    
    // 初始化面板控制器
    if (window.PanelController) {
      PanelController.init();
    }
    
    appState.isPanelsReady = true;
    console.log('面板初始化完成');
    
    // 添加触发区域
    addTriggerAreas();
  } catch (error) {
    console.error('初始化面板失败:', error);
    showError('初始化面板失败，请刷新页面重试');
  }
}

/**
 * 添加触发区域
 */
function addTriggerAreas() {
  // 左侧触发区域
  const leftTrigger = document.createElement('div');
  leftTrigger.className = 'panel-trigger-area left-trigger-area';
  document.body.appendChild(leftTrigger);
  
  // 右侧触发区域
  const rightTrigger = document.createElement('div');
  rightTrigger.className = 'panel-trigger-area right-trigger-area';
  document.body.appendChild(rightTrigger);
}

/**
 * 加载数据
 */
function loadData() {
  showLoading(true, '正在加载数据...');
  
  // 加载线路状态数据
  fetch('/public/mock/line-status.json')
    .then(response => response.json())
    .then(lineData => {
      console.log('线路状态数据加载成功');
      
      // 加载客流数据
      return fetch('/public/mock/passenger-flow.json')
        .then(response => response.json())
        .then(passengerData => {
          console.log('客流数据加载成功');
          
          // 更新面板数据
          updatePanelsData(lineData, passengerData);
          
          appState.isDataReady = true;
          appState.isLoading = false;
          
          // 隐藏加载状态
          showLoading(false);
          
          // 设置刷新定时器
          setRefreshTimer();
        });
    })
    .catch(error => {
      console.error('加载数据失败:', error);
      showError('加载数据失败，请检查网络连接后重试');
    });
}

/**
 * 更新面板数据
 * @param {Array} lineData - 线路状态数据
 * @param {Object} passengerData - 客流数据
 */
function updatePanelsData(lineData, passengerData) {
  try {
    // 更新左侧面板
    if (window.DashboardPanel) {
      DashboardPanel.update(lineData);
    }
    
    // 更新右侧面板
    if (window.StatisticsPanel) {
      StatisticsPanel.update(lineData, passengerData);
    }
    
    // 注释掉可能导致问题的热力图代码
    /*
    // 使用图表格式化工具处理数据
    if (window.ChartFormatters && passengerData.stations) {
      // 转换为热力图数据
      const heatmapData = window.ChartFormatters.convertGeoJSONToHeatmapData({
        type: 'FeatureCollection',
        features: passengerData.stations.map(station => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [station.longitude, station.latitude]
          },
          properties: {
            value: station.passengerCount
          }
        }))
      });
      
      // 更新热力图层
      if (typeof updateHeatmap === 'function' && heatmapData.length > 0) {
        updateHeatmap(heatmapData);
      }
    }
    */
  } catch (error) {
    console.error('更新面板数据失败:', error);
  }
}

/**
 * 设置刷新计时器
 */
function setRefreshTimer() {
  // 清除现有计时器
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  
  // 设置新计时器
  refreshTimer = setInterval(() => {
    refreshData();
  }, REFRESH_INTERVAL);
  
  console.log(`数据刷新计时器已设置，间隔: ${REFRESH_INTERVAL / 1000}秒`);
}

/**
 * 刷新数据
 */
function refreshData() {
  console.log('刷新数据...');
  
  // 获取线路状态数据
  fetch('/public/mock/line-status.json')
    .then(response => response.json())
    .then(lineData => {
      // 获取客流数据
      return fetch('/public/mock/passenger-flow.json')
        .then(response => response.json())
        .then(passengerData => {
          // 更新面板数据
          updatePanelsData(lineData, passengerData);
        });
    })
    .catch(error => {
      console.error('刷新数据失败:', error);
    });
}

/**
 * 显示/隐藏加载状态
 * @param {boolean} isLoading - 是否正在加载
 * @param {string} [message] - 加载消息
 */
function showLoading(isLoading, message) {
  const loadingContainer = document.getElementById('loading-container');
  const loadingText = document.getElementById('loading-text');
  
  if (!loadingContainer) return;
  
  appState.isLoading = isLoading;
  
  if (isLoading) {
    loadingContainer.classList.remove('hidden');
    if (loadingText && message) {
      loadingText.textContent = message;
    }
  } else {
    loadingContainer.classList.add('hidden');
  }
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.querySelector('.error-message p');
  const retryButton = document.getElementById('retry-button');
  
  if (!errorContainer || !errorMessage) return;
  
  appState.error = message;
  appState.isLoading = false;
  
  // 隐藏加载状态
  showLoading(false);
  
  // 显示错误消息
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
  
  // 添加重试按钮事件
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      errorContainer.classList.add('hidden');
      initApp();
    });
  }
}

/**
 * 处理窗口加载完成事件
 */
function handleWindowLoad() {
  // 初始化应用
  initApp();
}

// 监听窗口加载完成事件
window.addEventListener('load', handleWindowLoad);

// 导出应用控制函数
window.AppController = {
  init: initApp,
  refresh: refreshData,
  getState: () => ({ ...appState })
};

/**
 * 更新热力图层
 */
function updateHeatmap(data) {
  if (!window.map) return;
  
  try {
    // 检查是否已存在热力图层
    let heatmap = window.map.getAllOverlays('heatmap')[0];
    
    if (heatmap) {
      // 更新现有热力图数据
      heatmap.setDataSet({
        data: data,
        max: 100
      });
    } else {
      // 创建新的热力图层
      heatmap = new AMap.HeatMap(window.map, {
        radius: 25,
        opacity: [0, 0.8],
        gradient: {
          0.4: 'rgb(0, 255, 255)',
          0.65: 'rgb(0, 110, 255)',
          0.85: 'rgb(100, 0, 255)',
          1.0: 'rgb(200, 0, 255)'
        }
      });
      
      // 设置数据
      heatmap.setDataSet({
        data: data,
        max: 100
      });
    }
  } catch (error) {
    console.warn('更新热力图失败:', error);
  }
} 