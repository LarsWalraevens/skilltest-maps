import logo from './logo.svg';
import './App.css';
import Home from './components/home.js';
import Loc from './components/loc.js';
import Loc2 from './components/locClass.js';
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
