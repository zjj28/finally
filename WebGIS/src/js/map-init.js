/**
 * 高铁站点WebGIS系统 - 地图初始化与交互模块
 */

console.log('map-init.js开始加载...');

// 地图实例
let map = null;
// 站点标记集合
let markers = [];
// 线路集合
let polylines = [];
// 信息窗体
let infoWindow = null;
// 图层控制器
let layerControl = null;
// 站点图层组
let stationLayer = null;
// 线路图层组
let railwayLayer = null;
// DOM元素
let mapContainer, loadingContainer, loadingProgress, loadingText, errorContainer, retryButton;
// 数据URL
const stationsDataUrl = '/data/stations.geojson';
const linesDataUrl = '/data/lines.geojson';
// 站点点击防抖计时器
let debounceTimer = null;
// 防抖延迟时间（毫秒）
const DEBOUNCE_DELAY = 500;

/**
 * 初始化DOM元素引用
 */
function initDomElements() {
    mapContainer = document.getElementById('map');
    loadingContainer = document.getElementById('loading-container');
    loadingProgress = document.getElementById('loading-progress');
    loadingText = document.getElementById('loading-text');
    errorContainer = document.getElementById('error-container');
    retryButton = document.getElementById('retry-button');
    
    // 添加重试按钮事件监听
    retryButton.addEventListener('click', loadData);
}

/**
 * 初始化地图
 */
function initRealMap() {
    console.log('开始初始化地图...');
    
    // 初始化DOM元素
    initDomElements();
    
    try {
        // 创建地图实例，添加willReadFrequently属性解决Canvas警告
        map = new AMap.Map('map', {
            zoom: 5,
            center: [116.397428, 39.90923],
            resizeEnable: true,
            viewMode: '3D',
            // 添加Canvas配置，解决频繁读取警告
            canvas: {
                willReadFrequently: true
            }
        });
        
        console.log('地图实例创建成功');
        
        // 创建信息窗体
        infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -30),
            closeWhenClickMap: true
        });
        
        // 创建图层组
        stationLayer = new AMap.OverlayGroup();
        railwayLayer = new AMap.OverlayGroup();
        
        // 添加图层组到地图
        map.add([stationLayer, railwayLayer]);
        
        // 加载地图插件
        AMap.plugin([
            'AMap.Scale',
            'AMap.ToolBar',
            'AMap.Geolocation',
            'AMap.ControlBar'
        ], function() {
            console.log('地图插件加载成功');
            // 添加地图控件
            addMapControls();
            
            // 添加图层控制
            addLayerControl();
            
            // 加载数据
            loadData();
        });
        
        console.log('地图初始化完成');
    } catch (error) {
        console.error('地图初始化失败:', error);
        showError('地图初始化失败: ' + error.message);
    }
}

/**
 * 添加地图控件
 */
function addMapControls() {
    try {
        console.log('开始添加地图控件...');
        
        // 添加比例尺控件
        try {
            console.log('正在添加比例尺控件...');
            const scale = new AMap.Scale({
                position: 'LB'
            });
            map.addControl(scale);
            console.log('比例尺控件添加成功');
        } catch (error) {
            console.warn('添加比例尺控件失败:', error);
        }
        
        // 添加工具条控件
        try {
            console.log('正在添加工具条控件...');
            const toolBar = new AMap.ToolBar({
                position: 'RB'
            });
            map.addControl(toolBar);
            console.log('工具条控件添加成功');
        } catch (error) {
            console.warn('添加工具条控件失败:', error);
        }
        
        // 添加定位控件
        try {
            console.log('正在添加定位控件...');
            const geolocation = new AMap.Geolocation({
                position: 'RB',
                offset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                showButton: true
            });
            map.addControl(geolocation);
            console.log('定位控件添加成功');
        } catch (error) {
            console.warn('添加定位控件失败:', error);
        }
        
        // 添加缩放控件
        try {
            console.log('正在添加缩放控件...');
            const controlBar = new AMap.ControlBar({
                position: {
                    top: '10px',
                    right: '10px'
                }
            });
            map.addControl(controlBar);
            console.log('缩放控件添加成功');
        } catch (error) {
            console.warn('添加缩放控件失败:', error);
        }
        
        // 创建自定义图层控制器
        createLayerControl();
        
        console.log('所有地图控件添加完成');
    } catch (error) {
        console.error('添加地图控件失败:', error);
    }
}

