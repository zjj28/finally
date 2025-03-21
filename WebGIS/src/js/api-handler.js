/**
 * API处理模块 - 负责处理所有与后端API的交互
 */
const ApiHandler = (function() {
    // 缓存存储
    const cache = {};
    // 缓存有效期（5分钟，单位：毫秒）
    const CACHE_EXPIRY = 5 * 60 * 1000;
    // 请求超时时间（10秒）
    const REQUEST_TIMEOUT = 10000;

    /**
     * 创建一个可超时的fetch请求
     * @param {string} url - 请求URL
     * @param {Object} options - fetch选项
     * @returns {Promise} - 返回Promise对象
     */
    function fetchWithTimeout(url, options = {}) {
        return new Promise((resolve, reject) => {
            // 设置超时计时器
            const timeout = setTimeout(() => {
                reject(new Error(`请求超时: ${url}`));
            }, REQUEST_TIMEOUT);

            fetch(url, options)
                .then(response => {
                    clearTimeout(timeout);
                    if (!response.ok) {
                        throw new Error(`HTTP错误: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => {
                    clearTimeout(timeout);
                    reject(error);
                });
        });
    }

    /**
     * 从缓存获取数据或发起新请求
     * @param {string} url - 请求URL
     * @param {Object} options - fetch选项
     * @returns {Promise} - 返回Promise对象
     */
    function fetchWithCache(url, options = {}) {
        const cacheKey = url;
        const now = Date.now();

        // 检查缓存是否有效
        if (cache[cacheKey] && cache[cacheKey].expiry > now) {
            console.log(`从缓存获取数据: ${url}`);
            return Promise.resolve(cache[cacheKey].data);
        }

        // 发起新请求
        return fetchWithTimeout(url, options)
            .then(data => {
                // 更新缓存
                cache[cacheKey] = {
                    data: data,
                    expiry: now + CACHE_EXPIRY
                };
                return data;
            });
    }

    /**
     * 获取GeoJSON数据
     * @param {string} url - GeoJSON文件URL
     * @returns {Promise} - 返回Promise对象
     */
    function getGeoJSON(url) {
        return fetchWithCache(url);
    }

    /**
     * 获取站点实时数据
     * @param {string} stationId - 站点ID
     * @returns {Promise} - 返回Promise对象
     */
    function getStationRealTimeData(stationId) {
        const url = `/api/stations/${stationId}/realtime`;
        return fetchWithCache(url);
    }

    /**
     * 获取站点历史数据
     * @param {string} stationId - 站点ID
     * @returns {Promise} - 返回Promise对象
     */
    function getStationHistoryData(stationId) {
        const url = `/api/stations/${stationId}/history`;
        return fetchWithCache(url);
    }

    /**
     * 清除指定URL的缓存
     * @param {string} url - 要清除缓存的URL
     */
    function clearCache(url) {
        if (url) {
            delete cache[url];
        } else {
            // 清除所有缓存
            Object.keys(cache).forEach(key => delete cache[key]);
        }
    }

    /**
     * 模拟API响应（用于开发测试）
     * @param {string} stationId - 站点ID
     * @returns {Promise} - 返回模拟数据
     */
    function mockStationData(stationId) {
        // 模拟列车数据
        const trains = [
            { number: 'G101', destination: '北京南', departureTime: '08:05', status: '准点' },
            { number: 'G303', destination: '上海虹桥', departureTime: '09:15', status: '晚点10分钟' },
            { number: 'G521', destination: '广州南', departureTime: '10:30', status: '准点' }
        ];

        // 模拟历史数据
        const history = {
            passengerFlow: Math.floor(Math.random() * 50000) + 10000,
            punctualityRate: (Math.random() * 10 + 90).toFixed(1) + '%',
            dailyTrains: Math.floor(Math.random() * 100) + 50
        };

        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    stationId: stationId,
                    trains: trains,
                    history: history,
                    timestamp: new Date().toISOString()
                });
            }, 300); // 模拟300ms网络延迟
        });
    }

    // 公开API
    return {
        getGeoJSON,
        getStationRealTimeData,
        getStationHistoryData,
        clearCache,
        mockStationData
    };
})(); 