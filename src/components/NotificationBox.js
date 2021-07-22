import React, { useEffect, useState } from "react";
// import code from "./code.mp4";
// import { Accordion } from "react-bootstrap";
// import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import "./NotificationBox.css";
import NotificationTile from "./NotificationTile";
import { Container, Row, Col } from "react-bootstrap";
const NotificationBox = () => {
  const [notifications, setNotifications] = useState([]);
  //   useEffect(() => {
  //     fetch("https://jsonplaceholder.typicode.com/posts")
  //       .then((response) => response.json())
  //       .then((data) => setNotifications(data));
  //   }, []);

  const data = [
    { heading: "Test Alert", details: "Your weekly test is scheduled" },
    {
      heading: "Test Alert",
      details: "Your weekly test is scheduled",
      dynamic: "img",
    },
    { heading: "Test Alert", details: "Your weekly test is scheduled" },
    {
      heading: "Test Alert",
      details: "Your weekly test is scheduled",
      dynamic: "img",
    },
  ];

  data.map((el) => {
    el.dynamic ? console.log("hello") : console.log("hi");
  });

  return (
    <div>
      <h1>Notification</h1>
      <hr></hr>
      {/* <div className="notifi-area">
        {data.map((el) =>
          el.dynamic ? (
            <NotificationTile dynamicContent={el.dynamic} />
          ) : (
            <NotificationTile />
          )
        )}
      </div> */}

      <h1>Testing</h1>
      <Container>
        {data.map((notificationData) => (
          <Row>
            <Col>
              <NotificationTile data={notificationData} />
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default NotificationBox;