/**
 * 创建自定义图层控制器
 */
function createLayerControl() {
    // 创建图层控制容器
    const layerContainer = document.createElement('div');
    layerContainer.className = 'layer-container';
    layerContainer.style.position = 'absolute';
    layerContainer.style.top = '10px';
    layerContainer.style.left = '10px';
    layerContainer.style.zIndex = '100';
    
    // 创建图层按钮
    const layerButton = document.createElement('div');
    layerButton.className = 'layer-button';
    layerButton.textContent = '图层';
    layerContainer.appendChild(layerButton);
    
    // 创建图层面板
    const layerPanel = document.createElement('div');
    layerPanel.className = 'layer-control';
    layerPanel.style.display = 'none';
    layerContainer.appendChild(layerPanel);
    
    // 添加基础图层选项
    const baseLayers = {
        '标准': 'normal',
        '卫星': 'satellite',
        '夜间': 'dark',
        '灰色': 'grey'
    };
    
    Object.entries(baseLayers).forEach(([name, style]) => {
        const item = document.createElement('div');
        item.className = 'layer-item';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'base-layer';
        radio.id = `layer-${style}`;
        radio.checked = style === 'normal';
        
        radio.addEventListener('change', () => {
            map.setMapStyle(`amap://styles/${style}`);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `layer-${style}`;
        label.textContent = name;
        
        item.appendChild(radio);
        item.appendChild(label);
        layerPanel.appendChild(item);
    });
    
    // 添加分隔线
    const divider = document.createElement('div');
    divider.style.height = '1px';
    divider.style.backgroundColor = '#eee';
    divider.style.margin = '8px 0';
    layerPanel.appendChild(divider);
    
    // 添加覆盖物图层选项
    const overlayLayers = [
        { id: 'stations', name: '站点', layer: stationLayer },
        { id: 'railways', name: '线路', layer: railwayLayer }
    ];
    
    overlayLayers.forEach(({ id, name, layer }) => {
        const item = document.createElement('div');
        item.className = 'layer-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `overlay-${id}`;
        checkbox.checked = true;
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                layer.show();
            } else {
                layer.hide();
            }
        });
        
        const label = document.createElement('label');
        label.htmlFor = `overlay-${id}`;
        label.textContent = name;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        layerPanel.appendChild(item);
    });
    
    // 添加点击事件
    layerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        layerPanel.style.display = layerPanel.style.display === 'none' ? 'block' : 'none';
    });
    
    // 点击其他区域关闭面板
    document.addEventListener('click', () => {
        layerPanel.style.display = 'none';
    });
    
    layerPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 添加到地图
    mapContainer.appendChild(layerContainer);
}

/**
 * 更新加载进度
 * @param {number} percent - 进度百分比
 * @param {string} message - 进度消息
 */
function updateLoadingProgress(percent, message) {
    if (loadingProgress) {
        loadingProgress.style.width = `${percent}%`;
    }
    if (loadingText && message) {
        loadingText.textContent = message;
    }
}

/**
 * 显示错误信息
 * @param {string} message - 错误消息
 */
function showError(message) {
    console.error('错误:', message);
    
    // 更新错误消息
    const errorMessage = document.querySelector('#error-container .error-message p');
    if (errorMessage) {
        errorMessage.textContent = message || '无法加载地图数据，请检查网络连接后重试。';
    }
    
    // 显示错误容器
    errorContainer.classList.remove('hidden');
    
    // 隐藏加载容器
    loadingContainer.classList.add('hidden');
}

/**
 * 加载GeoJSON数据
 */
