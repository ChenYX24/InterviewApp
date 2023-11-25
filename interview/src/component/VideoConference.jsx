import React, { useEffect, useRef } from 'react'
import VideoConferenceCss from '../css/VideoConference.module.css'

const VideoConference = ({ localTracks, remoteUsers, uid }) => {
  const prevUsersRef = useRef({})

  // 播放本地流
  useEffect(() => {
    if (localTracks && localTracks[1]) {
      localTracks[1].play(`user-${uid}`)
    }
  }, [localTracks, uid])

  // 播放远程流
  useEffect(() => {
    const newUserUIDs = Object.keys(remoteUsers).filter(
      (uid) => !prevUsersRef.current[uid]
    )
    newUserUIDs.forEach((newUID) => {
      const user = remoteUsers[newUID]
      if (user.videoTrack) {
        user.videoTrack.play(`user-${user.uid}`)
      }
      if (user.audioTrack === 'audio') {
        user.audioTrack.play(`user-${user.uid}`)
      }
    })
    // 更新前一个状态
    prevUsersRef.current = remoteUsers
  }, [remoteUsers])

  // 交换视频
  const handleVideoClick = (clickedUserId) => {
    // 实现视频交换逻辑
    // 这里需要更新状态来切换主视频和辅助视频
  }

  return (
    <div className={VideoConferenceCss.video_container}>
      <div
        className={VideoConferenceCss.main_video_area}
        id={`user-container-${uid}`}>
        <div
          className={VideoConferenceCss.video_player}
          id={`user-${uid}`}></div>
      </div>
      <div className={VideoConferenceCss.secondary_video_area}>
        {Object.values(remoteUsers).map((user) => (
          <div
            className={`${VideoConferenceCss.secondary_video_player}`}
            key={user.uid}
            onClick={() => handleVideoClick(user.uid)}>
            <div
              className={`${VideoConferenceCss.video_player}`}
              id={`user-${user.uid}`}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoConference
