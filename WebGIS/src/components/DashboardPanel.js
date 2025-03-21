/**
 * 高铁站点WebGIS系统 - 仪表盘面板组件
 */

// 检查ECharts是否可用
if (typeof window.dashboardPanelEChartsAvailable === 'undefined') {
  window.dashboardPanelEChartsAvailable = typeof echarts !== 'undefined';
  if (!window.dashboardPanelEChartsAvailable) {
    console.warn('DashboardPanel: ECharts未加载，图表功能将不可用');
  }
}

/**
 * 安全地初始化或获取ECharts实例
 * @param {HTMLElement|string} container - 图表容器元素或ID
 * @returns {Object|null} ECharts实例或null
 */
function safeInitDashboardChart(container) {
  if (!window.dashboardPanelEChartsAvailable) {
    return null;
  }
  
  try {
    // 如果传入的是ID，获取对应的DOM元素
    const dom = typeof container === 'string' ? document.getElementById(container) : container;
    if (!dom) {
      console.warn('图表容器不存在:', container);
      return null;
    }
    
    // 尝试获取已有的实例，如果没有则创建新实例
    let chart = echarts.getInstanceByDom(dom);
    if (!chart) {
      chart = echarts.init(dom);
    }
    
    return chart;
  } catch (error) {
    console.error('初始化图表失败:', error);
    return null;
  }
}

/**
 * 创建左侧仪表盘面板
 * @returns {HTMLElement} 面板DOM元素
 */
