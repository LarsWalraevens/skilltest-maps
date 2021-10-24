import './App.css';
import Loc from './Loc.js';
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={Loc} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
