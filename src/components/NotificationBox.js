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
import { useHistory } from "react-router-dom";

const NotificationBox = () => {
  const history = useHistory();
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
  let count = 0;
  // notificationData._embedded.notifications

  return (
    <div>
      <div className="notification-header">
        <i class="fas fa-arrow-left"></i>
        <button onClick={() => history.goBack()}>back</button>
        <h1>
          {/* <span onClick={() => history.back()>
            // <i class="fa fa-arrow-left"></i>
            
          </span> */}
          Notification
        </h1>
      </div>
      <hr></hr>
      {console.log("count", count)}
      {count === 0 && (
        <Container>
          <Row>
            <Col>
              <div className="no-alert">
                <Card className="text-center">
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>No Alerts Yet</Card.Title>
                    <Card.Text>
                      You have no notifications right now. Come back later
                    </Card.Text>
                    <Card.Text>Come back later</Card.Text>
                    <Button variant="primary">Continue Learning</Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      )}
      {/* <div className="notifi-area">
        {data.map((el) =>
          el.dynamic ? (
            <NotificationTile dynamicContent={el.dynamic} />
          ) : (
            <NotificationTile />
          )
        )}
      </div> */}
      <Container>
        {count > 0 &&
          data.map((notificationData) => (
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
