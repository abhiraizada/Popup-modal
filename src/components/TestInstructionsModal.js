import React from "react";
import Logo from "./jacket.jpg";
import "./TestInstructionsModal.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Modal, Container, Row, Col } from "react-bootstrap";
const TestInstructionsModal = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div class="instruction-container">
      <Button variant="danger">rAIZADa</Button>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
      </Button>
      {/* <div class="inst-box">
        <img></img>
        <p className="instruction-details">loprem shod sadnfl sdf lsjdf</p>
      </div>
      <div class="inst-box">
        <img></img>
        <p className="instruction-details">loprem shod sadnfl sdf lsjdf</p>
      </div>
      <div class="inst-box">
        <img></img>
        <p className="instruction-details">loprem shod sadnfl sdf lsjdf</p>
      </div>
      <div class="inst-box">
        <img></img>
        <p className="instruction-details">loprem shod sadnfl sdf lsjdf</p>
      </div>
      <div class="modal-container" id="modal-opened">
        <div class="modal">
          <div class="modal__details">
            <h1 class="modal__title">Modal Title</h1>
            <p class="modal__description">
              Sentence that will tell user what this modal is for or something.
            </p>
          </div>

          <p class="modal__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex
            dicta maiores libero minus obcaecati iste optio, eius labore
            repellendus.
          </p>

          <button class="modal__btn">Button &rarr;</button>

          <a href="#modal-closed" class="link-2"></a>
        </div> */}
      {/* </div> */}
      <div className="card-container"></div>

      <Modal
        {...props}
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <h3>IMPORTANT! you are being monitored!</h3>
          <Container>
            <Row>
              <Col>
                <div style={{ display: "flex" }}>
                  <div className="card-image">
                    <img alt=""></img>
                  </div>
                  <p>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex" }}>
                  <img></img>
                  <p>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ display: "flex" }}>
                  <img></img>
                  <p>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex" }}>
                  <img></img>
                  <p>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TestInstructionsModal;
