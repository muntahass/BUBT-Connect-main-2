import { ArrowLeft, Sparkle, Upload, Music, Smile } from 'lucide-react'
import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import toast from 'react-hot-toast'

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "#4f46e5","#a2cb9eff","#46a0e5ff","#24c4b1ff",
    "#f1572dff","#000000ff","#c47ce1ff","#c8e041ff",
    "#e62d77ff","#4698e5c0"
  ]

  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [music, setMusic] = useState(null)
  const [musicUrl, setMusicUrl] = useState(null)

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMedia(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleMusicUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setMusic(file)
      setMusicUrl(URL.createObjectURL(file))
    }
  }

  const handleCreateStory = async () => {
    // save story with text, media, music here
  }

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji)
  }

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        {/* Story preview (media + text overlay + music) */}
        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: previewUrl ? "black" : background }}
        >
          {/* Media preview */}
          {previewUrl && (
            media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full w-full"
              />
            ) : (
              <video
                src={previewUrl}
                className="object-contain max-h-full w-full"
                controls
              />
            )
          )}

          {/* Text overlay */}
          <textarea
            className="absolute inset-0 bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none text-center"
            placeholder="Write something..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          {/* Emoji picker toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute bottom-3 right-3 bg-black/40 p-2 rounded-full hover:bg-black/60"
          >
            <Smile size={20} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 right-3 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}

          {/* Background music (auto-play, hidden controls) */}
          {musicUrl && (
            <audio src={musicUrl} autoPlay loop />
          )}
        </div>

        {/* Background colors (only for text-only stories) */}
        {!previewUrl && (
          <div className="flex mt-4 gap-2">
            {bgColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full ring cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setBackground(color)}
              />
            ))}
          </div>
        )}

        {/* Upload buttons */}
        <div className="flex gap-2 mt-4">
          <label
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer bg-zinc-800"
          >
            <input
              onChange={handleMediaUpload}
              type="file"
              accept="image/*,video/*"
              className="hidden"
            />
            <Upload size={18} /> Photo/Video
          </label>

          <label
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer bg-zinc-800"
          >
            <input
              onChange={handleMusicUpload}
              type="file"
              accept="audio/*"
              className="hidden"
            />
            <Music size={18} /> Music
          </label>
        </div>

        {/* Submit button */}
        <button onClick={()=> toast.promise(handleCreateStory(),{
          loading: 'Saving...',
          success:<p>Story Added</p>,
          error: e => <p>{e.message}</p>
        })}
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle size={14} /> Create Story
        </button>
      </div>
    </div>
  )
}

export default StoryModal

