import React, { useState } from "react";
import smile from "../assets/smile.svg";
import { Button, Modal } from "react-bootstrap";
import "./ChatModal.css";
const ChatModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [inputValue, setInputValue] = useState("");
  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
    console.log(inputValue);
  };
  const handleSend = (e) => {
    e.preventDefault();
    const data = {
      user_id: props.userId,
      assign_auto_id: props.assignId,
      teacher_id: "10660635",
      user_type: "student",
      message: inputValue,
    };
    props.socket.emit("chat", data);
    setInputValue("");
    console.log("Chat Data === ", data);
  };
  const handleEmoji = () => {};
  //   const [modalShow, setModalShow] = React.useState(false);
  // const messages = [
  //   "hello Sir!!",
  //   "hello Janet!",
  //   "Can i take test tomorrow",
  //   "Yes you can",
  // ];

  const messages = ["hello Sir!!", "hello Janet!"];
  var props = {
    messageData: [
      { teacher_message: "I am teacher", time: "9:31 PM" },
      { teacher_message: "i am ", time: "9:47 PM" },
      { student_message: "i am done", time: "5:11 PM" },
      { teacher_message: "I am teacher", time: "9:31 PM" },
      { teacher_message: "i am ", time: "9:47 PM" },
      { student_message: "i am done", time: "5:11 PM" },
      {
        user_type: "teacher",
        user_id: 10660629,
        status: 1,
        message: "i am BIG teacher",
        time: "6:29 PM",
      },
      {
        user_type: "student",
        user_id: 10660629,
        status: 1,
        message: "i am student",
        time: "6:29 PM",
      },
    ],
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal ss
      </Button>

      <div>
        <Modal
          {...props}
          // style={{ position: "relative" }}
          dialogClassName="my-modal"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <div>
            <div>
              {/* <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Janet Fowler
            </Modal.Title>
          </Modal.Header> */}
              <div className="header">
                <div className="user-details">
                  <div className="user-name">Janet Fowler</div>
                  <span className="user-status">Now Online</span>
                </div>
                <div>
                  <button class="btn close-button" onClick={handleClose}>
                    X
                  </button>
                </div>
              </div>

              <Modal.Body>
                <div class="msg-area">
                  {props.messageData.map((data) =>
                    data.user_type != undefined ? (
                      data.user_type === "teacher" ? (
                        <div className="msg-container darker right-side">
                          <div className="msg-details right">
                            <p class="msg">{data.message}</p>
                            <p class="time-right">{data.time}</p>
                          </div>
                          <div className="avatar avatar-right">
                            <div className="avatar-img">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
                                alt="Avatar"
                              ></img>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="msg-container left">
                          <div className="avatar">
                            <div className="avatar-img">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
                                alt="Avatar"
                              ></img>
                            </div>
                          </div>
                          <div className="msg-details">
                            <p class="msg">{data.message}</p>
                            <p class="time-left">{data.time}</p>
                          </div>
                        </div>
                      )
                    ) : data.teacher_message ? (
                      <div className="msg-container darker right-side">
                        <div className="msg-details right">
                          <p class="msg">{data.teacher_message}</p>
                          <p class="time-right">{data.time}</p>
                        </div>
                        <div className="avatar avatar-right">
                          <div className="avatar-img">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
                              alt="Avatar"
                            ></img>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="msg-container left">
                        <div className="avatar">
                          <div className="avatar-img">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
                              alt="Avatar"
                            ></img>
                          </div>
                        </div>
                        <div className="msg-details">
                          <p class="msg">{data.student_message}</p>
                          <p class="time-left">{data.time}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div class="chat-footer">
                  {/* <button className="emoji-btn" onClick={() => handleEmoji()}>
                    <img src={smile}></img>
                  </button> */}
                  <input
                    value={inputValue}
                    type="text"
                    placeholder="Type your message"
                    onChange={(e) => onChangeHandler(e)}
                  />
                  <button className="sendMsgBtn" onClick={(e) => handleSend(e)}>
                    <i className="paper-plane">Send</i>
                  </button>
                </div>
              </Modal.Body>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ChatModal;
