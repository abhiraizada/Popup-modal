import React, { useRef } from "react";
import "./ChatModel.css";
import "../App.css";

const ChatModal = ({ messages, setShowChatModal }) => {
  console.log(messages);
  const modalRef = useRef();
  const textRef = useRef();

  const handleSend = () => {};
  const handleEmoji = () => {};

  const closeOutsideChatModal = (e) => {
    if (modalRef.current === e.target) {
      setShowChatModal(false);
    }
  };
  return (
    <div
      className="chat-background"
      ref={modalRef}
      onClick={closeOutsideChatModal}
    >
      <div className="chat-container">
        <button
          className="close-button"
          onClick={() => setShowChatModal(false)}
        >
          X
        </button>

        <div class="chat-header">
          <div>Janet Fowler</div>
          <span class="time-left">11:01</span>
        </div>
        <div class="msg-area">
          {messages.map((msg, i) =>
            i % 2 ? (
              <div className="msg-container darker right">
                <img src="" alt="Avatar"></img>
                <p class="msg">{msg}</p>
                <span class="time-right">11:00</span>
              </div>
            ) : (
              <div className="msg-container left">
                <img src="" alt="Avatar"></img>
                <p class="msg">{msg}</p>
                <span class="time-left">11:01</span>
              </div>
            )
          )}
        </div>
        <div class="chat-footer">
          <button onClick={() => handleEmoji()}>
            <i class="emoji-btn">emoji</i>
          </button>
          <input type="text" placeholder="Type your message" ref={textRef} />
          <button onClick={() => handleSend()}>
            <i class="paper-plane">send</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
