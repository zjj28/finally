/**
 * 高铁站点WebGIS系统 - 地图事件处理模块
 */

// 当前高亮的元素
let highlightedLine = null;
let highlightedTrain = null;

// 原始样式存储
const originalStyles = new Map();

/**
 * 初始化地图事件
 */
function initMapEvents() {
  // 监听地图点击事件
  if (window.map) {
    map.on('click', handleMapClick);
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleWindowResize);
}

/**
 * 处理地图点击事件
 * @param {Event} e - 点击事件
 */
function handleMapClick(e) {
  // 清除当前高亮
  clearHighlight();
  
  // 关闭信息窗体
  if (window.infoWindow) {
    infoWindow.close();
  }
  
  // 如果在移动设备上，关闭面板
  if (window.innerWidth <= 768) {
    if (window.PanelController) {
      PanelController.closePanel('right');
    }
  }
}

/**
 * 处理窗口大小变化
 */
function handleWindowResize() {
  // 调整地图大小
  if (window.map) {
    map.resize();
  }
  
  // 在移动设备上，默认关闭右侧面板
  if (window.innerWidth <= 768) {
    if (window.PanelController) {
      PanelController.closePanel('right');
    }
  }
}

/**
 * 高亮显示线路
 * @param {string} lineId - 线路ID
 */
function highlightLine(lineId) {
  // 清除当前高亮
  clearHighlight();
  
  // 查找线路
  if (window.railwayLayer) {
    const polylines = railwayLayer.getOverlays();
    
    for (let i = 0; i < polylines.length; i++) {
      const polyline = polylines[i];
      const info = polyline.getExtData();
      
      if (info && info.id === lineId) {
        // 保存原始样式
        originalStyles.set(polyline, {
          strokeColor: polyline.getOptions().strokeColor,
          strokeWeight: polyline.getOptions().strokeWeight,
          strokeOpacity: polyline.getOptions().strokeOpacity
        });
        
        // 设置高亮样式
        polyline.setOptions({
          strokeColor: '#f44336',
          strokeWeight: 6,
          strokeOpacity: 1
        });
        
        // 记录当前高亮的线路
        highlightedLine = polyline;
        
        // 调整视图以显示线路
        map.setFitView([polyline]);
        
        break;
      }
    }
  }
  
  // 同时高亮该线路上的站点
  highlightLineStations(lineId);
  
  // 更新右侧面板数据
  updateRightPanelWithLineData(lineId);
}

/**
 * 高亮显示线路上的站点
 * @param {string} lineId - 线路ID
 */
function highlightLineStations(lineId) {
  if (window.stationLayer) {
    const markers = stationLayer.getOverlays();
    
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const info = marker.getExtData();
      
      if (info && info.line && info.line.includes(lineId)) {
        // 保存原始样式
        if (!originalStyles.has(marker)) {
          originalStyles.set(marker, {
            animation: marker.getAnimation()
          });
        }
        
        // 设置高亮样式
        marker.setAnimation('AMAP_ANIMATION_BOUNCE');
      }
    }
  }
}

/**
 * 高亮显示列车
 * @param {string} trainId - 列车ID
 * @param {string} lineId - 线路ID
 */
function highlightTrain(trainId, lineId) {
  // 清除当前高亮
  clearHighlight();
  
  // 查找列车标记
  if (window.markers) {
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const info = marker.getExtData();
      
      if (info && info.id === trainId) {
        // 保存原始样式
        originalStyles.set(marker, {
          animation: marker.getAnimation()
        });
        
        // 设置高亮样式
        marker.setAnimation('AMAP_ANIMATION_BOUNCE');
        
        // 记录当前高亮的列车
        highlightedTrain = marker;
        
        // 调整视图以显示列车
        map.setZoomAndCenter(12, marker.getPosition());
        
        break;
      }
    }
  }
  
  // 同时高亮该列车所在的线路
  if (lineId) {
    highlightTrainLine(lineId);
  }
  
  // 更新右侧面板数据
  updateRightPanelWithTrainData(trainId, lineId);
}

/**
 * 高亮显示列车所在的线路
 * @param {string} lineId - 线路ID
 */
function highlightTrainLine(lineId) {
  if (window.railwayLayer) {
    const polylines = railwayLayer.getOverlays();
    
    for (let i = 0; i < polylines.length; i++) {
      const polyline = polylines[i];
      const info = polyline.getExtData();
      
      if (info && info.id === lineId) {
        // 保存原始样式
        originalStyles.set(polyline, {
          strokeColor: polyline.getOptions().strokeColor,
          strokeWeight: polyline.getOptions().strokeWeight,
          strokeOpacity: polyline.getOptions().strokeOpacity
        });
        
        // 设置高亮样式
        polyline.setOptions({
          strokeColor: '#2196f3',
          strokeWeight: 5,
          strokeOpacity: 0.8
        });
        
        break;
      }
    }
  }
}

