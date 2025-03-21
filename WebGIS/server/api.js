/**
 * 高铁站点WebGIS系统 - 模拟API服务器
 * 
 * 使用方法：
 * 1. 安装依赖: npm install express cors
 * 2. 启动服务器: node api.js
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../src')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// 添加GeoJSON数据路由
app.get('/data/stations.geojson', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/data/stations.geojson'));
});

app.get('/data/lines.geojson', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/data/lines.geojson'));
});

// 模拟数据
const stations = {};
const trains = [
    { number: 'G101', destination: '北京南', departureTime: '08:05', status: '准点' },
    { number: 'G303', destination: '上海虹桥', departureTime: '09:15', status: '晚点10分钟' },
    { number: 'G521', destination: '广州南', departureTime: '10:30', status: '准点' },
    { number: 'G211', destination: '武汉', departureTime: '11:25', status: '准点' },
    { number: 'G401', destination: '深圳北', departureTime: '12:40', status: '晚点5分钟' },
    { number: 'G601', destination: '杭州东', departureTime: '13:50', status: '准点' }
];

// 生成随机历史数据
function generateHistoryData() {
    return {
        passengerFlow: Math.floor(Math.random() * 50000) + 10000,
        punctualityRate: (Math.random() * 10 + 90).toFixed(1) + '%',
        dailyTrains: Math.floor(Math.random() * 100) + 50
    };
}

// 生成随机列车数据
function generateTrainData() {
    const count = Math.floor(Math.random() * 4) + 2; // 2-5趟列车
    const result = [];
    
    for (let i = 0; i < count; i++) {
        const trainIndex = Math.floor(Math.random() * trains.length);
        result.push(trains[trainIndex]);
    }
    
    return result;
}

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

// 获取站点实时数据API
app.get('/api/stations/:stationId/realtime', (req, res) => {
    const { stationId } = req.params;
    
    // 模拟网络延迟
    setTimeout(() => {
        // 模拟偶尔的错误
        if (Math.random() < 0.05) {
            return res.status(500).json({ error: '服务器内部错误' });
        }
        
        // 返回模拟数据
        res.json({
            stationId,
            trains: generateTrainData(),
            timestamp: new Date().toISOString()
        });
    }, Math.random() * 300 + 100); // 100-400ms随机延迟
});

// 获取站点历史数据API
app.get('/api/stations/:stationId/history', (req, res) => {
    const { stationId } = req.params;
    
    // 模拟网络延迟
    setTimeout(() => {
        // 模拟偶尔的错误
        if (Math.random() < 0.05) {
            return res.status(500).json({ error: '服务器内部错误' });
        }
        
        // 返回模拟数据
        res.json({
            stationId,
            history: generateHistoryData(),
            timestamp: new Date().toISOString()
        });
    }, Math.random() * 200 + 100); // 100-300ms随机延迟
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 