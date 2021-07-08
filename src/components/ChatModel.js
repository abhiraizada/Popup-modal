import React, { useState, useRef } from "react";
import "./ChatModel.css";
import "../App.css";

const ChatModal = ({ messages, setShowChatModal }) => {
  console.log(messages);
  const modalRef = useRef();
  const textRef = useRef();

  const handleSend = () => {};

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
          <h6>Online Now</h6>
        </div>
        <div class="msg-area">
          {messages.map((msg, i) =>
            i % 2 ? (
              <div>
                <img src=""></img>
                <p class="msg right">
                  <span>{msg}</span>
                </p>
              </div>
            ) : (
              <div>
                <p class="msg left">
                  <span>{msg}</span>
                </p>
              </div>
            )
          )}
        </div>
        <div class="chat-footer">
          <input type="text" ref={textRef} />
          <button onClick={() => handleSend()}>
            <i class="paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
