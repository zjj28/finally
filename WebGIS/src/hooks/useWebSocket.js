/**
 * 高铁站点WebGIS系统 - WebSocket数据监听钩子
 */

/**
 * 创建WebSocket连接
 * @param {string} url - WebSocket服务器URL
 * @param {Object} options - 配置选项
 * @returns {Object} WebSocket控制对象
 */
function useWebSocket(url, options = {}) {
  // 默认配置
  const defaultOptions = {
    reconnectInterval: 3000,
    reconnectAttempts: 5,
    onOpen: () => {},
    onMessage: () => {},
    onClose: () => {},
    onError: () => {},
    onReconnect: () => {}
  };
  
  // 合并配置
  const config = { ...defaultOptions, ...options };
  
  // WebSocket实例
  let ws = null;
  
  // 重连计数器
  let reconnectCount = 0;
  
  // 重连定时器
  let reconnectTimer = null;
  
  // 是否手动关闭
  let isManuallyClosed = false;
  
  /**
   * 创建WebSocket连接
   */
  function connect() {
    // 清除之前的连接
    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
    }
    
    // 创建新连接
    try {
      ws = new WebSocket(url);
      
      // 连接打开事件
      ws.onopen = event => {
        console.log('WebSocket连接已建立:', url);
        reconnectCount = 0;
        config.onOpen(event);
      };
      
      // 接收消息事件
      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          config.onMessage(data, event);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
          config.onError(error);
        }
      };
      
      // 连接关闭事件
      ws.onclose = event => {
        console.log('WebSocket连接已关闭:', event.code, event.reason);
        config.onClose(event);
        
        // 如果不是手动关闭，尝试重连
        if (!isManuallyClosed) {
          reconnect();
        }
      };
      
      // 连接错误事件
      ws.onerror = event => {
        console.error('WebSocket连接错误:', event);
        config.onError(event);
      };
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      config.onError(error);
      reconnect();
    }
  }
  
  /**
   * 重新连接
   */
  function reconnect() {
    // 如果已达到最大重连次数，停止重连
    if (config.reconnectAttempts !== -1 && reconnectCount >= config.reconnectAttempts) {
      console.log('已达到最大重连次数，停止重连');
      return;
    }
    
    // 清除之前的定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    
    // 设置重连定时器
    reconnectTimer = setTimeout(() => {
      console.log(`尝试重新连接 (${reconnectCount + 1}/${config.reconnectAttempts})...`);
      reconnectCount++;
      config.onReconnect(reconnectCount);
      connect();
    }, config.reconnectInterval);
  }
  
  /**
   * 发送消息
   * @param {Object|string} data - 要发送的数据
   * @returns {boolean} 是否发送成功
   */
  function send(data) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket未连接，无法发送消息');
      return false;
    }
    
    try {
      const message = typeof data === 'object' ? JSON.stringify(data) : data;
      ws.send(message);
      return true;
    } catch (error) {
      console.error('发送WebSocket消息失败:', error);
      config.onError(error);
      return false;
    }
  }
  
  /**
   * 关闭连接
   */
  function close() {
    isManuallyClosed = true;
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    
    if (ws) {
      ws.close();
    }
  }
  
  /**
   * 获取连接状态
   * @returns {number} 连接状态码
   */
  function getState() {
    return ws ? ws.readyState : -1;
  }
  
  // 立即连接
  connect();
  
  // 返回控制对象
  return {
    send,
    close,
    getState,
    reconnect: () => {
      isManuallyClosed = false;
      reconnectCount = 0;
      connect();
    }
  };
}

// 导出钩子函数
window.useWebSocket = useWebSocket; 