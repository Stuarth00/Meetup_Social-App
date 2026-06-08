import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import React, { useEffect } from "react";

function EmojiBox({
  setIsOpen,
  setText,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const pickerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <div style={{ position: "absolute", zIndex: 10 }} ref={pickerRef}>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        autoFocusSearch={false}
        theme={Theme.AUTO}
      />
    </div>
  );
}

export default EmojiBox;
