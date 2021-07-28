import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import "./ResumePractiseTest.css";
const ResumePractiseTest = ({ data }) => {
  console.log("props", data);
  return (
    <div>
      <div className="practise-card">
        <Card className="m10">
          <Card.Body>
            <Card.Title>{data.content_title}</Card.Title>
            <Card.Text>
              <div>
                Questions:{data.total_questions} | Max Marks:{data.max_marks}
              </div>
              <div>Time: {data.total_time_mins} mins</div>
              <div>Subject Name</div>
            </Card.Text>
          </Card.Body>
          <button className="resume-btn">Resume Practise Test</button>
        </Card>
      </div>
    </div>
  );
};

export default ResumePractiseTest;
