import React from "react";
import OrderIdCourseDetails from "./OrderIdCourseDetails";
import OrderIdDetails from "./OrderIdDetails";
import "./OrderInfo.css";
const OrderInfo = () => {
  const arr = [1, 2];
  // For mobile turn below flag to true
  const isSmallScreen = true;
  return (
    <div>
      <h3 className="text-left">Order Details</h3>

      {isSmallScreen
        ? arr.map(() => (
            <div className="order-info">
              <OrderIdCourseDetails />
              <hr />
              <OrderIdDetails />
            </div>
          ))
        : arr.map(() => (
            <div className="order-info">
              <OrderIdDetails />
              <hr />
              <OrderIdCourseDetails />
            </div>
          ))}
    </div>
  );
};

export default OrderInfo;
