# 高铁站点WebGIS交互系统

基于Leaflet和原生JavaScript开发的高铁站点地理信息系统，实现了地图渲染、动态撒点、弹窗信息展示、实时数据对接等核心功能。

## 功能特点

- **地图基础功能**：使用高德地图作为底图，初始中心点定位中国中部，支持5-18级缩放
- **数据可视化**：加载50+个高铁站点的GeoJSON数据，使用红色火车图标标记站点，绘制高铁线路动画
- **交互功能**：点击站点显示包含站点名称、所属线路、实时候车信息、历史运营数据的弹窗
- **性能优化**：实现视口动态加载、加载进度条、数据加载失败时显示降级方案

## 技术栈

- 前端框架：纯JavaScript实现（无需React/Vue）
- 地图库：Leaflet 1.9.4 + 中文插件
- 数据接口：RESTful格式
- 兼容性：支持Chrome/Firefox/Edge最新版

## 项目结构

```
/WebGIS
├── public
│ ├── data
│ │ ├── stations.geojson  // 站点数据
│ │ └── lines.geojson     // 线路数据
│ └── images
│ └── train-icon.png    // 站点图标
├── src
│ ├── css
│ │ └── map.css         // 样式文件
│ ├── js
│ │ ├── map-init.js     // 地图初始化
│ │ └── api-handler.js  // API处理
│ └── index.html        // 主页面
└── server
└── api.js            // 模拟API服务器
```

## 使用说明

### 1. 准备工作

确保已安装Node.js环境（用于运行模拟API服务器）。

### 2. 安装依赖

```bash
cd WebGIS/server
npm install express cors
```

### 3. 启动服务器

```bash
cd WebGIS/server
node api.js
```

服务器将在 http://localhost:3000 启动。

### 4. 访问应用

在浏览器中打开 http://localhost:3000 即可访问应用。

## 核心实现细节

1. **地图初始化**：使用Leaflet创建地图实例，配置高德地图图层
2. **数据加载**：使用Promise.all同时加载站点和线路数据
3. **交互实现**：为每个站点添加点击事件，实现弹窗的防抖加载
4. **性能优化**：实现数据本地缓存，有效期5分钟

## 注意事项

- 需要将train-icon.png图标文件添加到public/images/目录下
- 本项目使用模拟API数据，实际使用时需替换为真实API接口 