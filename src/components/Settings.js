import React, { useState } from "react";
import Share from "./Share";
import "./Settings.css";
// import { Container, Row, Col } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";
import ResumePractise from "./ResumePractise";
const Settings = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  const [shareModalShow, setShareModalShow] = useState(false);
  const [copyClicked, setCopyClicked] = useState(false);
  return (
    <div>
      {/* <h1>Settings</h1>
      <Container>
        <Col>
          <Row>
            <div className="setting">
              <div>
                <i class="far fa-bell"></i>
              </div>
              <div>
                <h6>Push Notification</h6>
              </div>
            </div>
          </Row>
          <Row>
            <div className="setting">
              <div>
                <i class="fas fa-sign-out-alt"></i>
              </div>
              <div>
                <h6>Log Out</h6>
              </div>
              <div className="toggle-switch">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleOnChange}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </Row>
        </Col>
      </Container> */}

      <Button variant="primary" onClick={() => setShareModalShow(true)}>
        sharenlsbdf
      </Button>

      <Share
        show={shareModalShow}
        setCopyClicked={setCopyClicked}
        copyClicked={copyClicked}
        onHide={() => {
          setShareModalShow(false);
          setCopyClicked(false);
          console.log("runnign onHide fxn");
        }}
      />
      <ResumePractise />
      {/* <Share /> */}
    </div>
  );
};

export default Settings;
