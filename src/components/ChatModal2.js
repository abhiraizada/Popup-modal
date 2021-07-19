import React, { useState } from "react";
import { Modal, Container, Button } from "react-bootstrap";
import smile from "../assets/smile.svg";
const ChatModal2 = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSend = () => {};
  const handleEmoji = () => {};
  const [inputValue, setInputValue] = useState("");
  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
    console.log(inputValue);
  };
  //   const [modalShow, setModalShow] = React.useState(false);
  const messages = ["hello Sir!!", "hello Janet!"];
  const props = {
    messageData: [
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
        Launch static backdrop modal
      </Button>
      <div>
        Jill McCabe Johnson | Slate | June 16, 2021 | 2,422 words “It is not a
        normal thing to do—to acknowledge to yourself that you may have slept
        with a serial killer.” 2. Beijing Calling: Suspicion, Hope, and
        Resistance in the Chinese Rock Underground Stacey Anderson | Rolling
        Stone | June 24, 2021 | 7,800 “China has produced some of the most vital
        indie rock on the planet. But can the scene survive gentrification,
        government crackdowns, and a hit TV show?” 3. Living Memory Megan Pillow
        | Guernica Magazine | June 23, 2021 | 5,158 words “Who, then, are the
        chroniclers of Black lives in the pandemic?” 4. And Then There Were
        Twelve Barry Blanchard | Alpinist Magazine | December 19, 2020 | 4,600
        words “Climbing culture: we come to each other’s aid in times of need.
        Ethan and Lorne knew they had to stay and help. The four men hunkered
        down inside the schrund-cave. With each cup of tea they brewed, their
        spirits rose. They would make it through the night.” 5. First Passage
        Elizabeth Rush | Orion Magazine | June 3, 2021 | 4,556 words “A journey
        toward motherhood in the age of glacial loss.”
      </div>
      {/* <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
      <div>
        <Modal
          {...props}
          // style={{ position: "relative" }}
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
                  {props.messageData.map((data) =>
                    data.user_type != undefined ? (
                      data.user_type === "teacher" ? (
                        <div className="msg-container darker right">
                          <img src="" alt="Avatar"></img>
                          <p class="msg">{data.message}</p>
                          <span class="time-right">{data.time}</span>
                        </div>
                      ) : (
                        <div className="msg-container left">
                          <img src="" alt="Avatar"></img>
                          <p class="msg">{data.message}</p>
                          <span class="time-left">{data.time}</span>
                        </div>
                      )
                    ) : data.teacher_message ? (
                      <div className="msg-container darker right">
                        <img src="" alt="Avatar"></img>
                        <p class="msg">{data.teacher_message}</p>
                        <span class="time-right">{data.time}</span>
                      </div>
                    ) : (
                      <div className="msg-container left">
                        <img src="" alt="Avatar"></img>
                        <p class="msg">{data.student_message}</p>
                        <span class="time-left">{data.time}</span>
                      </div>
                    )
                  )}
                  {/* // {props.messageData.map((data) =>
                  //   data.teacher_message ? (
                  //     <div className="msg-container darker right">
                  //       <img src="" alt="Avatar"></img>
                  //       <p class="msg">{data.teacher_message}</p>
                  //       <span class="time-right">{data.time}</span>
                  //     </div>
                  //   ) : (
                  //     <div className="msg-container left">
                  //       <img src="" alt="Avatar"></img>
                  //       <p class="msg">{data.teacher_message}</p>
                  //       <span class="time-left">{data.time}</span>
                  //     </div>
                  //   )
                  // )} */}
                </div>
                <div class="chat-footer">
                  <form id="chat-form">
                    <input
                      type="text"
                      placeholder="Type your message"
                      onChange={(e) => onChangeHandler(e)}
                    />
                    <button onClick={() => handleEmoji()}>
                      <img src={smile} alt="smile"></img>
                    </button>

                    <button onClick={() => handleSend()}>
                      <i class="paper-plane">send</i>
                    </button>
                    <span data-testid="clip" data-icon="clip" class="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="currentColor"
                          d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                        ></path>
                      </svg>
                    </span>
                    <span data-testid="smiley" data-icon="smiley" class="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="currentColor"
                          d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"
                        ></path>
                      </svg>
                    </span>
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

export default ChatModal2;

// function Example() {
//     const [show, setShow] = useState(false);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);

//     return (

//     );
//   }

//   render(<Example />);
