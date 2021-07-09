import "./App.css";
import Dashboard from "./components/Dashboard";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import Resize from "./components/Resize";
import TestInstructionsModal from "./components/TestInstructionsModal";
import ChatModal2 from "./components/ChatModal2";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Dashboard} exact />
        <Route path="/resize" component={Resize} exact />
        <Route path="/test" component={TestInstructionsModal} exact />

        <Route path="/modal" component={ChatModal2} exact />
      </Switch>
    </div>
  );
}

export default App;
