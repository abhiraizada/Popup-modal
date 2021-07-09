import React, { useState } from "react";
import { Modal, Container, Button } from "react-bootstrap";
const ChatModal2 = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSend = () => {};
  const handleEmoji = () => {};
  //   const [modalShow, setModalShow] = React.useState(false);
  const messages = [
    "hello Sir!!",
    "hello Janet!",
    "Can i take test tomorrow",
    "Yes you can",
  ];
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button>
      {/* <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}

      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <div>
          <button class="btn">X</button>
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
                <button onClick={() => handleEmoji()}>
                  <i class="emoji-btn">emoji</i>
                </button>
                <input type="text" placeholder="Type your message" />
                <button onClick={() => handleSend()}>
                  <i class="paper-plane">send</i>
                </button>
              </div>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatModal2;

// function Example() {
//     const [show, setShow] = useState(false);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     return (

//     );
//   }

//   render(<Example />);