/**
 * 清除高亮
 */
function clearHighlight() {
  // 恢复线路样式
  if (highlightedLine) {
    const originalStyle = originalStyles.get(highlightedLine);
    if (originalStyle) {
      highlightedLine.setOptions(originalStyle);
    }
    highlightedLine = null;
  }
  
  // 恢复列车样式
  if (highlightedTrain) {
    const originalStyle = originalStyles.get(highlightedTrain);
    if (originalStyle) {
      highlightedTrain.setAnimation(originalStyle.animation);
    }
    highlightedTrain = null;
  }
  
  // 恢复所有标记的样式
  if (window.stationLayer) {
    const markers = stationLayer.getOverlays();
    
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const originalStyle = originalStyles.get(marker);
      
      if (originalStyle) {
        marker.setAnimation(originalStyle.animation);
      }
    }
  }
  
  // 恢复所有线路的样式
  if (window.railwayLayer) {
    const polylines = railwayLayer.getOverlays();
    
    for (let i = 0; i < polylines.length; i++) {
      const polyline = polylines[i];
      const originalStyle = originalStyles.get(polyline);
      
      if (originalStyle) {
        polyline.setOptions(originalStyle);
      }
    }
  }
  
  // 清空样式存储
  originalStyles.clear();
}

/**
 * 更新右侧面板显示线路数据
 * @param {string} lineId - 线路ID
 */
function updateRightPanelWithLineData(lineId) {
  // 打开右侧面板
  if (window.PanelController) {
    PanelController.openPanel('right', 'statistics');
  }
  
  // 获取线路数据
  fetch('/public/mock/line-status.json')
    .then(response => response.json())
    .then(data => {
      const line = data.find(l => l.lineId === lineId);
      if (!line) return;
      
      // TODO: 更新右侧面板数据
      console.log('更新右侧面板显示线路数据:', line);
    })
    .catch(error => {
      console.error('获取线路数据失败:', error);
    });
}

/**
 * 更新右侧面板显示列车数据
 * @param {string} trainId - 列车ID
 * @param {string} lineId - 线路ID
 */
function updateRightPanelWithTrainData(trainId, lineId) {
  // 打开右侧面板
  if (window.PanelController) {
    PanelController.openPanel('right', 'train-detail');
  }
  
  // 显示列车详情
  if (window.StatisticsPanel) {
    StatisticsPanel.showTrainDetail(trainId, lineId);
  }
}

/**
 * 添加地图控件
 * @param {Object} control - 控件对象
 */
function addMapControl(control) {
  if (window.map) {
    map.addControl(control);
  }
}

/**
 * 移除地图控件
 * @param {Object} control - 控件对象
 */
function removeMapControl(control) {
  if (window.map) {
    map.removeControl(control);
  }
}

/**
 * 切换地图图层
 * @param {string} layerType - 图层类型
 * @param {boolean} visible - 是否可见
 */
function toggleMapLayer(layerType, visible) {
  if (!window.map) return;
  
  switch (layerType) {
    case 'stations':
      if (window.stationLayer) {
        if (visible) {
          stationLayer.show();
        } else {
          stationLayer.hide();
        }
      }
      break;
    case 'railways':
      if (window.railwayLayer) {
        if (visible) {
          railwayLayer.show();
        } else {
          railwayLayer.hide();
        }
      }
      break;
    case 'traffic':
      // 切换实时交通图层
      if (visible) {
        if (!window.trafficLayer) {
          window.trafficLayer = new AMap.TileLayer.Traffic();
        }
        map.add(trafficLayer);
      } else {
        if (window.trafficLayer) {
          map.remove(trafficLayer);
        }
      }
      break;
    case 'satellite':
      // 切换卫星图层
      if (visible) {
        if (!window.satelliteLayer) {
          window.satelliteLayer = new AMap.TileLayer.Satellite();
        }
        map.add(satelliteLayer);
      } else {
        if (window.satelliteLayer) {
          map.remove(satelliteLayer);
        }
      }
      break;
    default:
      break;
  }
}

/**
 * 设置地图样式
 * @param {string} style - 地图样式
 */
function setMapStyle(style) {
  if (window.map) {
    map.setMapStyle(style);
  }
}

// 导出地图事件处理函数
window.MapEvents = {
  init: initMapEvents,
  highlightLine: highlightLine,
  highlightTrain: highlightTrain,
  clearHighlight: clearHighlight,
  addControl: addMapControl,
  removeControl: removeMapControl,
  toggleLayer: toggleMapLayer,
  setStyle: setMapStyle
}; 