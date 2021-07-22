import React from "react";
// import emptyChair from "../../assets/images/empty-chair.png";
// import partialBody from "../../assets/images/partial-body.png";
// import otherWindow from "../../assets/images/using-away-window.png";
// import otherDevice from "../../assets/images/using-other-device.png";
import "./TestInstructionsModal.css";
import Button from "react-bootstrap/Button";

import { Modal, Container, Row, Col } from "react-bootstrap";
const TestInstructionsModal = (props) => {
  return (
    <div class="instruction-container">
      <div className="card-container"></div>
      <div>
        <Modal
          {...props}
          // show={modalShow}
          show={props.showTestInstructionsModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <button
            className="btn-close"
            onClick={() => props.setShowTestInstructionsModal(false)}
          >
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
                    <img alt="another device"></img>
                    <p>
                      Surveillance detects student is using an object to answer
                      questions.
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
            <hr></hr>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={() => props.setShowTestInstructionsModal(false)}>
                Got it
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
export default TestInstructionsModal;
