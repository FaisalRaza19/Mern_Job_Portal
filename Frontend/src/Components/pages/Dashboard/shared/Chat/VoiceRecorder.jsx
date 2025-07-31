import React,{ useState, useRef, useEffect } from "react"
import { FiX, FiSend, FiPause, FiPlay } from "react-icons/fi"


const VoiceRecorder = ({ onRecordingComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef()

  useEffect(() => {
    startRecording()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      onCancel()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const handleSend = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg p-4 min-w-[300px] border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
          />
          <span className="text-sm font-medium text-gray-700">
            {isRecording ? (isPaused ? "Paused" : "Recording") : "Recorded"}
          </span>
        </div>
        <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
      </div>

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center h-12 mb-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-green-500 rounded-full transition-all duration-150 ${
                isRecording && !isPaused ? "animate-pulse" : ""
              }`}
              style={{
                height: `${Math.random() * 30 + 10}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Audio Playback */}
      {audioUrl && !isRecording && (
        <div className="mb-3">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          {isRecording && (
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isPaused ? <FiPlay className="w-4 h-4" /> : <FiPause className="w-4 h-4" />}
            </button>
          )}

          {isRecording ? (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!audioBlob}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSend className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceRecorder
