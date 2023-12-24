import { Box, Button, Container, Typography } from '@mui/material'
import React, { useState } from 'react'
import InterviewModal from '../component/InterviewModal'
import HomeCss from "../css/HomeCss.module.css"
function HomePage() {
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')

  const openModal = (type) => {
    setShowModal(true)
    setModalType(type)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleConfirm = (roomNumber, isInterviewer) => {
    alert(`房间号: ${roomNumber}, 是否为面试官: ${isInterviewer ? '是' : '否'}`)
    closeModal()
  }

  return (
    <div className={HomeCss.bg}>
      <div className={HomeCss.content}>
      <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎来到面试应用
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openModal('create')}
          sx={{ m: 1 }}>
          创建面试
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => openModal('join')}
          sx={{ m: 1 }}>
          加入面试
        </Button>
      </Box>

      {showModal && (
        <InterviewModal
          title={modalType === 'create' ? '创建面试' : '加入面试'}
          placeholder={
            modalType === 'create' ? '输入房间号创建面试' : '输入房间号加入面试'
          }
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </Container>
      </div>
    </div>

  )
}

export default HomePage