function createDashboardPanel() {
  // 创建面板容器
  const panel = document.createElement('div');
  panel.id = 'left-panel';
  panel.className = 'panel left-panel';
  
  // 创建面板头部
  const header = document.createElement('div');
  header.className = 'panel-header';
  
  const title = document.createElement('div');
  title.className = 'panel-title';
  title.textContent = '高铁运行监控';
  
  const controls = document.createElement('div');
  controls.className = 'panel-controls';
  
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'panel-control-btn';
  refreshBtn.innerHTML = '&#x21bb;'; // 刷新图标
  refreshBtn.title = '刷新数据';
  refreshBtn.addEventListener('click', refreshDashboardData);
  
  controls.appendChild(refreshBtn);
  header.appendChild(title);
  header.appendChild(controls);
  
  // 创建面板切换按钮
  const toggle = document.createElement('div');
  toggle.id = 'left-panel-toggle';
  toggle.className = 'panel-toggle';
  toggle.innerHTML = '&lt;';
  toggle.addEventListener('click', function() {
    panel.classList.toggle('collapsed');
    toggle.innerHTML = panel.classList.contains('collapsed') ? '&gt;' : '&lt;';
  });
  
  // 创建标签页
  const tabs = document.createElement('div');
  tabs.className = 'panel-tabs';
  
  const overviewTab = document.createElement('div');
  overviewTab.className = 'panel-tab active';
  overviewTab.setAttribute('data-tab', 'overview');
  overviewTab.textContent = '概览';
  
  const linesTab = document.createElement('div');
  linesTab.className = 'panel-tab';
  linesTab.setAttribute('data-tab', 'lines');
  linesTab.textContent = '线路';
  
  const trainsTab = document.createElement('div');
  trainsTab.className = 'panel-tab';
  trainsTab.setAttribute('data-tab', 'trains');
  trainsTab.textContent = '列车';
  
  tabs.appendChild(overviewTab);
  tabs.appendChild(linesTab);
  tabs.appendChild(trainsTab);
  
  // 添加标签页点击事件
  tabs.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // 移除所有标签页的active类
      tabs.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      // 添加当前标签页的active类
      this.classList.add('active');
      
      // 获取当前标签页对应的内容
      const tabName = this.getAttribute('data-tab');
      
      // 隐藏所有内容
      content.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
      
      // 显示当前标签页对应的内容
      const currentContent = content.querySelector(`.tab-content[data-tab="${tabName}"]`);
      if (currentContent) {
        currentContent.style.display = 'block';
      }
      
      // 如果是图表，需要重新调整大小
      if (window.dashboardPanelEChartsAvailable) {
        const charts = currentContent.querySelectorAll('.chart-container');
        charts.forEach(chartContainer => {
          const chart = echarts.getInstanceByDom(chartContainer);
          if (chart) {
            chart.resize();
          }
        });
      }
    });
  });
  
  // 创建内容区域
  const content = document.createElement('div');
  content.className = 'panel-content';
  
  // 概览标签内容
  const overviewContent = document.createElement('div');
  overviewContent.className = 'tab-content';
  overviewContent.setAttribute('data-tab', 'overview');
  overviewContent.style.display = 'block';
  
  // 添加数据磁贴
  const dataTiles = document.createElement('div');
  dataTiles.className = 'data-tiles';
  
  // 运行列车数
  const trainsTile = document.createElement('div');
  trainsTile.className = 'data-tile';
  trainsTile.innerHTML = `
    <div class="data-tile-value" id="running-trains-value">0</div>
    <div class="data-tile-label">运行列车</div>
  `;
  
  // 准点率
  const punctualityTile = document.createElement('div');
  punctualityTile.className = 'data-tile';
  punctualityTile.innerHTML = `
    <div class="data-tile-value" id="punctuality-value">0%</div>
    <div class="data-tile-label">准点率</div>
  `;
  
  // 客流量
  const passengerTile = document.createElement('div');
  passengerTile.className = 'data-tile';
  passengerTile.innerHTML = `
    <div class="data-tile-value" id="passenger-value">0</div>
    <div class="data-tile-label">今日客流</div>
  `;
  
  // 平均速度
  const speedTile = document.createElement('div');
  speedTile.className = 'data-tile';
  speedTile.innerHTML = `
    <div class="data-tile-value" id="avg-speed-value">0</div>
    <div class="data-tile-label">平均速度 (km/h)</div>
  `;
  
  dataTiles.appendChild(trainsTile);
  dataTiles.appendChild(punctualityTile);
  dataTiles.appendChild(passengerTile);
  dataTiles.appendChild(speedTile);
  
  // 添加运行状态卡片
  const statusCard = document.createElement('div');
  statusCard.className = 'card';
  
  const statusHeader = document.createElement('div');
  statusHeader.className = 'card-header';
  statusHeader.textContent = '线路运行状态';
  
  const statusContent = document.createElement('div');
  statusContent.className = 'card-content';
  statusContent.id = 'line-status-container';
  
  statusCard.appendChild(statusHeader);
  statusCard.appendChild(statusContent);
  
  // 添加速度图表
  const speedChartCard = document.createElement('div');
  speedChartCard.className = 'card';
  
  const speedChartHeader = document.createElement('div');
  speedChartHeader.className = 'card-header';
  speedChartHeader.textContent = '实时速度监控';
  
  const speedChartContent = document.createElement('div');
  speedChartContent.className = 'card-content';
  
  const speedChartContainer = document.createElement('div');
  speedChartContainer.id = 'speed-chart';
  speedChartContainer.className = 'chart-container';
  
  speedChartContent.appendChild(speedChartContainer);
  speedChartCard.appendChild(speedChartHeader);
  speedChartCard.appendChild(speedChartContent);
  
  // 组装概览内容
  overviewContent.appendChild(dataTiles);
  overviewContent.appendChild(statusCard);
  overviewContent.appendChild(speedChartCard);
  
  // 线路标签内容
  const linesContent = document.createElement('div');
  linesContent.className = 'tab-content hidden';
  linesContent.setAttribute('data-tab', 'lines');
  linesContent.innerHTML = `
    <div class="card">
      <div class="card-header">线路列表</div>
      <div class="card-content">
        <div id="lines-list"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">线路客流量</div>
      <div class="card-content">
        <div id="line-passenger-chart" class="chart-container"></div>
      </div>
    </div>
  `;
  
  // 列车标签内容
  const trainsContent = document.createElement('div');
  trainsContent.className = 'tab-content hidden';
  trainsContent.setAttribute('data-tab', 'trains');
  trainsContent.innerHTML = `
    <div class="card">
      <div class="card-header">运行列车</div>
      <div class="card-content">
        <div id="trains-list"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">列车运行甘特图</div>
      <div class="card-content">
        <div id="train-gantt-chart" class="chart-container"></div>
      </div>
    </div>
  `;
  
  // 组装内容区域
  content.appendChild(overviewContent);
  content.appendChild(linesContent);
  content.appendChild(trainsContent);
  
  // 组装面板
  panel.appendChild(header);
  panel.appendChild(toggle);
  panel.appendChild(tabs);
  panel.appendChild(content);
  
  return panel;
}

