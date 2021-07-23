import React, { useState } from "react";
import "./Settings.css";
import { Container, Row, Col } from "react-bootstrap";
const Settings = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div>
      <h1>Settings</h1>
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
      </Container>
    </div>
  );
};

export default Settings;
