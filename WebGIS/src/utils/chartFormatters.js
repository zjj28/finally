/**
 * 高铁站点WebGIS系统 - 图表数据格式化工具
 */

/**
 * 将GeoJSON数据转换为热力图数据
 * @param {Object} geojson - GeoJSON数据
 * @param {string} valueField - 值字段名
 * @returns {Array} 热力图数据
 */
function convertGeoJSONToHeatmapData(geojson, valueField = 'value') {
  if (!geojson || !geojson.features) {
    return [];
  }
  
  const heatmapData = [];
  
  geojson.features.forEach(feature => {
    if (feature.geometry && feature.geometry.type === 'Point') {
      const coordinates = feature.geometry.coordinates;
      const value = feature.properties[valueField] || 1;
      
      heatmapData.push({
        value: [...coordinates, value]
      });
    }
  });
  
  return heatmapData;
}

/**
 * 将GeoJSON线路数据转换为ECharts线数据
 * @param {Object} geojson - GeoJSON数据
 * @param {Object} options - 配置选项
 * @returns {Array} ECharts线数据
 */
function convertGeoJSONToLines(geojson, options = {}) {
  if (!geojson || !geojson.features) {
    return [];
  }
  
  const defaultOptions = {
    nameField: 'name',
    valueField: 'value',
    colorField: 'color',
    defaultColor: '#1976d2'
  };
  
  const config = { ...defaultOptions, ...options };
  const linesData = [];
  
  geojson.features.forEach(feature => {
    if (feature.geometry && 
        (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')) {
      
      const name = feature.properties[config.nameField] || '';
      const value = feature.properties[config.valueField] || 0;
      const color = feature.properties[config.colorField] || config.defaultColor;
      
      let coords = [];
      
      if (feature.geometry.type === 'LineString') {
        coords = [feature.geometry.coordinates];
      } else {
        coords = feature.geometry.coordinates;
      }
      
      coords.forEach(line => {
        linesData.push({
          name: name,
          value: value,
          lineStyle: {
            color: color
          },
          coords: line.map(point => [point[0], point[1]])
        });
      });
    }
  });
  
  return linesData;
}

/**
 * 将GeoJSON点数据转换为ECharts散点数据
 * @param {Object} geojson - GeoJSON数据
 * @param {Object} options - 配置选项
 * @returns {Array} ECharts散点数据
 */
function convertGeoJSONToScatter(geojson, options = {}) {
  if (!geojson || !geojson.features) {
    return [];
  }
  
  const defaultOptions = {
    nameField: 'name',
    valueField: 'value',
    symbolField: 'symbol',
    sizeField: 'size',
    colorField: 'color',
    defaultSymbol: 'circle',
    defaultSize: 10,
    defaultColor: '#1976d2'
  };
  
  const config = { ...defaultOptions, ...options };
  const scatterData = [];
  
  geojson.features.forEach(feature => {
    if (feature.geometry && feature.geometry.type === 'Point') {
      const coordinates = feature.geometry.coordinates;
      const name = feature.properties[config.nameField] || '';
      const value = feature.properties[config.valueField] || 0;
      const symbol = feature.properties[config.symbolField] || config.defaultSymbol;
      const size = feature.properties[config.sizeField] || config.defaultSize;
      const color = feature.properties[config.colorField] || config.defaultColor;
      
      scatterData.push({
        name: name,
        value: [...coordinates, value],
        symbol: symbol,
        symbolSize: size,
        itemStyle: {
          color: color
        }
      });
    }
  });
  
  return scatterData;
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
 * 格式化百分比
 * @param {number} value - 值
 * @param {number} total - 总数
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的百分比
 */
function formatPercent(value, total, decimals = 1) {
  if (total === 0) return '0%';
  const percent = (value / total) * 100;
  return percent.toFixed(decimals) + '%';
}

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期对象或时间戳
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的日期时间
 */
function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取颜色渐变
 * @param {string} startColor - 起始颜色
 * @param {string} endColor - 结束颜色
 * @param {number} steps - 步数
 * @returns {Array} 颜色数组
 */
function getColorGradient(startColor, endColor, steps) {
  // 解析颜色
  const parseColor = color => {
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }
    return null;
  };
  
  // 转换为十六进制
  const toHex = (r, g, b) => {
    return '#' + [r, g, b]
      .map(x => Math.round(x))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  };
  
  const start = parseColor(startColor);
  const end = parseColor(endColor);
  
  if (!start || !end) {
    return Array(steps).fill(startColor);
  }
  
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = start.r + ratio * (end.r - start.r);
    const g = start.g + ratio * (end.g - start.g);
    const b = start.b + ratio * (end.b - start.b);
    colors.push(toHex(r, g, b));
  }
  
  return colors;
}

/**
 * 获取状态颜色
 * @param {number} value - 值
 * @param {Array} thresholds - 阈值数组 [{ value: 数值, color: 颜色 }]
 * @param {string} defaultColor - 默认颜色
 * @returns {string} 颜色代码
 */
function getStatusColor(value, thresholds, defaultColor = '#9e9e9e') {
  if (!thresholds || !thresholds.length) {
    return defaultColor;
  }
  
  // 按阈值排序
  const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);
  
  for (const threshold of sortedThresholds) {
    if (value <= threshold.value) {
      return threshold.color;
    }
  }
  
  // 如果超过所有阈值，返回最后一个颜色
  return sortedThresholds[sortedThresholds.length - 1].color;
}

// 导出工具函数
window.ChartFormatters = {
  convertGeoJSONToHeatmapData,
  convertGeoJSONToLines,
  convertGeoJSONToScatter,
  formatNumber,
  formatPercent,
  formatDateTime,
  getColorGradient,
  getStatusColor
}; 