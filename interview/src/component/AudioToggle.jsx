// AudioToggle.jsx
import React, { forwardRef, useEffect, useState } from 'react';

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={toggleAudio}>
        <span role="img" aria-label="Audio On">
        {isAudioOn ? '🔊' : '🔇'}
        </span>
      </button>
      <div style={{ marginTop: '5px',fontSize: '12px' }}>
      {isAudioOn ? '关闭音频' : '开启音频'}
      </div>
    </div>
  );
});

export default AudioToggle;
