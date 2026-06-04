import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";

function EmojiBox({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [text, setText] = useState<string>("");

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>React TS Emoji Box</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: "10px", width: "300px", fontSize: "16px" }}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: "10px 15px", cursor: "pointer", fontSize: "16px" }}
        >
          {isOpen ? "❌ Close" : "😀 Emojis"}
        </button>
      </div>

      {/* Conditionally render the default emoji box container */}
      {isOpen && (
        <div style={{ position: "absolute", zIndex: 10 }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme={Theme.AUTO} // Adapts automatically to light/dark mode
          />
        </div>
      )}
    </div>
  );
}

export default EmojiBox;
