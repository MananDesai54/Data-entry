import "./App.css";
import AddPerson from "./components/AddPerson";
import "materialize-css/dist/css/materialize.min.css";
import { BrowserRouter, Link, NavLink, Route } from "react-router-dom";
import List from "./components/List";
import UpdatePerson from "./components/UpdatePerson";
import Login from "./components/Login";
import M from "materialize-css";
import { Fragment, useEffect, useRef, useState } from "react";

function App() {
  const floatingButton = useRef();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    M.FloatingActionButton.init(floatingButton.current);
    if (localStorage.getItem("isLoggedIn")) {
      setIsAuth(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            {isAuth && (
              <Fragment>
                <ul id="nav-mobile" className="right">
                  <li>
                    <NavLink
                      activeStyle={{
                        color: "black",
                        textDecoration: "underline",
                      }}
                      exact
                      to="/"
                    >
                      Add person
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeStyle={{
                        color: "black",
                        textDecoration: "underline",
                      }}
                      to="/list"
                    >
                      List
                    </NavLink>
                  </li>
                  <li>
                    <a href="#user">{localStorage.getItem("user")}</a>
                  </li>
                  <li
                    onClick={() => {
                      setIsAuth(false);
                      localStorage.clear();
                    }}
                  >
                    <a href="#user">Logout</a>
                  </li>
                </ul>
              </Fragment>
            )}
          </div>
        </nav>
      </div>
      <div className="fixed-action-btn">
        <Link
          ref={floatingButton}
          to="/"
          className="btn-floating btn-large waves-effect waves-light red"
        >
          <i className="material-icons">add</i>
        </Link>
      </div>
      <div className="App">
        {isAuth ? (
          <Fragment>
            <Route path="/" exact component={AddPerson} />
            <Route path="/list" exact component={List} />
            <Route path="/person/:id" exact component={UpdatePerson} />
          </Fragment>
        ) : (
          <Route
            path="/"
            render={(props) => <Login {...props} setIsAuth={setIsAuth} />}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
