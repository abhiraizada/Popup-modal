import React, { useState } from "react";
import Home from "../components/Home";
import ChatPopup from "../components/ChatPopup";
import ChatModal from "../components/ChatModel";
import Popup from "../components/Popup";
import Test from "../components/Test";

const Dashboard = () => {
  const [state, setState] = useState(false);
  const [test, setTest] = useState("hello");
  const [showPopup, setPopup] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const msg = ["hi", "hello", "lol", "yo"];
  const getMessage = (msg) => {
    console.log(msg);
  };
  return (
    <div>
      <button onClick={() => setState(!state)}>chat</button>
      <button onClick={() => setPopup(!showPopup)}>Show PopUp</button>
      <button onClick={() => setShowChatModal(!showChatModal)}>
        Show Model
      </button>
      <ChatPopup messages={msg} getMessage={getMessage} />
      <Test data={test} setTest={setTest} />

      {showPopup && <Popup />}
      {showChatModal && (
        <ChatModal
          messages={msg}
          setShowChatModal={setShowChatModal}
          //   showModel={showModel}
          //   setModel={() => setModel}
        />
      )}
    </div>
  );
};

export default Dashboard;