function loadData() {
    // 隐藏错误容器
    errorContainer.classList.add('hidden');
    // 显示加载容器
    loadingContainer.classList.remove('hidden');
    // 重置加载进度
    updateLoadingProgress(0, '正在加载数据...');

    // 清空现有标记和线路
    clearMap();

    console.log('开始加载数据，站点URL:', stationsDataUrl, '线路URL:', linesDataUrl);

    // 使用Promise.all同时加载站点和线路数据
    Promise.all([
        fetch(stationsDataUrl)
            .then(response => {
                console.log('站点数据响应状态:', response.status);
                if (!response.ok) {
                    throw new Error(`站点数据HTTP错误! 状态: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('加载站点数据失败:', error);
                throw new Error(`站点数据加载失败: ${error.message}`);
            }),
        fetch(linesDataUrl)
            .then(response => {
                console.log('线路数据响应状态:', response.status);
                if (!response.ok) {
                    throw new Error(`线路数据HTTP错误! 状态: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('加载线路数据失败:', error);
                throw new Error(`线路数据加载失败: ${error.message}`);
            })
    ])
    .then(([stationsData, linesData]) => {
        console.log('数据加载成功，站点数量:', stationsData.features.length, '线路数量:', linesData.features.length);
        
        updateLoadingProgress(50, '正在处理站点数据...');
        addStationsToMap(stationsData);
        
        updateLoadingProgress(75, '正在处理线路数据...');
        addLinesToMap(linesData);
        
        updateLoadingProgress(100, '加载完成');
        setTimeout(() => {
            loadingContainer.classList.add('hidden');
        }, 500);
    })
    .catch(error => {
        console.error('加载数据失败:', error);
        showError(error.message || '数据加载失败，请检查网络连接后重试。');
    });
}

/**
 * 清空地图上的所有标记和线路
 */
function clearMap() {
    // 清除所有标记和线路
    if (stationLayer) stationLayer.clearOverlays();
    if (railwayLayer) railwayLayer.clearOverlays();
    
    // 重置数组
    markers = [];
    polylines = [];
}

/**
 * 将站点数据添加到地图
 * @param {Object} stationsData - GeoJSON格式的站点数据
 */
function addStationsToMap(stationsData) {
    // 创建标记点数组
    const features = stationsData.features || [];
    
    features.forEach(feature => {
        const properties = feature.properties || {};
        const geometry = feature.geometry || {};
        const coordinates = geometry.coordinates || [];
        
        if (geometry.type === 'Point' && coordinates.length >= 2) {
            try {
                // 创建标记
                const marker = new AMap.Marker({
                    position: [coordinates[0], coordinates[1]],
                    title: properties.name,
                    extData: {
                        id: properties.id,
                        name: properties.name,
                        line: properties.line
                    },
                    cursor: 'pointer',
                    animation: 'AMAP_ANIMATION_DROP',
                    label: {
                        content: properties.name,
                        direction: 'top',
                        offset: new AMap.Pixel(0, -5)
                    }
                });
                
                // 添加点击事件
                marker.on('click', function(e) {
                    handleStationClick(properties, e);
                });
                
                // 添加到图层组
                stationLayer.addOverlay(marker);
                markers.push(marker);
            } catch (error) {
                console.error('创建站点标记失败:', error);
            }
        }
    });
    
    // 自动调整视图以包含所有站点
    if (markers.length > 0) {
        map.setFitView(markers);
    }
}

/**
 * 将线路数据添加到地图
 * @param {Object} linesData - GeoJSON格式的线路数据
 */
function addLinesToMap(linesData) {
    const features = linesData.features || [];
    
    features.forEach(feature => {
        const properties = feature.properties || {};
        const geometry = feature.geometry || {};
        
        if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
            let paths = [];
            
            if (geometry.type === 'LineString') {
                paths = geometry.coordinates.map(coord => [coord[0], coord[1]]);
            } else if (geometry.type === 'MultiLineString') {
                geometry.coordinates.forEach(line => {
                    const linePaths = line.map(coord => [coord[0], coord[1]]);
                    paths = paths.concat(linePaths);
                });
            }
            
            if (paths.length > 0) {
                try {
                    // 创建折线
                    const polyline = new AMap.Polyline({
                        path: paths,
                        strokeColor: properties.color || '#1976d2',
                        strokeWeight: 4,
                        strokeOpacity: 0.8,
                        strokeStyle: 'solid',
                        strokeDasharray: [10, 5],
                        lineJoin: 'round',
                        lineCap: 'round',
                        showDir: true,
                        cursor: 'pointer',
                        extData: {
                            name: properties.name,
                            type: properties.type
                        }
                    });
                    
                    // 添加点击事件
                    polyline.on('click', function() {
                        const info = this.getExtData();
                        const content = `
                            <div class="line-popup">
                                <div class="line-header">
                                    <div class="line-name">${info.name || '未命名线路'}</div>
                                    <div class="line-type">${info.type || '普通线路'}</div>
                                </div>
                            </div>
                        `;
                        
                        infoWindow.setContent(content);
                        infoWindow.open(map, polyline.getPath()[Math.floor(polyline.getPath().length / 2)]);
                    });
                    
                    // 添加到图层组
                    railwayLayer.addOverlay(polyline);
                    polylines.push(polyline);
                } catch (error) {
                    console.error('创建线路失败:', error);
                }
            }
        }
    });
}

/**
 * 处理站点点击事件
 * @param {Object} feature - 站点特征属性
 * @param {Event} event - 点击事件
 */
function handleStationClick(feature, event) {
    // 防抖处理
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        const stationId = feature.id;
        const stationName = feature.name;
        const stationLine = feature.line;
        
        // 显示加载中的信息窗体
        const loadingContent = `
            <div class="station-popup">
                <div class="station-header">
                    <div class="station-name">${stationName}</div>
                    <div class="station-line">所属线路: ${stationLine || '未知'}</div>
                </div>
                <div class="station-content">
                    <div class="loading-info">加载中...</div>
                </div>
            </div>
        `;
        
        infoWindow.setContent(loadingContent);
        infoWindow.open(map, event.target.getPosition());
        
        // 模拟数据（实际项目中应从API获取）
        const mockData = {
            trains: [
                { number: 'G101', destination: '北京南', departureTime: '08:00' },
                { number: 'G103', destination: '上海虹桥', departureTime: '09:15' },
                { number: 'G105', destination: '广州南', departureTime: '10:30' }
            ],
            history: {
                passengerFlow: '15,000',
                punctualityRate: '98.5%',
                dailyTrains: '120'
            }
        };
        
        // 延迟模拟数据加载
        setTimeout(() => {
            const content = createPopupContent(stationName, stationLine, mockData);
            infoWindow.setContent(content);
        }, 800);
    }, DEBOUNCE_DELAY);
}

