import AgoraRTC from 'agora-rtc-sdk-ng'
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import VideoConference from '../component/VideoConference'
import SideBar from '../component/SideBar'
import CameraToggle from '../component/CameraToggle'
import AudioToggle from '../component/AudioToggle'
import VolumeControl from '../component/VolumeControl'
import ScreenShareToggle from '../component/ScreenShareToggle'
import RoomCss from "../css/RoomCss.module.css"
const APP_ID = '91ed5671b5224d52915716656792d2f6' // 替换为您的 Agora App ID
const TOKEN = null // 替换为您的 Agora Token


const Room = () => {
  const { roomId } = useParams()
  const [client, setClient] = useState(null)
  const [userid, setUserid] = useState(null)
  const [localTracks, setLocalTracks] = useState(null)
  const [remoteUsers, setRemoteUsers] = useState({})
  const videoConferenceRef = useRef(null)
  const [lastLeftUserId, setLastLeftUserId] = useState(null)
  const [isInterviewer, setIsInterviewer] = useState(null)
  const [forceShut, setForceShut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsInterviewer(location.state.isInterviewer)
    initAgoraClient()
  }, [roomId])

  const initAgoraClient = async () => {
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(agoraClient)
    let uid = sessionStorage.getItem('uid')
    if (!uid) {
      uid = String(Math.floor(Math.random() * 10000))
      sessionStorage.setItem('uid', uid)
    }
    setUserid(uid)
    // console.log(uid)
    await agoraClient.join(APP_ID, roomId, TOKEN, uid)
    //有其他用户进来则执行
    agoraClient.on('user-published', (user, mediaType) =>
      handleUserPublished(user, mediaType, agoraClient)
    )
    //有人离开则执行
    agoraClient.on('user-left', handleUserLeft)
    //加入流
    joinStream(agoraClient)
  }
  const joinStream = async (agoraClient) => {
    try {
      const Tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        {
          encoderConfig: {
            width: { min: 640, ideal: 1920, max: 1920 },
            height: { min: 480, ideal: 1080, max: 1080 },
          },
        }
      )
      console.log(Tracks)
      setLocalTracks(Tracks)
      await agoraClient.publish([Tracks[0], Tracks[1]])
    } catch (error) {
      console.error('Error accessing microphone and camera', error)
    }
  }

  //用户进入
  const handleUserPublished = async (user, mediaType, agoraClient) => {
    console.log(11111)
    await agoraClient.subscribe(user, mediaType)
    if (mediaType === 'audio' || mediaType === 'video') {
      if (videoConferenceRef.current) {
        videoConferenceRef.current.subscribeUser(user, mediaType)
      }
    }
    setRemoteUsers((prevUsers) => {
      return { ...prevUsers, [user.uid]: user }
    })
  }

  //他人离开房间
  const handleUserLeft = (user) => {
    setRemoteUsers((prevUsers) => {
      const newUsers = { ...prevUsers }
      delete newUsers[user.uid]
      return newUsers
    })
    setLastLeftUserId(user.uid) // 设置最近离开的用户 ID
  }

  return (
    <div>
      <div>
        <div className={RoomCss.box}>
          <div className={RoomCss.box2}>
            <VideoConference
              localTracks={localTracks}
              remoteUsers={remoteUsers}
              uid={userid}
              lastLeftUserId={lastLeftUserId}
              setLastLeftUserId={setLastLeftUserId}
              ref={videoConferenceRef}
            />
            <div className={RoomCss.control} >
              <div style={{ marginRight: '10px' }}>
                <CameraToggle
                  localTracks={localTracks}
                />
              </div>
              <div style={{ marginRight: '10px' }}>
                <AudioToggle
                  localTracks={localTracks}
                  forceShut={forceShut}
                />
              </div>
              <div>
                <ScreenShareToggle
                  agoraClient={client}
                  localTracks={localTracks}
                  userid={userid}
                />
              </div>
            </div>
          </div>
          <SideBar
            uid={userid}
            isInterviewer={isInterviewer}
            roomId={roomId}
            ref={videoConferenceRef}
            forceShut={forceShut}
            setForceShut={setForceShut}
          />
        </div>






        {/* <VolumeControl
        localTracks={localTracks}
      /> */}

      </div>
    </div>


  )
}

export default Room
