import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import "./Shashank.css";
const Shashank = (props) => {
  const [isSwitchChecked, setSwtichChecked] = useState(false);
  console.log(props);
  console.log(props.video);
  let video2 = "lol";
  useEffect(() => {
    console.log("shashank", props.video);
  }, []);
  useEffect(() => {
    console.log("shashank2 ", video2);
  }, [video2]);
  video2 = "lol2";
  const [eventKey, setEventKey] = useState(0);
  // var props = {
  //   activeEventKey: 0,
  //   index: 1,
  //   title: "Title",
  //   body:
  //     "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
  // };
  video2 = "lol3";
  return (
    <div>
      {/* <Accordion className="" defaultActiveKey="0">
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey={`${props.index}`}
            onClick={() => {
              props.activeEventKey == props.index
                ? props.setEventKey(null)
                : props.setEventKey(props.index);
            }}
          >
            {props.title}
            <span className="toggle">
              <i
                className={`fa ${
                  props.activeEventKey == props.index
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
              />
            </span>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={`${props.index}`}>
            <Card.Body>{props.body}</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion> */}
      <a>hello</a>
      {/* <Container>
        <Row> */}
      <div className="row">
        <Form.Group className=" col-6 profile-details-formgroup">
          <div className="col-sm-3 ">
            {/* <span>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", width: "30px", marginTop: "15px" }}
              />
            </span> */}
            <span>Name</span>
          </div>

          <div className="col-sm-12 ">
            <InputGroup hasValidation>
              <Form.Control
                className={`profile-details-input `}
                placeholder={"Enter Name"}
                autoComplete={"off"}
                name="name"
                type="text"
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                  this.handleChange(e);
                }}

                // feedback={this.state.this.state.error.errorMessage}
              />

              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group>
        <Form.Group>
          <div className="col-sm-3 col-6">
            {/* <span>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "30px", width: "30px", marginTop: "15px" }}
              />
            </span> */}
            <span>Name</span>
          </div>
          <div className="col-sm-6 col-6">
            <InputGroup hasValidation>
              <Form.Control
                className={`profile-details-input `}
                placeholder={"Enter Name"}
                autoComplete={"off"}
                name="name"
                type="text"
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                  this.handleChange(e);
                }}

                // feedback={this.state.this.state.error.errorMessage}
              />

              <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
            </InputGroup>
          </div>
        </Form.Group>
      </div>
      {/* </Row>
      </Container> */}
      <h3>Personal Details</h3>
      <div className="d-flex person-details-logo">
        <div>
          <img height="100px" width="100px"></img>
        </div>
        <div>
          <div>
            <span>John Doe</span>
          </div>
          <div>
            <span>CBSE-X</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-4 ">abcvdadvadv</div>
        <div className="col-4 ">abcasvadvad</div>
        <div className="col-4 ">abcvadvdv</div>
      </div>
      <div>
        <div>
          <div>
            <span>Push Notifications</span>
          </div>
          <div>
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shashank;