/**
 * 创建站点弹窗内容
 * @param {string} stationName - 站点名称
 * @param {string} stationLine - 所属线路
 * @param {Object} data - 站点数据
 * @returns {string} - HTML内容
 */
function createPopupContent(stationName, stationLine, data) {
    const { trains, history } = data;
    
    // 列车信息HTML
    let trainsHtml = '';
    if (trains && trains.length > 0) {
        trainsHtml = trains.map(train => `
            <div class="train-item">
                <span class="train-number">${train.number}</span>
                <span class="train-destination">${train.destination}</span>
                <span class="train-time">${train.departureTime}</span>
            </div>
        `).join('');
    } else {
        trainsHtml = '<div class="no-data">当前没有列车信息</div>';
    }
    
    // 历史数据HTML
    let historyHtml = '';
    if (history && Object.keys(history).length > 0) {
        historyHtml = `
            <div class="history-item">日均客流量: ${history.passengerFlow} 人次</div>
            <div class="history-item">准点率: ${history.punctualityRate}</div>
            <div class="history-item">日均列车数: ${history.dailyTrains} 趟</div>
        `;
    } else {
        historyHtml = '<div class="no-data">暂无历史数据</div>';
    }
    
    // 完整的弹窗HTML
    return `
        <div class="station-popup">
            <div class="station-header">
                <div class="station-name">${stationName}</div>
                <div class="station-line">所属线路: ${stationLine || '未知'}</div>
            </div>
            <div class="train-info">
                <h4>实时列车信息</h4>
                ${trainsHtml}
            </div>
            <div class="history-section">
                <h4>历史数据统计</h4>
                ${historyHtml}
            </div>
            <div class="popup-footer">
                <button class="zoom-btn" onclick="map.setZoomAndCenter(12, event.target.getPosition())">放大查看</button>
                <button class="more-btn" onclick="window.open('https://www.12306.cn/index/', '_blank')">前往12306</button>
            </div>
        </div>
    `;
}

/**
 * 添加图层控制
 */
function addLayerControl() {
    try {
        // 创建自定义图层控制器
        createLayerControl();
    } catch (error) {
        console.error('添加图层控制失败:', error);
    }
}

// 页面加载完成后初始化DOM元素
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，等待地图API加载...');
    // 初始化DOM元素，但不初始化地图
    // 地图将在高德地图API加载完成后通过回调函数initMapAfterLoad初始化
    initDomElements();
});

// 导出initRealMap函数，使其可以被全局访问
window.initRealMap = initRealMap;
console.log('map-init.js加载完成，initRealMap函数已导出'); 