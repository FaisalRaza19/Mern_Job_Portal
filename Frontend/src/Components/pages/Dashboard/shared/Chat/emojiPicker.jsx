import React, { useEffect, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsMobile(window.matchMedia("(max-width:639px)").matches);
    update();
    window.addEventListener("resize", update);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const handleSelect = (emoji) => {
    onEmojiSelect?.(emoji);
    // Close after selection
    setTimeout(() => onClose?.(), 50);
  };

  // Mobile: show as bottom drawer with overlay
  if (isMobile) {
    return (
      <>
        <div
          className="flex realtive inset-0 z-40 bg-black/25"
          onClick={onClose}
        />
        <div className="fixed bottom-0 top-40 left-0 z-50 max-h-[60%] border-t border-gray-900 shadow-lg rounded-t-xl overflow-auto animate-slide-up">
          <Picker
            data={data}
            onEmojiSelect={handleSelect}
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      </>
    );
  }

  // Desktop: show above input
  return (
    <div className="flex absolute bottom-0 -top-88 left-0 z-50 h-88 border-t border-gray-900 shadow-lg rounded-t-xl overflow-auto animate-slide-up">
      <Picker
        data={data}
        onEmojiSelect={handleSelect}
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
};

export default EmojiPicker;
