import React, { forwardRef, useEffect, useState } from 'react'
import VideoConferenceCss from '../css/VideoConference.module.css'

const VideoConference = forwardRef(
  (
    { localTracks, remoteUsers, uid, lastLeftUserId, setLastLeftUserId },
    ref
  ) => {
    const [mainVideoUserId, setMainVideoUserId] = useState(uid)
    const [renderOrder, setRenderOrder] = useState([])
    const [previousMainVideoUserId, setPreviousMainVideoUserId] = useState(null)
    const [isFirst, setIsFirst] = useState(true)

    useEffect(() => {
      if (isFirst) {
        setIsFirst(false)
      }
      setRenderOrder(Object.keys(remoteUsers))

      if (lastLeftUserId) {
        userLeave(lastLeftUserId)
        setLastLeftUserId(null)
      }
    }, [remoteUsers, lastLeftUserId])
    const userLeave = (userid) => {
      if (userid === mainVideoUserId) {
        setMainVideoUserId(uid)
        // reRender()
      }
    }
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
      const tempid = mainVideoUserId
      setPreviousMainVideoUserId(mainVideoUserId)
      if (tempid !== uid) {
        const newOrder = [...renderOrder]
        const mainVideoIndex = newOrder.indexOf(mainVideoUserId.toString())
        const clickedVideoIndex = newOrder.indexOf(clickedUserId.toString())
        if (mainVideoIndex !== -1 && clickedVideoIndex !== -1) {
          ;[newOrder[mainVideoIndex], newOrder[clickedVideoIndex]] = [
            newOrder[clickedVideoIndex],
            newOrder[mainVideoIndex],
          ]
        }
        setRenderOrder(newOrder)
      }
      setMainVideoUserId(clickedUserId)
    }
    useEffect(() => {
      if (!previousMainVideoUserId) return
      console.log(renderOrder, previousMainVideoUserId, mainVideoUserId)
      reRender()
    }, [mainVideoUserId])
    let reRender = () => {
      localTracks[1].play(`user-${uid}`)
      renderOrder.forEach((userid) => {
        if (remoteUsers[userid].videoTrack) {
          remoteUsers[userid].videoTrack.stop()
          remoteUsers[userid].videoTrack.play(`user-${remoteUsers[userid].uid}`)
        }
        if (remoteUsers[userid].audioTrack) {
          remoteUsers[userid].audioTrack.play(`user-${remoteUsers[userid].uid}`)
        }
      })
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
          {renderOrder.map((userId) => {
            if (userId === mainVideoUserId)
              return (
                <div
                  className={VideoConferenceCss.secondary_video_player}
                  key={userId}
                  onClick={() => handleVideoClick(uid)}>
                  <div
                    className={VideoConferenceCss.video_player}
                    id={`user-${uid}`}></div>
                </div>
              )
            return (
              <div
                className={VideoConferenceCss.secondary_video_player}
                key={userId}
                onClick={() => handleVideoClick(userId)}>
                <div
                  className={VideoConferenceCss.video_player}
                  id={`user-${userId}`}></div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

export default VideoConference
