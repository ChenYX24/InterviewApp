// WebSocketComponent.js

import React, { useEffect, useRef, useState } from 'react';

const WebSocketComponent = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const socketRef = useRef(null);



  useEffect(() => {
    // 建立WebSocket连接
    socketRef.current = new WebSocket('ws://localhost:8888/ws');

    // 处理从服务器接收的消息
    socketRef.current.onmessage = (event) => {
      setReceivedMessage(event.data);
    };

    // 关闭WebSocket连接时的处理
    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    // 清理工作，当组件卸载时关闭WebSocket连接
    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    // 向服务器发送消息
    socketRef.current.send(message);
  };

  return (
    <div>
      <div>
        <strong>Received Message:</strong> {receivedMessage}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default WebSocketComponent;
