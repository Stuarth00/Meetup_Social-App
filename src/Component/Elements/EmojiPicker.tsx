import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";

function EmojiBox({
  isOpen,
  setIsOpen,
  setText,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          className="hidden"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: "5px 5px", cursor: "pointer", fontSize: "16px" }}
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
