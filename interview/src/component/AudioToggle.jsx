// AudioToggle.js
import React, { forwardRef, useEffect, useState } from 'react';

const AudioToggle = forwardRef(({ localTracks }) => {
  const [isAudioOn, setIsAudioOn] = useState(false);

  const toggleAudio = async () => {
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

  return (
    <div>
      <button onClick={toggleAudio}>
        {isAudioOn ? (
          <span role="img" aria-label="Audio On">
            🔊
          </span>
        ) : (
          <span role="img" aria-label="Audio Off">
            🔇
          </span>
        )}
      </button>
    </div>
  );
});

export default AudioToggle;
