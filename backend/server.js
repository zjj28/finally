const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dbConfig = require('./config');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 添加静态文件服务，同时服务backend和网页目录
app.use(express.static(path.join(__dirname)));
app.use('/static', express.static(path.join(__dirname, '..', '网页', 'static')));

// 添加根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 添加admin路由
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 创建数据库连接池
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
    connection.release();
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: '服务器内部错误',
        message: err.message 
    });
});

// 记录访问
app.post('/api/record-visit', async (req, res, next) => {
    try {
        const { userAgent, pageUrl } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        const conn = await pool.getConnection();
        
        // 记录访问日志
        await conn.execute(
            'INSERT INTO visit_logs (ip_address, user_agent, page_url) VALUES (?, ?, ?)',
            [ip, userAgent, pageUrl]
        );
        
        // 更新每日统计
        const today = new Date().toISOString().split('T')[0];
        await conn.execute(
            `INSERT INTO daily_stats (stat_date, visit_count, unique_visitors) 
             VALUES (?, 1, 1)
             ON DUPLICATE KEY UPDATE 
             visit_count = visit_count + 1,
             unique_visitors = (
                SELECT COUNT(DISTINCT ip_address) 
                FROM visit_logs 
                WHERE DATE(visit_time) = ?
             )`,
            [today, today]
        );
        
        conn.release();
        res.json({ success: true });
    } catch (error) {
        console.error('Error recording visit:', error);
        next(error);
    }
});

// 获取访问统计
app.get('/api/visit-stats', async (req, res, next) => {
    try {
        const conn = await pool.getConnection();
        const [stats] = await conn.execute(
            'SELECT * FROM daily_stats WHERE stat_date = CURDATE()'
        );
        conn.release();
        
        res.json(stats[0] || { visit_count: 0, unique_visitors: 0 });
    } catch (error) {
        next(error);
    }
});

// 获取访问记录列表
app.get('/api/visit-logs', async (req, res, next) => {
    try {
        const conn = await pool.getConnection();
        const [logs] = await conn.execute(
            'SELECT * FROM visit_logs ORDER BY visit_time DESC LIMIT 100'
        );
        conn.release();
        
        res.json(logs);
    } catch (error) {
        next(error);
    }
});

// 获取周访问趋势
app.get('/api/weekly-stats', async (req, res, next) => {
    try {
        const conn = await pool.getConnection();
        const [stats] = await conn.execute(`
            SELECT 
                DATE(visit_time) as date,
                COUNT(*) as visit_count,
                COUNT(DISTINCT ip_address) as unique_visitors
            FROM visit_logs
            WHERE visit_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(visit_time)
            ORDER BY date DESC
        `);
        conn.release();
        
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

// 获取设备统计
app.get('/api/device-stats', async (req, res, next) => {
    try {
        const conn = await pool.getConnection();
        const [stats] = await conn.execute(`
            SELECT 
                CASE 
                    WHEN user_agent LIKE '%Mobile%' THEN '移动端'
                    WHEN user_agent LIKE '%Tablet%' THEN '平板'
                    ELSE '桌面端'
                END as device_type,
                COUNT(*) as count
            FROM visit_logs
            GROUP BY device_type
        `);
        conn.release();
        
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

// 获取详细统计数据
app.get('/api/dashboard-stats', async (req, res, next) => {
    try {
        const conn = await pool.getConnection();
        
        // 获取今日总览数据
        const [todayStats] = await conn.execute(`
            SELECT 
                visit_count,
                unique_visitors,
                avg_stay_time,
                mobile_count,
                desktop_count,
                tablet_count
            FROM daily_stats 
            WHERE stat_date = CURDATE()
        `);

        // 获取最近7天的趋势
        const [weeklyTrend] = await conn.execute(`
            SELECT 
                stat_date,
                visit_count,
                unique_visitors,
                avg_stay_time
            FROM daily_stats
            WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ORDER BY stat_date ASC
        `);

        // 获取热门页面
        const [popularPages] = await conn.execute(`
            SELECT 
                page_url,
                SUM(visit_count) as total_visits,
                AVG(avg_stay_time) as avg_stay_time
            FROM page_stats
            WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY page_url
            ORDER BY total_visits DESC
            LIMIT 10
        `);

        conn.release();
        
        res.json({
            today: todayStats[0] || {
                visit_count: 0,
                unique_visitors: 0,
                avg_stay_time: 0,
                mobile_count: 0,
                desktop_count: 0,
                tablet_count: 0
            },
            weeklyTrend,
            popularPages
        });
    } catch (error) {
        next(error);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});