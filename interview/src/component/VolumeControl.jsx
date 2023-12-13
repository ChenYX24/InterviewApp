// VolumeControl.js
import React, { forwardRef, useState, useEffect } from 'react';

const VolumeControl = forwardRef(({ localTracks }, ref) => {
  const [volume, setVolume] = useState(50);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);

    // 设置音量
    if (localTracks && localTracks[0]) {
      localTracks[0].setVolume(newVolume / 100);
    }
  };

  useEffect(() => {
    // 组件挂载时初始化音量
    if (localTracks && localTracks[0]) {
      localTracks[0].setVolume(volume / 100);
    }
  }, [localTracks, volume]);

  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
      />
      <p>音量: {volume}%</p>
    </div>
  );
});

export default VolumeControl;
