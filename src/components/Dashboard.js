import React, { useState } from "react";
import Home from "../components/Home";
import { useHistory } from "react-router-dom";

import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import ChatPopup from "../components/ChatPopup";
import ChatModal from "../components/ChatModal";
import Popup from "../components/Popup";
import Test from "../components/Test";
import Testing from "../components/Testing";
import TestInstructionsModal from "../components/TestInstructionsModal";

const Dashboard = () => {
  const [state, setState] = useState(false);
  const [test, setTest] = useState("hello");
  const [showPopup, setPopup] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showTestInstructionsModal, setShowTestInstructionsModal] = useState(
    false
  );
  const msg = ["hi", "hello", "lol", "yo"];
  const getMessage = (msg) => {
    console.log(msg);
  };
  const history = useHistory();
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
      <ChatModal
        messages={msg}
        setShowChatModal={setShowChatModal}
        //   showModel={showModel}
        //   setModel={() => setModel}
      />
      <a>Know More</a>
      <p>
        This test is being supervised online. Your marks can be deducted if
        caught cheating.
      </p>
      <a
        className="test-instruction-link"
        onClick={() => setShowTestInstructionsModal(true)}
      >
        hiii
      </a>
      {showTestInstructionsModal && (
        <TestInstructionsModal
          showTestInstructionsModal={showTestInstructionsModal}
          setShowTestInstructionsModal={setShowTestInstructionsModal}
        />
      )}
      {/* TestInstructionsModal */}

      {/* <Testing /> */}
      <button onClick={() => history.push("/sh")}>Notifications</button>
    </div>
  );
};

export default Dashboard;
