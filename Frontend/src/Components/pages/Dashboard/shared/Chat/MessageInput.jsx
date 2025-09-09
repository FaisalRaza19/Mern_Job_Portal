import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import { useChat } from "../../../../../Context/chatContext.jsx";
import {FiSend,FiPaperclip,FiMic,FiX,FiImage,FiVideo,FiFile,FiSmile,FiMoreHorizontal,} from "react-icons/fi";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const attachMenuRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const containerRef = useRef(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target))
        setShowAttachMenu(false);
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !event.target.closest(".emoji-button")
      )
        setShowEmojiPicker(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      )
        setShowMobileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Typing indicator
  const handleTyping = useCallback(() => {
    if (!activeChat || !userData?._id) return;
    sendTyping({
      chatId: activeChat._id,
      userId: userData._id,
      isTyping: true,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping({
        chatId: activeChat._id,
        userId: userData._id,
        isTyping: false,
      });
    }, 2000);
  }, [activeChat, userData, sendTyping]);

  const resetState = () => {
    setMessage("");
    setAttachedFile(null);
    setFilePreview(null);
    setShowAttachMenu(false);
    setShowEmojiPicker(false);
    setShowMobileMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (!activeChat || (!message.trim() && !attachedFile)) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping({
      chatId: activeChat._id,
      userId: userData._id,
      isTyping: false,
    });

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview(event.target?.result);
      reader.readAsDataURL(file);
    } else setFilePreview(null);
    setShowAttachMenu(false);
    setShowMobileMenu(false);
  };

  const openFileDialog = (acceptType) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
    setShowEmojiPicker(false);
  };

  const handleVoiceRecorded = (audioBlob) => {
    const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
      type: "audio/webm",
    });
    setAttachedFile(audioFile);
    setFilePreview(null);
    setIsRecording(false);
    setShowMobileMenu(false);
  };

  return (
    <div ref={containerRef} className="border-t border-gray-200 bg-white w-full flex flex-col relative">
      {/* File Preview */}
      {attachedFile && (
        <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3 w-full overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              {filePreview && attachedFile.type.startsWith("image/") ? (
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : filePreview && attachedFile.type.startsWith("video/") ? (
                <video src={filePreview} className="w-full h-full object-cover" />
              ) : (
                <FiFile className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-gray-500" />
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 truncate">
                {attachedFile.name}
              </p>
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                {(attachedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button onClick={resetState} className="p-2 hover:bg-gray-200 rounded-full">
            <FiX className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center p-2 sm:p-3 lg:p-4 space-x-2 w-full max-w-4xl mx-auto relative">
        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center space-x-2 z-10">
          {/* Emoji */}
          <div ref={emojiPickerRef} className="relative">
            <button
              onClick={() => setShowEmojiPicker((p) => !p)}
              className="emoji-button p-2 lg:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiSmile className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>

          {/* Attach */}
          <div ref={attachMenuRef} className="relative">
            <button
              onClick={() => setShowAttachMenu((p) => !p)}
              className="p-2 lg:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiPaperclip className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            {showAttachMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg py-2 min-w-max z-50 border border-gray-200">
                <button
                  onClick={() => openFileDialog("image/*")}
                  className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
                >
                  <FiImage className="w-4 h-4 text-blue-500" /> <span>Photo</span>
                </button>
                <button
                  onClick={() => openFileDialog("video/*")}
                  className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
                >
                  <FiVideo className="w-4 h-4 text-green-500" /> <span>Video</span>
                </button>
                <button
                  onClick={() => openFileDialog("*/*")}
                  className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
                >
                  <FiFile className="w-4 h-4 text-purple-500" /> <span>Document</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex sm:hidden relative z-10" ref={mobileMenuRef}>
          <button
            onClick={() => setShowMobileMenu((p) => !p)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
          {showMobileMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg py-2 min-w-max z-50 border border-gray-200 flex flex-col space-y-1">
              <button
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
              >
                <FiSmile className="w-4 h-4 text-yellow-500" /> <span>Emoji</span>
              </button>
              <button
                onClick={() => openFileDialog("*/*")}
                className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
              >
                <FiPaperclip className="w-4 h-4 text-blue-500" /> <span>Attach</span>
              </button>
              <button
                onClick={() => setIsRecording(true)}
                className="flex items-center px-4 py-2 space-x-2 w-full hover:bg-gray-100 rounded"
              >
                <FiMic className="w-4 h-4 text-green-500" /> <span>Voice</span>
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 text-sm sm:text-base lg:text-lg border border-gray-300 rounded-full px-3 sm:px-4 lg:px-6 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 text-gray-900 placeholder-gray-500"
        />

        {/* Send / Voice */}
        <div>
          {message.trim() || attachedFile ? (
            <button
              onClick={handleSendMessage}
              className="p-2 sm:p-3 lg:p-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          ) : isRecording ? (
            <div className="flex items-center space-x-2">
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecorded}
                onCancel={() => setIsRecording(false)}
              />
              <button
                onClick={() => setIsRecording(false)}
                className="p-2 sm:p-3 lg:p-4 bg-red-500 text-white rounded-full hover:bg-red-600 animate-pulse"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="p-2 sm:p-3 lg:p-4 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <FiMic className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

      {/* Mobile Emoji Picker */}
      <div className="lg:hidden md:hidden">
        {showEmojiPicker && (
          <div ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
