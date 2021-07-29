import React from "react";
import play from "./R.png";
import Card from "react-bootstrap/Card";
const ResumeContent = ({ data }) => {
  return (
    <div>
      <div className="practise-card">
        <Card className="m10">
          <Card.Body>
            <Card.Title>Content</Card.Title>
            {/* <Card.Text>
              <div>
                Questions:{data.total_questions} | Max Marks:{data.max_marks}
              </div>
              <div>Time: {data.total_time_mins} mins</div>
              <div>Subject Name</div>
            </Card.Text> */}
            <Card.Text>
              <div>
                <p>Play Button</p>
                <img src={play} alt="play" height="42" width="42"></img>
              </div>
            </Card.Text>
          </Card.Body>
          <button className="resume-btn">Click To Play</button>
        </Card>
      </div>
    </div>
  );
};

export default ResumeContent;
