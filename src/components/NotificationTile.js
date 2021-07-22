import { useHistory } from "react-router-dom";

import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import "./NotificationTile.css";
const NotificationTile = ({ data }) => {
  const history = useHistory();
  return (
    <div>
      {/* <button onClick={() => history.goBack()}>Go Back</button> */}
      {data.dynamic ? (
        <div className="notifi-accordian">
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle eventKey="0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut
                </Accordion.Toggle>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id
                  <p className="notifi-time">10 Minutes ago</p>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
      ) : (
        <div className="notifi-card">
          <Card>
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <p className="notifi-time">10 Minutes ago</p>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NotificationTile;
