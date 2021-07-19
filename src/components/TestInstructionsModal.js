import React from "react";
// import emptyChair from "../../assets/images/empty-chair.png";
// import partialBody from "../../assets/images/partial-body.png";
// import otherWindow from "../../assets/images/using-away-window.png";
// import otherDevice from "../../assets/images/using-other-device.png";
import "./TestInstructionsModal.css";
import Button from "react-bootstrap/Button";

import { Modal, Container, Row, Col } from "react-bootstrap";
const TestInstructionsModal = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div class="instruction-container">
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Test Instructions
      </Button>

      <div className="card-container"></div>

      <Modal
        {...props}
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <button class="btn close-button" onClick={() => setModalShow(false)}>
          X
        </button>
        <Modal.Body>
          <h3>IMPORTANT! you are being monitored!</h3>
          <Container>
            <Row>
              <Col>
                <div style={{ display: "flex" }}>
                  <div className="card-image">
                    <img alt="empty chair"></img>
                  </div>
                  <p>
                    Surveillance detects no face, please readjust your webcam.
                  </p>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex" }}>
                  <img alt="partial body"></img>
                  <p>
                    Surveillance detects partial face/ face mismatch/ multiple
                    faces. Please readjust your webcam.
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ display: "flex" }}>
                  <img alt="other window"></img>
                  <p>
                    Surveillance detects you have navigated away from test
                    window 5 times.
                  </p>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex" }}>
                  <img alt="aother device"></img>
                  <p>
                    Surveillance detects student is using an object to answer
                    questions.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => setModalShow(false)}>Got it</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TestInstructionsModal;
