// ScreenShareToggle.js
import React, { forwardRef, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const ScreenShareToggle = forwardRef(({ agoraClient }, ref) => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localScreenTracks, setLocalScreenTracks] = useState(null);

  const toggleScreenShare = async () => {
    // 切换屏幕分享状态
    setIsScreenSharing((prev) => !prev);
  };

  useEffect(() => {
    // 状态变化后的逻辑
    const updateSharingState = async () => {
      if (!isScreenSharing) {
        if (localScreenTracks) {
          await agoraClient.unpublish([localScreenTracks]);
          localScreenTracks.stop(); // 停止屏幕分享轨道
        }
      } else {
        // 创建本地屏幕分享轨道
        const screenTracks = await AgoraRTC.createScreenVideoTrack();
        setLocalScreenTracks(screenTracks);
        await agoraClient.publish([screenTracks]);
      }
    };

    // 调用状态变化后的逻辑
    updateSharingState();
  }, [isScreenSharing, agoraClient, localScreenTracks]);

  return (
    <div>
      <button onClick={toggleScreenShare} ref={ref}>
        {isScreenSharing ? '🖥️' : '🚫'}
      </button>
      <div style={{ marginTop: '5px',fontSize: '12px' }}>
        {isScreenSharing ? '关闭屏幕共享' : '开启屏幕共享'}
      </div>
    </div>
  );  
});

export default ScreenShareToggle;
