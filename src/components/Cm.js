import React, { useState } from "react";
// import smile from '../../assets/images/smile.svg'
import { Modal, Button } from "react-bootstrap";
const Cm = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSend = () => {};
  const handleEmoji = () => {};
  //   const [modalShow, setModalShow] = React.useState(false);
  console.log(props.messageData);
  const messages = [
    "hello Sir!!",
    "hello Janet!",
    "Can i take test tomorrow",
    "Yes you can",
  ];
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Chat
      </Button>

      <div>
        <Modal
          {...props}
          //   style={{ position: "relative" }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <div>
            <button class="btn close-button" onClick={handleClose}>
              X
            </button>
            <div>
              {/* <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Janet Fowler
            </Modal.Title>
          </Modal.Header> */}
              <div className="header">
                <div>Janet Fowler</div>
                <div>
                  <p>Now Online</p>
                </div>
              </div>

              <Modal.Body>
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
                  <form id="chat-form">
                    <input type="text" placeholder="Type your message" />
                    <button onClick={() => handleEmoji()}>
                      {/* <img src={smile}></img> */}
                    </button>

                    <button onClick={() => handleSend()}>
                      <i class="paper-plane">send</i>
                    </button>
                  </form>
                </div>
              </Modal.Body>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Cm;
