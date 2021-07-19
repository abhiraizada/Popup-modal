import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Resize from "./components/Resize";
import TestInstructionsModal from "./components/TestInstructionsModal";
import ChatModal2 from "./components/ChatModal2";
import Cm from "./components/Cm";
function App() {
  const messageData = [
    { teacher_message: "Hello", time: "6:28 PM" },
    { teacher_message: "i am teacher", time: "6:29 PM" },
    { teacher_message: "Hello", time: "6:28 PM" },
  ];

  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Dashboard} exact />
        <Route path="/resize" component={Resize} exact />
        <Route path="/test" component={TestInstructionsModal} exact />

        <Route path="/modal" component={ChatModal2} exact />
        <Route path="/modal2" component={Cm} props={messageData} exact />
      </Switch>
    </div>
  );
}

export default App;
