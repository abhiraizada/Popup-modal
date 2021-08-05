import React, { useState, useEffect } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Button from "react-bootstrap/Button";

import "./AccountPageTabs.css";

const AccountPageTabs = (props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <div className="d-flex " style={{ justifyContent: "space-between" }}>
        <ButtonGroup className="me-2 ml-2" aria-label="First group">
          <Button>Account Details</Button> <Button>Parent Details</Button>
          <Button>Order Details</Button>
        </ButtonGroup>

        {/* <div className="d-flex">
          <Button>Account Details</Button>
          <Button>Parent Details</Button>
          <Button>Order Details</Button>
        </div> */}
        <div className="push-notif d-flex">
          <span className="mr-2">Push Notification</span>
          <div>
            <label class="switch">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleOnChange}
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPageTabs;
