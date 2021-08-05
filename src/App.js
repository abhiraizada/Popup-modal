import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Resize from "./components/Resize";
import TestInstructionsModal from "./components/TestInstructionsModal";
import ChatModal2 from "./components/ChatModal2";
import NotificationBox from "./components/NotificationBox";
import Cm from "./components/Cm";
import Shashank from "./components/Shashank";
import Settings from "./components/Settings";
import AccountPageTabs from "./components/AccountPageTabs";
// import "font-awesome/css/font-awesome.min.css";
// import "assets/fonts/font-awesome.min.css";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
        <Route path="/not" component={NotificationBox} exact />
        <Route path="/sh" component={Shashank} exact />
        <Route path="/setting" component={Settings} exact />
        <Route path="/acc" component={AccountPageTabs} exact />
      </Switch>
    </div>
  );
}

export default App;