/**
 * 刷新仪表盘数据
 */
function refreshDashboardData() {
  // 显示加载状态
  showLoading(true);
  
  // 获取数据
  fetch('/public/mock/line-status.json')
    .then(response => response.json())
    .then(data => {
      updateDashboardData(data);
      showLoading(false);
    })
    .catch(error => {
      console.error('获取数据失败:', error);
      showLoading(false);
    });
}

/**
 * 显示/隐藏加载状态
 * @param {boolean} isLoading - 是否正在加载
 */
function showLoading(isLoading) {
  const tiles = document.querySelectorAll('.data-tile-value');
  
  if (isLoading) {
    tiles.forEach(tile => {
      tile.classList.add('loading');
    });
  } else {
    tiles.forEach(tile => {
      tile.classList.remove('loading');
    });
  }
}

/**
 * 更新仪表盘数据
 * @param {Array} data - 线路状态数据
 */
function updateDashboardData(data) {
  if (!data || !Array.isArray(data)) return;
  
  // 计算汇总数据
  let totalTrains = 0;
  let totalPunctuality = 0;
  let totalPassengers = 0;
  let totalSpeed = 0;
  let lineCount = data.length;
  
  data.forEach(line => {
    totalTrains += line.trains.length;
    totalPunctuality += line.status.punctualityRate;
    totalPassengers += line.status.passengerLoad;
    totalSpeed += line.status.avgSpeed;
  });
  
  // 更新数据磁贴
  document.getElementById('running-trains-value').textContent = totalTrains;
  document.getElementById('punctuality-value').textContent = (totalPunctuality / lineCount).toFixed(1) + '%';
  document.getElementById('passenger-value').textContent = formatNumber(totalPassengers * 1000);
  document.getElementById('avg-speed-value').textContent = Math.round(totalSpeed / lineCount);
  
  // 更新线路状态列表
  updateLineStatusList(data);
  
  // 更新线路列表
  updateLinesList(data);
  
  // 更新列车列表
  updateTrainsList(data);
  
  // 更新图表
  if (window.echarts) {
    updateSpeedChart(data);
    updateLinePassengerChart(data);
    updateTrainGanttChart(data);
  }
}

/**
 * 更新线路状态列表
 * @param {Array} data - 线路状态数据
 */
function updateLineStatusList(data) {
  const container = document.getElementById('line-status-container');
  if (!container) return;
  
  let html = '';
  
  data.forEach(line => {
    const statusClass = getStatusClass(line.status.punctualityRate);
    
    html += `
      <div class="list-item" data-line-id="${line.lineId}">
        <div class="list-item-icon">
          <span class="status-indicator ${statusClass}"></span>
        </div>
        <div class="list-item-content">
          <div class="list-item-title">${line.lineName}</div>
          <div class="list-item-subtitle">
            运行列车: ${line.trains.length} | 
            客流量: ${line.status.passengerLoad}% | 
            平均速度: ${line.status.avgSpeed} km/h
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加点击事件
  const items = container.querySelectorAll('.list-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const lineId = item.getAttribute('data-line-id');
      highlightLine(lineId);
    });
  });
}

/**
 * 更新线路列表
 * @param {Array} data - 线路状态数据
 */
function updateLinesList(data) {
  const container = document.getElementById('lines-list');
  if (!container) return;
  
  let html = '';
  
  data.forEach(line => {
    html += `
      <div class="list-item" data-line-id="${line.lineId}">
        <div class="list-item-content">
          <div class="list-item-title">${line.lineName}</div>
          <div class="list-item-subtitle">
            准点率: ${line.status.punctualityRate}% | 
            客流量: ${line.status.passengerLoad}%
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加点击事件
  const items = container.querySelectorAll('.list-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const lineId = item.getAttribute('data-line-id');
      highlightLine(lineId);
    });
  });
}

/**
 * 更新列车列表
 * @param {Array} data - 线路状态数据
 */
