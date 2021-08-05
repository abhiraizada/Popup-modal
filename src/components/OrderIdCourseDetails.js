import React from "react";
import logo from "./logo.jpg";
import { Link } from "react-router-dom";
import "./OrderIdCourseDetails.css";
const OrderIdCourseDetails = () => {
  return (
    <div className="course-details">
      <div className="d-flex">
        <div>
          <img src="" width="100px" height="100px"></img>
        </div>
        <div className=".text-left">
          <div>JEE Course | Short Term</div>
          <div>Start on: 15 Aug</div>
          <div>Timing: Mon, Wed, Fri</div>
        </div>
      </div>
      <div>
        <div>Auto Renewed</div>
        <Link path="/">Disable</Link>
      </div>
    </div>
  );
};

export default OrderIdCourseDetails;
