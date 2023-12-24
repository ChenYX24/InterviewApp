// CameraToggle.js
import React, { forwardRef, useEffect, useState } from 'react'
import cameraOn from "../resource/camera1.png"
import cameraOff from "../resource/camera2.png"


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
      <div style={{backgroundColor: isCameraOn ? "rgba(0, 157, 255, 1)" : "rgba(214, 214, 214, 1)",height:"3vw",width:"5vw",borderRadius:"30px",display:"flex",alignItems: "center",justifyContent: "center",cursor:"pointer",flexDirection:"column"}} onClick={toggleCamera}>
        {isCameraOn ? (
            <img style={{height:"2vw",width:"2vw"}} src={cameraOn} alt="" />
        ) : (
            <img style={{height:"2vw",width:"2vw"}} src={cameraOff} alt="" />
        )}
      </div>
  );
});

export default CameraToggle;
