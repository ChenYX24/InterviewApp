// CameraToggle.js
import React, { forwardRef, useEffect, useState } from 'react'

const CameraToggle = forwardRef( (
  {localTracks}
  )=> {

  const [isCameraOn, setIsCameraOn] = useState(false);

  const toggleCamera = async () => {
    // 切换摄像头状态
    setIsCameraOn((prev) => !prev);
    if (isCameraOn){
      if (localTracks && localTracks[1]) {
        await localTracks[1].setMuted(false);
      }
    }
    else{
      if (localTracks && localTracks[1]) {
        await localTracks[1].setMuted(true);
      }
    }
  };

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
    </div>
  );
});

export default CameraToggle;
