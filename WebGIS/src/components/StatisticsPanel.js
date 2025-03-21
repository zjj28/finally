/**
 * 高铁站点WebGIS系统 - 统计面板组件
 */

// 检查ECharts是否可用
if (typeof window.statisticsPanelEChartsAvailable === 'undefined') {
  window.statisticsPanelEChartsAvailable = typeof echarts !== 'undefined';
  if (!window.statisticsPanelEChartsAvailable) {
    console.warn('StatisticsPanel: ECharts未加载，图表功能将不可用');
  }
}

/**
 * 安全地初始化或获取ECharts实例
 * @param {HTMLElement|string} container - 图表容器元素或ID
 * @returns {Object|null} ECharts实例或null
 */
function safeInitChart(container) {
  if (!window.statisticsPanelEChartsAvailable) {
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
 * 创建右侧统计面板
 * @returns {HTMLElement} 面板DOM元素
 */
function createStatisticsPanel() {
  // 创建面板容器
  const panel = document.createElement('div');
  panel.id = 'right-panel';
  panel.className = 'panel right-panel collapsed';
  
  // 创建面板头部
  const header = document.createElement('div');
  header.className = 'panel-header';
  
  const title = document.createElement('div');
  title.className = 'panel-title';
  title.textContent = '数据分析';
  
  const controls = document.createElement('div');
  controls.className = 'panel-controls';
  
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'panel-control-btn';
  refreshBtn.innerHTML = '&#x21bb;'; // 刷新图标
  refreshBtn.title = '刷新数据';
  refreshBtn.addEventListener('click', refreshStatisticsData);
  
  controls.appendChild(refreshBtn);
  header.appendChild(title);
  header.appendChild(controls);
  
  // 创建面板切换按钮
  const toggle = document.createElement('div');
  toggle.id = 'right-panel-toggle';
  toggle.className = 'panel-toggle';
  toggle.innerHTML = '&gt;';
  toggle.addEventListener('click', function() {
    panel.classList.toggle('collapsed');
    toggle.innerHTML = panel.classList.contains('collapsed') ? '&lt;' : '&gt;';
  });
  
  // 创建标签页
  const tabs = document.createElement('div');
  tabs.className = 'panel-tabs';
  
  const statisticsTab = document.createElement('div');
  statisticsTab.className = 'panel-tab active';
  statisticsTab.setAttribute('data-tab', 'statistics');
  statisticsTab.textContent = '统计';
  
  const trendTab = document.createElement('div');
  trendTab.className = 'panel-tab';
  trendTab.setAttribute('data-tab', 'trend');
  trendTab.textContent = '趋势';
  
  const trainDetailTab = document.createElement('div');
  trainDetailTab.className = 'panel-tab';
  trainDetailTab.setAttribute('data-tab', 'train-detail');
  trainDetailTab.textContent = '列车详情';
  
  tabs.appendChild(statisticsTab);
  tabs.appendChild(trendTab);
  tabs.appendChild(trainDetailTab);
  
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
      if (window.statisticsPanelEChartsAvailable) {
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
  
  // 统计标签内容
  const statisticsContent = document.createElement('div');
  statisticsContent.className = 'tab-content';
  statisticsContent.setAttribute('data-tab', 'statistics');
  statisticsContent.style.display = 'block';
  
  // 添加客流热力图
  const heatmapCard = document.createElement('div');
  heatmapCard.className = 'card';
  
  const heatmapHeader = document.createElement('div');
  heatmapHeader.className = 'card-header';
  heatmapHeader.textContent = '客流热力图';
  
  const heatmapContent = document.createElement('div');
  heatmapContent.className = 'card-content';
  
  const heatmapContainer = document.createElement('div');
  heatmapContainer.id = 'passenger-heatmap';
  heatmapContainer.className = 'chart-container';
  heatmapContainer.style.height = '300px';
  
  heatmapContent.appendChild(heatmapContainer);
  heatmapCard.appendChild(heatmapHeader);
  heatmapCard.appendChild(heatmapContent);
  
  // 添加站点客流排行
  const stationRankCard = document.createElement('div');
  stationRankCard.className = 'card';
  
  const stationRankHeader = document.createElement('div');
  stationRankHeader.className = 'card-header';
  stationRankHeader.textContent = '站点客流排行';
  
  const stationRankContent = document.createElement('div');
  stationRankContent.className = 'card-content';
  
  const stationRankContainer = document.createElement('div');
  stationRankContainer.id = 'station-rank-chart';
  stationRankContainer.className = 'chart-container';
  
  stationRankContent.appendChild(stationRankContainer);
  stationRankCard.appendChild(stationRankHeader);
  stationRankCard.appendChild(stationRankContent);
  
  // 组装统计内容
  statisticsContent.appendChild(heatmapCard);
  statisticsContent.appendChild(stationRankCard);
  
  // 趋势标签内容
  const trendContent = document.createElement('div');
  trendContent.className = 'tab-content hidden';
  trendContent.setAttribute('data-tab', 'trend');
  trendContent.innerHTML = `
    <div class="card">
      <div class="card-header">日客流趋势</div>
      <div class="card-content">
        <div id="daily-trend-chart" class="chart-container"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">小时客流分布</div>
      <div class="card-content">
        <div id="hourly-trend-chart" class="chart-container"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">线路负载率</div>
      <div class="card-content">
        <div id="line-load-chart" class="chart-container"></div>
      </div>
    </div>
  `;
  
  // 列车详情标签内容
  const trainDetailContent = document.createElement('div');
  trainDetailContent.className = 'tab-content hidden';
  trainDetailContent.setAttribute('data-tab', 'train-detail');
  trainDetailContent.innerHTML = `
    <div class="card">
      <div class="card-header">列车信息</div>
      <div class="card-content">
        <div id="train-info-container"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">速度曲线</div>
      <div class="card-content">
        <div id="train-speed-chart" class="chart-container"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">停靠站点</div>
      <div class="card-content">
        <div id="train-stations-list"></div>
      </div>
    </div>
  `;
  
  // 组装内容区域
  content.appendChild(statisticsContent);
  content.appendChild(trendContent);
  content.appendChild(trainDetailContent);
  
  // 组装面板
  panel.appendChild(header);
  panel.appendChild(toggle);
  panel.appendChild(tabs);
  panel.appendChild(content);
  
  return panel;
}

/**
 * 刷新统计数据
 */
function refreshStatisticsData() {
  // 显示加载状态
  showLoading(true);
  
  // 获取数据
  Promise.all([
    fetch('/public/mock/line-status.json').then(response => response.json()),
    fetch('/public/mock/passenger-flow.json').then(response => response.json())
  ])
    .then(([lineData, passengerData]) => {
      updateStatisticsData(lineData, passengerData);
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
  const charts = document.querySelectorAll('.chart-container');
  
  if (isLoading) {
    charts.forEach(chart => {
      chart.classList.add('loading');
    });
  } else {
    charts.forEach(chart => {
      chart.classList.remove('loading');
    });
  }
}

/**
 * 更新统计数据
 * @param {Array} lineData - 线路状态数据
 * @param {Object} passengerData - 客流数据
 */
function updateStatisticsData(lineData, passengerData) {
  if (!lineData || !Array.isArray(lineData) || !passengerData) return;
  
  // 更新图表
  if (window.echarts) {
    updatePassengerHeatmap(lineData);
    updateStationRankChart(passengerData.byStation);
    updateDailyTrendChart(passengerData.daily);
    updateHourlyTrendChart(passengerData.hourly);
    updateLineLoadChart(passengerData.byLine);
  }
}

/**
 * 更新客流热力图
 * @param {Array} lineData - 线路状态数据
 */
function updatePassengerHeatmap(lineData) {
  const chartContainer = document.getElementById('passenger-heatmap');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const data = [];
  
  // 模拟热力图数据点
  lineData.forEach(line => {
    line.trains.forEach(train => {
      const position = train.position;
      if (position && position.length === 2) {
        data.push({
          value: [position[0], position[1], line.status.passengerLoad]
        });
      }
    });
  });
  
  // 设置图表选项
  const option = {
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      text: ['高', '低'],
      inRange: {
        color: ['#50a3ba', '#eac736', '#d94e5d']
      }
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      center: [104, 34],
      itemStyle: {
        areaColor: '#eee',
        borderColor: '#ccc'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#ddd'
        }
      }
    },
    series: [
      {
        name: '客流热力',
        type: 'heatmap',
        coordinateSystem: 'geo',
        data: data,
        pointSize: 8,
        blurSize: 12
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
 * 更新站点客流排行图表
 * @param {Array} stationData - 站点客流数据
 */
function updateStationRankChart(stationData) {
  const chartContainer = document.getElementById('station-rank-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const stationNames = [];
  const passengerData = [];
  
  // 按客流量排序
  stationData.sort((a, b) => b.count - a.count);
  
  // 取前6个站点
  stationData.slice(0, 6).forEach(station => {
    stationNames.push(station.name);
    passengerData.push(station.count);
  });
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 人次'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '客流量 (人次)'
    },
    yAxis: {
      type: 'category',
      data: stationNames.reverse(),
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        name: '客流量',
        type: 'bar',
        data: passengerData.reverse(),
        itemStyle: {
          color: function(params) {
            const colorList = ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0', '#795548'];
            return colorList[params.dataIndex % colorList.length];
          }
        }
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
 * 更新日客流趋势图表
 * @param {Array} dailyData - 日客流数据
 */
function updateDailyTrendChart(dailyData) {
  const chartContainer = document.getElementById('daily-trend-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const dates = [];
  const counts = [];
  
  dailyData.forEach(item => {
    dates.push(item.date);
    counts.push(item.count);
  });
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c} 人次'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: function(value) {
          return value.substring(5); // 只显示月-日
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '客流量 (人次)'
    },
    series: [
      {
        name: '客流量',
        type: 'line',
        data: counts,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#1976d2'
        },
        itemStyle: {
          color: '#1976d2'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(25, 118, 210, 0.5)'
              },
              {
                offset: 1,
                color: 'rgba(25, 118, 210, 0.1)'
              }
            ]
          }
        }
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
 * 更新小时客流分布图表
 * @param {Array} hourlyData - 小时客流数据
 */
function updateHourlyTrendChart(hourlyData) {
  const chartContainer = document.getElementById('hourly-trend-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const hours = [];
  const counts = [];
  
  hourlyData.forEach(item => {
    hours.push(item.hour);
    counts.push(item.count);
  });
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>{a}: {c} 人次'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLabel: {
        interval: 1
      }
    },
    yAxis: {
      type: 'value',
      name: '客流量 (人次)'
    },
    series: [
      {
        name: '客流量',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: function(params) {
            const hour = parseInt(params.name.split(':')[0]);
            if (hour >= 6 && hour < 9) {
              return '#f44336'; // 早高峰
            } else if (hour >= 17 && hour < 20) {
              return '#f44336'; // 晚高峰
            } else if (hour >= 9 && hour < 17) {
              return '#2196f3'; // 工作时间
            } else {
              return '#9e9e9e'; // 夜间
            }
          }
        }
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
 * 更新线路负载率图表
 * @param {Array} lineData - 线路负载数据
 */
function updateLineLoadChart(lineData) {
  const chartContainer = document.getElementById('line-load-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 准备数据
  const lineNames = [];
  const loadData = [];
  
  // 获取线路名称映射
  const lineNameMap = {
    'jinghu': '京沪高铁',
    'jingguang': '京广高铁',
    'huning': '沪宁城际',
    'huhang': '沪杭高铁'
  };
  
  lineData.forEach(line => {
    const lineName = lineNameMap[line.lineId] || line.lineId;
    lineNames.push(lineName);
    loadData.push((line.count / line.capacity * 100).toFixed(1));
  });
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    series: [
      {
        name: '线路负载率',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        data: lineNames.map((name, index) => {
          return {
            name: name,
            value: loadData[index]
          };
        })
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
 * 显示列车详情
 * @param {string} trainId - 列车ID
 * @param {string} lineId - 线路ID
 */
function showTrainDetail(trainId, lineId) {
  // 获取列车数据
  fetch('/public/mock/line-status.json')
    .then(response => response.json())
    .then(data => {
      const line = data.find(l => l.lineId === lineId);
      if (!line) return;
      
      const train = line.trains.find(t => t.trainId === trainId);
      if (!train) return;
      
      // 更新列车信息
      updateTrainInfo(train, line);
      
      // 更新速度曲线
      updateTrainSpeedChart(train);
      
      // 更新停靠站点列表
      updateTrainStationsList(train, line);
    })
    .catch(error => {
      console.error('获取列车数据失败:', error);
    });
}

/**
 * 更新列车信息
 * @param {Object} train - 列车数据
 * @param {Object} line - 线路数据
 */
function updateTrainInfo(train, line) {
  const container = document.getElementById('train-info-container');
  if (!container) return;
  
  const statusClass = getDelayStatusClass(train.delayStatus);
  const statusText = getDelayStatusText(train.delayStatus);
  
  const html = `
    <div class="train-info">
      <div class="train-info-header">
        <div class="train-number">${train.trainId}</div>
        <div class="train-line">${line.lineName}</div>
      </div>
      <div class="train-info-content">
        <div class="train-info-item">
          <div class="train-info-label">当前速度</div>
          <div class="train-info-value">${train.currentSpeed} km/h</div>
        </div>
        <div class="train-info-item">
          <div class="train-info-label">下一站</div>
          <div class="train-info-value">${train.nextStation}</div>
        </div>
        <div class="train-info-item">
          <div class="train-info-label">预计到达</div>
          <div class="train-info-value">${train.arrivalTime}</div>
        </div>
        <div class="train-info-item">
          <div class="train-info-label">运行状态</div>
          <div class="train-info-value">
            <span class="status-indicator ${statusClass}"></span>
            ${statusText}
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

/**
 * 更新列车速度曲线
 * @param {Object} train - 列车数据
 */
function updateTrainSpeedChart(train) {
  const chartContainer = document.getElementById('train-speed-chart');
  if (!chartContainer || !window.echarts) return;
  
  // 初始化图表
  const chart = echarts.init(chartContainer);
  
  // 模拟速度数据
  const timeData = [];
  const speedData = [];
  
  // 生成过去2小时的速度数据
  const now = new Date();
  for (let i = 120; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    timeData.push(time);
    
    // 模拟速度波动
    const baseSpeed = train.currentSpeed;
    const randomFactor = Math.sin(i / 10) * 15;
    const speed = Math.max(0, Math.round(baseSpeed + randomFactor));
    speedData.push(speed);
  }
  
  // 设置图表选项
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const time = new Date(params[0].value[0]).toLocaleTimeString();
        const speed = params[0].value[1];
        return `${time}<br/>速度: ${speed} km/h`;
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
      type: 'value',
      name: '速度 (km/h)',
      min: 0,
      max: 350
    },
    series: [
      {
        name: '速度',
        type: 'line',
        showSymbol: false,
        data: timeData.map((time, index) => [time, speedData[index]]),
        lineStyle: {
          width: 2,
          color: '#1976d2'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(25, 118, 210, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(25, 118, 210, 0.1)'
              }
            ]
          }
        }
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
 * 更新列车停靠站点列表
 * @param {Object} train - 列车数据
 * @param {Object} line - 线路数据
 */
function updateTrainStationsList(train, line) {
  const container = document.getElementById('train-stations-list');
  if (!container) return;
  
  // 模拟站点数据
  const stations = [
    { name: '北京南站', time: '08:00', status: 'passed' },
    { name: '天津站', time: '08:35', status: 'passed' },
    { name: '济南西站', time: '09:45', status: 'passed' },
    { name: train.nextStation, time: train.arrivalTime, status: 'next' },
    { name: '南京南站', time: '11:30', status: 'future' },
    { name: '上海虹桥站', time: '12:40', status: 'future' }
  ];
  
  let html = '';
  
  stations.forEach(station => {
    const statusClass = getStationStatusClass(station.status);
    const statusIcon = getStationStatusIcon(station.status);
    
    html += `
      <div class="list-item">
        <div class="list-item-icon">
          <span class="station-status ${statusClass}">${statusIcon}</span>
        </div>
        <div class="list-item-content">
          <div class="list-item-title">${station.name}</div>
          <div class="list-item-subtitle">${station.time}</div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
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
 * 获取延误状态文本
 * @param {string} delayStatus - 延误状态
 * @returns {string} 状态文本
 */
function getDelayStatusText(delayStatus) {
  switch (delayStatus) {
    case 'normal':
      return '正常';
    case 'delay':
      return '晚点';
    case 'early':
      return '提前';
    default:
      return '正常';
  }
}

/**
 * 获取站点状态样式类
 * @param {string} status - 站点状态
 * @returns {string} 状态样式类
 */
function getStationStatusClass(status) {
  switch (status) {
    case 'passed':
      return 'status-passed';
    case 'next':
      return 'status-next';
    case 'future':
      return 'status-future';
    default:
      return 'status-future';
  }
}

/**
 * 获取站点状态图标
 * @param {string} status - 站点状态
 * @returns {string} 状态图标
 */
function getStationStatusIcon(status) {
  switch (status) {
    case 'passed':
      return '✓';
    case 'next':
      return '→';
    case 'future':
      return '○';
    default:
      return '○';
  }
}

// 导出组件
window.StatisticsPanel = {
  create: createStatisticsPanel,
  refresh: refreshStatisticsData,
  update: updateStatisticsData,
  showTrainDetail: showTrainDetail
}; 