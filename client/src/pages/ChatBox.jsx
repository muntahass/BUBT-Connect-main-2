import React, { useRef, useState, useEffect } from 'react'
import {
  SendHorizonal,
  Image as ImageIcon,
  File as FileIcon,
  Music as MusicIcon,
  Mic,
  X,
  Check,
} from 'lucide-react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'

const ChatBox = () => {
  const [messages, setMessages] = useState(dummyMessagesData)
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [user, setUser] = useState(dummyUserData)
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const messagesEndRef = useRef(null)

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // ✅ Voice Recording (Browser MediaRecorder API)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        setRecording(false)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) mediaRecorder.stop()
  }

  // Send message
  const sendMessage = async () => {
    if (!text.trim() && files.length === 0 && !audioBlob) return

    const newMessages = []

    // Handle text & files
    if (files.length > 0) {
      for (const file of files) {
        newMessages.push({
          id: Date.now() + Math.random(),
          text,
          message_type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('audio/')
            ? 'audio'
            : 'document',
          media_url: URL.createObjectURL(file),
          file_name: file.name,
          to_user_id: user._id,
          createdAt: new Date().toISOString(),
          status: 'sent', // ✅ new property
        })
      }
    } else if (audioBlob) {
      // Voice message
      newMessages.push({
        id: Date.now() + Math.random(),
        text: '',
        message_type: 'audio',
        media_url: URL.createObjectURL(audioBlob),
        file_name: 'voice_message.webm',
        to_user_id: user._id,
        createdAt: new Date().toISOString(),
        status: 'sent',
      })
    } else {
      // Text only
      newMessages.push({
        id: Date.now(),
        text,
        message_type: 'text',
        media_url: null,
        to_user_id: user._id,
        createdAt: new Date().toISOString(),
        status: 'sent',
      })
    }

    // Simulate message delivery + seen delay (for demo)
    newMessages.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'delivered' } : m))
        )
      }, 1500)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'seen' } : m))
        )
      }, 3000 + i * 500)
    })

    setMessages((prev) => [...prev, ...newMessages])
    setText('')
    setFiles([])
    setAudioBlob(null)
  }

  // Format time
  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Render message status ✅
  const renderStatus = (status) => {
    if (status === 'sent') return <Check size={14} className='text-gray-400 ml-1' />
    if (status === 'delivered')
      return (
        <div className='flex ml-1'>
          <Check size={14} className='text-gray-400 -mr-1' />
          <Check size={14} className='text-gray-400' />
        </div>
      )
    if (status === 'seen')
      return (
        <div className='flex ml-1'>
          <Check size={14} className='text-blue-500 -mr-1' />
          <Check size={14} className='text-blue-500' />
        </div>
      )
  }

  return (
    <div className='flex flex-col h-screen bg-gray-50'>
      {/* Header */}
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img
          src={user.profile_picture}
          alt={user.full_name}
          className='size-8 rounded-full'
        />
        <div>
          <p className='font-medium'>{user.full_name}</p>
          <p className='text-sm text-gray-500 mt-1.5'>@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 p-5 md:px-10 overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {messages
            .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.to_user_id !== user._id ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                    message.to_user_id !== user._id
                      ? 'rounded-bl-none'
                      : 'bg-indigo-50'
                  }`}
                >
                  {message.message_type === 'image' && (
                    <img
                      src={message.media_url}
                      className='w-full max-w-sm rounded-lg mb-2'
                      alt={message.file_name}
                    />
                  )}
                  {message.message_type === 'audio' && (
                    <audio controls src={message.media_url} className='w-full my-2' />
                  )}
                  {message.message_type === 'document' && (
                    <a
                      href={message.media_url}
                      download={message.file_name}
                      className='flex items-center gap-2 text-indigo-600 underline my-1'
                    >
                      <FileIcon size={18} /> {message.file_name}
                    </a>
                  )}
                  {message.text && <p>{message.text}</p>}
                  <div className='flex justify-end items-center gap-1 text-xs text-gray-500 mt-1'>
                    {formatTime(message.createdAt)}
                    {renderStatus(message.status)}
                  </div>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className='px-5 flex gap-3 overflow-x-auto pb-2'>
          {files.map((file, index) => (
            <div
              key={index}
              className='relative flex flex-col items-center border border-gray-300 rounded-lg p-2 bg-white'
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className='h-16 w-16 object-cover rounded'
                />
              ) : file.type.startsWith('audio/') ? (
                <MusicIcon className='text-indigo-500 size-8' />
              ) : (
                <FileIcon className='text-gray-500 size-8' />
              )}
              <p className='text-xs mt-1 w-16 truncate text-gray-600'>
                {file.name}
              </p>
              <button
                onClick={() => removeFile(index)}
                className='absolute top-0 right-0 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5'
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Audio Preview (Voice Message) */}
      {audioBlob && (
        <div className='px-5 pb-2 flex items-center gap-3'>
          <audio controls src={URL.createObjectURL(audioBlob)} className='flex-1' />
          <button
            onClick={() => setAudioBlob(null)}
            className='bg-gray-200 hover:bg-gray-300 rounded-full p-1'
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input
            type='text'
            className='flex-1 outline-none text-slate-700'
            placeholder='Type a message...'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          {/* File Upload */}
          <label htmlFor='files' className='cursor-pointer'>
            <ImageIcon className='size-7 text-gray-400 hover:text-gray-600' />
            <input
              type='file'
              id='files'
              multiple
              accept='image/*,audio/*,.pdf,.doc,.docx,.txt'
              hidden
              onChange={handleFileChange}
            />
          </label>

          {/* Voice Record Button */}
          {!recording ? (
            <button
              onClick={startRecording}
              className='text-gray-500 hover:text-indigo-600'
              title='Start recording'
            >
              <Mic size={20} />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className='text-red-500 animate-pulse'
              title='Stop recording'
            >
              <Mic size={20} />
            </button>
          )}

          {/* Send */}
          <button
            onClick={sendMessage}
            className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 text-white p-2 rounded-full'
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
