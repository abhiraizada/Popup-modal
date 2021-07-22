import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

const Shashank = (props) => {
  const [eventKey, setEventKey] = useState(0);
  var props = {
    activeEventKey: 0,
    index: 1,
    title: "Title",
    body:
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
  };
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
    </div>
  );
};

export default Shashank;
