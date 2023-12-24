// AudioToggle.jsx
import React, { forwardRef, useEffect, useState } from 'react';
import AudioOn from "../resource/voice1.png"
import AudioOff from "../resource/voice2.png"

const AudioToggle = forwardRef(({ localTracks, forceShut}) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  // const [allowAudioOn, setallowAudioOn] = useState(true);
  const toggleAudio = async () => {
    // 如果 forceShut 为 true, isAudioOn 设置为 false
    if (forceShut) {
      setIsAudioOn(false);
      return;
    }
    // 切换音频状态
    setIsAudioOn((prev) => !prev);
  };

  useEffect(() => {
    // 状态变化后的逻辑
    const updateMutedState = async () => {
      if (isAudioOn) {
        if (localTracks && localTracks[0]) {
          await localTracks[0].setMuted(false);
        }
      } else {
        if (localTracks && localTracks[0]) {
          await localTracks[0].setMuted(true);
        }
      }
    };

    // 调用状态变化后的逻辑
    updateMutedState();
  }, [isAudioOn, localTracks]);

  useEffect(() => {
    if (forceShut) {
      setIsAudioOn(false);
      return;
    }
  }, [forceShut]);


  return (
      <div style={{backgroundColor: isAudioOn ? "rgba(0, 157, 255, 1)" : "rgba(214, 214, 214, 1)",height:"3vw",width:"5vw",borderRadius:"30px",display:"flex",alignItems: "center",justifyContent: "center",cursor:"pointer",flexDirection:"column"}} onClick={toggleAudio}>
        {isAudioOn ? <img style={{height:"2vw",width:"2vw"}} src={AudioOn} alt="" />:<img style={{height:"2vw",width:"2vw"}} src={AudioOff} alt="" />}
      </div>
  );
});

export default AudioToggle;
