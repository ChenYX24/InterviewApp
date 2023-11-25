import React, { forwardRef, useEffect, useState } from 'react'
import VideoConferenceCss from '../css/VideoConference.module.css'

const VideoConference = forwardRef(({ localTracks, remoteUsers, uid }, ref) => {
  const [mainVideoUserId, setMainVideoUserId] = useState(uid)
  React.useImperativeHandle(ref, () => ({
    subscribeUser(user, mediaType) {
      if (mediaType === 'audio') {
        const audioTrack = user.audioTrack
        audioTrack.play()
      } else {
        const videoTrack = user.videoTrack
        videoTrack.play(`user-${user.uid}`)
      }
    },
  }))

  // 播放本地流
  useEffect(() => {
    setMainVideoUserId(uid)
    if (localTracks && localTracks[1]) {
      localTracks[1].play(`user-${uid}`)
    }
  }, [localTracks, uid])
  const handleVideoClick = (clickedUserId) => {
    console.log(uid, localTracks, remoteUsers[clickedUserId])
    const tempid = mainVideoUserId
    setMainVideoUserId(clickedUserId)
    reRender(tempid)
    reRender(clickedUserId)
  }
  let reRender = (tempid) => {
    if (tempid === uid) {
      localTracks[1].play(`user-${uid}`)
    } else {
      console.log(tempid, uid)
      if (remoteUsers[tempid].videoTrack) {
        remoteUsers[tempid].videoTrack.play(`user-${remoteUsers[tempid].uid}`)
      }
      if (remoteUsers[tempid].videoTrack) {
        remoteUsers[tempid].audioTrack.play(`user-${remoteUsers[tempid].uid}`)
      }
    }
  }
  return (
    <div className={VideoConferenceCss.video_container} ref={ref}>
      <div
        className={VideoConferenceCss.main_video_area}
        id={`user-container-${mainVideoUserId || uid}`}>
        <div
          className={VideoConferenceCss.video_player}
          id={`user-${mainVideoUserId || uid}`}></div>
      </div>
      <div className={VideoConferenceCss.secondary_video_area}>
        {Object.values(remoteUsers).map((user) => {
          if (user.uid === mainVideoUserId)
            return (
              <div
                className={VideoConferenceCss.secondary_video_player}
                key={user.uid}
                onClick={() => handleVideoClick(uid)}>
                <div
                  className={VideoConferenceCss.video_player}
                  id={`user-${uid}`}></div>
              </div>
            )
          return (
            <div
              className={VideoConferenceCss.secondary_video_player}
              key={user.uid}
              onClick={() => handleVideoClick(user.uid)}>
              <div
                className={VideoConferenceCss.video_player}
                id={`user-${user.uid}`}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default VideoConference
