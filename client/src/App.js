import "./App.css";
import AddPerson from "./components/AddPerson";
import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, Link, Route } from "react-router-dom";
import List from "./components/List";
import UpdatePerson from "./components/UpdatePerson";

function App() {
  return (
    <BrowserRouter>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <ul id="nav-mobile" className="right">
              <li>
                <Link to="/">Add person</Link>
              </li>
              <li>
                <Link to="/list">List</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="App">
        <Route path="/" exact component={AddPerson} />
        <Route path="/list" exact component={List} />
        <Route path="/person/:id" exact component={UpdatePerson} />
      </div>
    </BrowserRouter>
  );
}

export default App;
