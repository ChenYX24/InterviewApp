import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function InterviewModal({ title, placeholder, onClose, onConfirm }) {
  const [roomNumber, setRoomNumber] = useState('')
  const [isInterviewer, setIsInterviewer] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsInterviewer(title !== '加入面试')
  }, [title])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }

  const handleRoomNumberChange = (e) => {
    const value = e.target.value
    if (!value || /^[0-9]+$/.test(value)) {
      setRoomNumber(value)
      setError(false)
    }
  }

  const handleConfirm = () => {
    if (!roomNumber) {
      setError(true)
      return
    }
    navigate(`/room/${roomNumber}`, { state: { isInterviewer: isInterviewer } });
    onConfirm(roomNumber, isInterviewer)
  }
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label={placeholder}
          error={error}
          helperText={error ? '请先输入房间号' : ''}
          value={roomNumber}
          onChange={handleRoomNumberChange}
        />
        {title === '加入面试' && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isInterviewer}
                onChange={(e) => setIsInterviewer(e.target.checked)}
              />
            }
            label="作为面试官加入"
          />
        )}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose}>
            取消
          </Button>
          <Button variant="contained" sx={{ ml: 1 }} onClick={handleConfirm}>
            确认
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default InterviewModal
