import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

const OrderIdDetails = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col sm>
            <div className="order-line-1">Order id</div>
            <span>OD1273912</span>
          </Col>
          <Col sm>
            <div className="order-line-1">Date of Purchase</div>
            <span>20 Aug, 2020</span>
          </Col>
          <Col sm>
            <div className="order-line-1">Total Amount</div>
            <span>
              Rs. 25000 <Link to="/Path"> Contact us </Link>
            </span>
          </Col>
          <Col sm>
            <div className="order-line-1">Validity</div>
            <span>29 Dec 2022</span>
          </Col>
          <Col sm>
            <div className="order-line-1">Active</div>
            <span>
              <Link to="/Path"> Extend Now </Link>
            </span>
          </Col>
          <Col sm>
            <div className="order-line-1">Invoice</div>
            <Link to="/Path"> Download </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderIdDetails;
