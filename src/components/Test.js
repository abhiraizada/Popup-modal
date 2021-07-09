import React from "react";

const Test = ({ data, setTest }) => {
  return (
    <div>
      <button onClick={() => setTest("hnji")}>test</button>
      <p>{data}</p>
    </div>
  );
};

export default Test;
