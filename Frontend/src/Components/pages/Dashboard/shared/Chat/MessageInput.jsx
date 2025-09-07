import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import { FiSend, FiPaperclip, FiMic, FiX, FiImage, FiVideo, FiFile, FiSmile } from "react-icons/fi";
import VoiceRecorder from "./VoiceRecorder.jsx";
import EmojiPicker from "./emojiPicker.jsx";
import { Context } from "../../../../../Context/context.jsx";


const MessageInput = () => {
  const { userData } = useContext(Context);
  const { activeChat, sendMessage, sendTyping } = useChat();
  const [message, setMessage] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const attachMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  // Cleanup typing timeout on component unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to close popups (attach menu, emoji picker)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && !event.target.closest(".emoji-button")) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handles typing status emission to the server
  const handleTyping = useCallback(() => {
    if (!activeChat || !userData?._id) return;

    sendTyping({ chatId: activeChat._id, userId: userData._id, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping({ chatId: activeChat._id, userId: userData._id, isTyping: false });
    }, 3000);
  }, [activeChat, userData, sendTyping]);

  // Resets input state after sending a message or canceling file attachment
  const resetState = () => {
    setMessage("");
    setAttachedFile(null);
    setFilePreview(null);
    setShowAttachMenu(false);
    setShowEmojiPicker(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles sending the message (text or file)
  const handleSendMessage = async () => {
    if (!activeChat || (!message.trim() && !attachedFile)) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping({ chatId: activeChat._id, userId: userData._id, isTyping: false });


    const messageData = {
      chatId: activeChat._id,
      messageType: attachedFile ? getFileType(attachedFile) : "text",
      message: message.trim(),
      file: attachedFile,
    };

    try {
      await sendMessage(messageData);
      resetState();

    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Handles Enter key press for sending messages (Shift+Enter for new line)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Determines file type for messageType
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  };

  // Handles file selection from input
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFile(file);

    // Create a preview for image and video files
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview(event.target?.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    setShowAttachMenu(false);
  };

  // Triggers hidden file input click with specified accept type
  const openFileDialog = (acceptType) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  // Handles emoji selection from EmojiPicker
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    textareaRef.current?.focus();
  };

  // Handles completion of voice recording
  const handleVoiceRecorded = (audioBlob) => {
    const audioFile = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: "audio/webm" });
    setAttachedFile(audioFile);
    setFilePreview(null);
    setIsRecording(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* File Preview Section */}
      {attachedFile && (
        <div className="p-2 px-4 border-b border-gray-200  bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                {filePreview && attachedFile.type.startsWith("image/") ? (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : filePreview && attachedFile.type.startsWith("video/") ? (
                  <video src={filePreview} className="w-full h-full object-cover" />
                ) : (
                  <FiFile className="w-6 h-6 text-gray-500 " />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900  truncate">{attachedFile.name}</p>
                <p className="text-xs text-gray-500 ">{(attachedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button
              onClick={resetState}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Remove attached file"
            >
              <FiX className="w-4 h-4 text-gray-500 " />
            </button>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4 flex items-end space-x-3">
        {/* Emoji Button and Picker */}
        <div ref={emojiPickerRef} className="relative">
          <button
            onClick={() => setShowEmojiPicker((p) => !p)}
            className="emoji-button p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open emoji picker"
          >
            <FiSmile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 -left-2 w-80 z-50">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            </div>
          )}
        </div>

        {/* Attach File Button and Menu */}
        <div ref={attachMenuRef} className="relative">
          <button
            onClick={() => setShowAttachMenu((p) => !p)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Attach file"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>
          {showAttachMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg py-2 min-w-max z-50 border border-gray-200 ">
              <button
                onClick={() => openFileDialog("image/*")}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FiImage className="w-4 h-4 text-blue-500" /> <span>Photo</span>
              </button>
              <button
                onClick={() => openFileDialog("video/*")}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FiVideo className="w-4 h-4 text-green-500" /> <span>Video</span>
              </button>
              <button
                onClick={() => openFileDialog("*/*")}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
              >
                <FiFile className="w-4 h-4 text-purple-500" /> <span>Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent max-h-32 bg-gray-100  text-gray-900  placeholder-gray-500 custom-scrollbar"
            rows={1}
          />
        </div>

        {/* Send or Voice Record Button */}
        <div className="relative">
          {message.trim() || attachedFile ? (
            <button
              onClick={handleSendMessage}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <FiSend className="w-5 h-5" />
            </button>
          ) : isRecording ? (
            <div className="flex items-center space-x-2">
              <VoiceRecorder onRecordingComplete={handleVoiceRecorded} onCancel={() => setIsRecording(false)} />
              <button
                onClick={() => setIsRecording(false)}
                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors animate-pulse"
                aria-label="Cancel recording"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Start voice recording"
            >
              <FiMic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
    </div>
  );
};

export default MessageInput;
