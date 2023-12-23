// CameraToggle.js
import React, { forwardRef, useEffect, useState } from 'react'

const CameraToggle = forwardRef( 
  (
  {localTracks}
  )=>{
  const [isCameraOn, setIsCameraOn] = useState(false);
  
  const toggleCamera = async () => {
    // 切换摄像头状态
    setIsCameraOn((prev) => !prev);
  };

  useEffect(() => {
    // 状态变化后的逻辑
    const updateMutedState = async () => {
      if (isCameraOn) {
        if (localTracks && localTracks[1]) {
          await localTracks[1].setMuted(false);
        }
      } else {
        if (localTracks && localTracks[1]) {
          await localTracks[1].setMuted(true);
        }
      }
    };
  
    // 调用状态变化后的逻辑
    updateMutedState();
  }, [isCameraOn, localTracks]);



  return (
    <div>
      <button onClick={toggleCamera}>
        {isCameraOn ? (
          <span role="img" aria-label="Camera On">
            🎥
          </span>
        ) : (
          <span role="img" aria-label="Camera Off">
            🚫
          </span>
        )}
      </button>
      <div style={{ marginTop: '5px',fontSize: '12px' }}>
      {isCameraOn ? '关闭摄像头' : '开启摄像头'}
      </div>
    </div>
  );
});

export default CameraToggle;
