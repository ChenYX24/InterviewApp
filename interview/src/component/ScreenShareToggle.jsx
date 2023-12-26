// ScreenShareToggle.js
import React, { forwardRef, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import ScreenOn from "../resource/share1.png"
import ScreenOff from "../resource/share1.png"
const ScreenShareToggle = forwardRef(({ agoraClient,localTracks,userid}, ref) => {
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

        screenTracks.play(`user-${userid}`)
        localTracks[1].stop();
        await agoraClient.unpublish([localTracks[1]]);
        await agoraClient.publish([screenTracks]);
      }
    };
    // 调用状态变化后的逻辑
    updateSharingState();
  }, [isScreenSharing]);





  return (
    <div style={{backgroundColor: isScreenSharing ? "rgba(0, 157, 255, 1)" : "rgba(214, 214, 214, 1)",height:"3vw",width:"5vw",borderRadius:"30px",display:"flex",alignItems: "center",justifyContent: "center",cursor:"pointer",flexDirection:"column"}} onClick={toggleScreenShare}>
    {isScreenSharing ? <img style={{height:"2vw",width:"2vw"}} src={ScreenOn} alt="" />:<img style={{height:"2vw",width:"2vw"}} src={ScreenOff} alt="" />}
  </div>

  );  
});

export default ScreenShareToggle;