function updateTrainsList(data) {
  const container = document.getElementById('trains-list');
  if (!container) return;
  
  let html = '';
  let allTrains = [];
  
  // 收集所有列车
  data.forEach(line => {
    line.trains.forEach(train => {
      allTrains.push({
        ...train,
        lineName: line.lineName,
        lineId: line.lineId
      });
    });
  });
  
  // 按列车ID排序
  allTrains.sort((a, b) => a.trainId.localeCompare(b.trainId));
  
  allTrains.forEach(train => {
    const statusClass = getDelayStatusClass(train.delayStatus);
    
    html += `
      <div class="list-item" data-train-id="${train.trainId}" data-line-id="${train.lineId}">
        <div class="list-item-icon">
          <span class="status-indicator ${statusClass}"></span>
        </div>
        <div class="list-item-content">
          <div class="list-item-title">${train.trainId}</div>
          <div class="list-item-subtitle">
            ${train.lineName} | 
            下一站: ${train.nextStation} (${train.arrivalTime}) | 
            当前速度: ${train.currentSpeed} km/h
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加点击事件
  const items = container.querySelectorAll('.list-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const trainId = item.getAttribute('data-train-id');
      const lineId = item.getAttribute('data-line-id');
      highlightTrain(trainId, lineId);
    });
  });
}

/**
 * 获取状态样式类
 * @param {number} punctualityRate - 准点率
 * @returns {string} 状态样式类
 */
function getStatusClass(punctualityRate) {
  if (punctualityRate >= 95) {
    return 'status-normal';
  } else if (punctualityRate >= 90) {
    return 'status-warning';
  } else {
    return 'status-error';
  }
}

/**
 * 获取延误状态样式类
 * @param {string} delayStatus - 延误状态
 * @returns {string} 状态样式类
 */
function getDelayStatusClass(delayStatus) {
  switch (delayStatus) {
    case 'normal':
      return 'status-normal';
    case 'delay':
      return 'status-error';
    case 'early':
      return 'status-warning';
    default:
      return 'status-normal';
  }
}

/**
 * 高亮显示线路
 * @param {string} lineId - 线路ID
 */
function highlightLine(lineId) {
  // 触发地图高亮事件
  if (window.MapEvents && typeof window.MapEvents.highlightLine === 'function') {
    window.MapEvents.highlightLine(lineId);
  }
  
  // 打开右侧面板显示详情
  if (window.PanelController) {
    window.PanelController.openPanel('right', 'statistics');
  }
}

/**
 * 高亮显示列车
 * @param {string} trainId - 列车ID
 * @param {string} lineId - 线路ID
 */
function highlightTrain(trainId, lineId) {
  // 触发地图高亮事件
  if (window.MapEvents && typeof window.MapEvents.highlightTrain === 'function') {
    window.MapEvents.highlightTrain(trainId, lineId);
  }
  
  // 打开右侧面板显示详情
  if (window.PanelController) {
    window.PanelController.openPanel('right', 'train-detail');
  }
}

/**
 * 格式化数字（添加千位分隔符）
 * @param {number} num - 数字
 * @returns {string} 格式化后的数字
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 更新速度图表
 * @param {Array} data - 线路数据
 */
function updateSpeedChart(data) {
  if (!window.dashboardPanelEChartsAvailable) {
    console.warn('updateSpeedChart: ECharts未加载，无法更新图表');
    return;
  }
  
  try {
    const chartContainer = document.getElementById('speed-chart');
    if (!chartContainer) return;
    
    let chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) {
      chart = echarts.init(chartContainer);
    }
    
    // 提取数据
    const lineNames = data.map(line => line.lineName);
    const avgSpeeds = data.map(line => line.status.avgSpeed);
    
    // 图表配置
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} km/h'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: lineNames,
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        name: '平均速度 (km/h)',
        min: 250
      },
      series: [
        {
          name: '平均速度',
          type: 'bar',
          data: avgSpeeds,
          itemStyle: {
            color: function(params) {
              // 根据速度值设置不同颜色
              const value = params.value;
              if (value >= 300) {
                return '#4caf50';
              } else if (value >= 280) {
                return '#2196f3';
              } else {
                return '#ff9800';
              }
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c} km/h'
          }
        }
      ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  } catch (error) {
    console.error('更新速度图表失败:', error);
  }
}

/**
 * 更新线路客流量图表
 * @param {Array} data - 线路状态数据
 */
function updateLinePassengerChart(data) {
  if (!window.dashboardPanelEChartsAvailable) {
    console.warn('updateLinePassengerChart: ECharts未加载，无法更新图表');
    return;
  }
  
  try {
    const chartContainer = document.getElementById('line-passenger-chart');
    if (!chartContainer) return;
    
    let chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) {
      chart = echarts.init(chartContainer);
    }
    
    // 准备数据
    const lineNames = data.map(line => line.lineName);
    const passengerData = data.map(line => line.status.passengerLoad);
    const capacityData = Array(data.length).fill(100); // 满载为100%
    
    // 设置图表选项
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const passengerLoad = params[0].value;
          return `${params[0].name}<br/>客流量: ${passengerLoad}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: lineNames,
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        name: '客流量 (%)',
        min: 0,
        max: 100
      },
      series: [
        {
          name: '客流量',
          type: 'bar',
          data: passengerData,
          itemStyle: {
            color: function(params) {
              const load = params.value;
              if (load >= 90) {
                return '#f44336';
              } else if (load >= 70) {
                return '#ff9800';
              } else {
                return '#4caf50';
              }
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%'
          }
        },
        {
          name: '满载线',
          type: 'line',
          data: capacityData,
          symbol: 'none',
          lineStyle: {
            color: '#f44336',
            type: 'dashed'
          }
        }
      ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  } catch (error) {
    console.error('更新线路客流量图表失败:', error);
  }
}

/**
 * 更新列车运行甘特图
 * @param {Array} data - 线路状态数据
 */
function updateTrainGanttChart(data) {
  const chartContainer = document.getElementById('train-gantt-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const trains = [];
  const categories = [];
  const chartData = [];
  
  // 收集所有线路作为分类
  data.forEach(line => {
    categories.push({
      name: line.lineName
    });
  });
  
  // 收集所有列车数据
  let index = 0;
  data.forEach((line, lineIndex) => {
    line.trains.forEach(train => {
      trains.push(train.trainId);
      
      // 模拟甘特图数据
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - 2);
      
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);
      
      chartData.push({
        name: train.trainId,
        value: [
          lineIndex,
          startTime.getTime(),
          endTime.getTime(),
          4 // 持续时间（小时）
        ],
        itemStyle: {
          color: getDelayStatusColor(train.delayStatus)
        }
      });
      
      index++;
    });
  });
  
  // 设置图表选项
  const option = {
    tooltip: {
      formatter: function(params) {
        const train = params.name;
        const category = categories[params.value[0]].name;
        const startTime = new Date(params.value[1]).toLocaleTimeString();
        const endTime = new Date(params.value[2]).toLocaleTimeString();
        
        return `
          <div>${train}</div>
          <div>线路: ${category}</div>
          <div>时间: ${startTime} - ${endTime}</div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: function(value) {
          return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
      }
    },
    yAxis: {
      type: 'category',
      data: categories.map(c => c.name)
    },
    series: [
      {
        type: 'custom',
        renderItem: function(params, api) {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = api.size([0, 1])[1] * 0.6;
          
          const rectShape = echarts.graphic.clipRectByRect(
            {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height
            },
            {
              x: params.coordSys.x,
              y: params.coordSys.y,
              width: params.coordSys.width,
              height: params.coordSys.height
            }
          );
          
          return rectShape && {
            type: 'rect',
            shape: rectShape,
            style: api.style()
          };
        },
        data: chartData
      }
    ]
  };
  
  // 设置图表
  chart.setOption(option);
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    chart.resize();
  });
}

/**
 * 获取延误状态颜色
 * @param {string} delayStatus - 延误状态
 * @returns {string} 颜色代码
 */
function getDelayStatusColor(delayStatus) {
  switch (delayStatus) {
    case 'normal':
      return '#4caf50';
    case 'delay':
      return '#f44336';
    case 'early':
      return '#ff9800';
    default:
      return '#2196f3';
  }
}

// 导出组件
window.DashboardPanel = {
  create: createDashboardPanel,
  refresh: refreshDashboardData,
  update: updateDashboardData
}; 